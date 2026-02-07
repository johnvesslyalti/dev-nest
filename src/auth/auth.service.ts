import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { RegisterDto, LoginDto } from "./dto/auth.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private hashIp(ip: string): string {
    return crypto.createHash("sha256").update(ip).digest("hex");
  }

  async register(data: RegisterDto, ip: string, userAgent: string) {
    const { name, username, email, password } = data;

    const emailExists = await this.prisma.user.findUnique({ where: { email } });
    if (emailExists) throw new ConflictException("Email already exists");

    const usernameExists = await this.prisma.user.findUnique({
      where: { username },
    });
    if (usernameExists) throw new ConflictException("Username already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedIp = this.hashIp(ip);

    const user = await this.prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        lastLoginAt: new Date(),
        lastLoginIp: hashedIp,
        lastLoginUserAgent: userAgent,
      },
    });

    const tokens = await this.generateTokens(user.id, ip, userAgent);

    // TODO: Trigger email queue

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      ...tokens,
    };
  }

  async login(data: LoginDto, ip: string, userAgent: string) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    if (user.deletedAt) throw new UnauthorizedException("Account disabled");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException("Invalid credentials");

    const hashedIp = this.hashIp(ip);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: hashedIp,
        lastLoginUserAgent: userAgent,
      },
    });

    const tokens = await this.generateTokens(user.id, ip, userAgent);

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return;
    await this.prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });
  }

  async refresh(oldToken: string, ip: string, userAgent: string) {
    if (!oldToken) throw new UnauthorizedException("No refresh token");

    try {
      const payload = this.jwtService.verify(oldToken, {
        secret:
          this.configService.get<string>("REFRESH_SECRET") ||
          "refresh_secret_key",
      });

      const savedToken = await this.prisma.refreshToken.findUnique({
        where: { token: oldToken },
        include: { user: true },
      });

      if (!savedToken) throw new UnauthorizedException("Invalid refresh token");

      // Reuse Detection
      if (savedToken.replacedByToken) {
        // Security: Revoke all tokens for this user
        await this.prisma.refreshToken.updateMany({
          where: { userId: savedToken.userId },
          data: { revokedAt: new Date() },
        });
        throw new UnauthorizedException("Refresh token reused");
      }

      if (savedToken.revokedAt) {
        throw new UnauthorizedException("Token revoked");
      }

      const user = savedToken.user;
      if (!user || user.deletedAt) throw new UnauthorizedException("User not found or disabled");

      const tokens = await this.generateTokens(user.id, ip, userAgent);
      
      // Update chain
      await this.prisma.refreshToken.update({
        where: { id: savedToken.id },
        data: { 
          revokedAt: new Date(),
          replacedByToken: tokens.refreshToken 
        },
      });

      return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException("Expired or invalid refresh token");
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deletedAt) throw new UnauthorizedException("User not found");
    return {
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  private async generateTokens(userId: string, ip: string, userAgent: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId },
        {
          secret:
            this.configService.get<string>("ACCESS_SECRET") ||
            "access_secret_key",
          expiresIn: "15m",
        },
      ),
      this.jwtService.signAsync(
        { id: userId, tokenId: crypto.randomUUID() },
        {
          secret:
            this.configService.get<string>("REFRESH_SECRET") ||
            "refresh_secret_key",
          expiresIn: "7d",
        },
      ),
    ]);

    const hashedIp = this.hashIp(ip);

    // Store in DB
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        ipAddress: hashedIp,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    return { accessToken, refreshToken };
  }

  async softDelete(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
    
    // Revoke all tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });
  }
}
