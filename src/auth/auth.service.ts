import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    const { name, username, email, password } = data;

    const emailExists = await this.prisma.user.findUnique({ where: { email } });
    if (emailExists) throw new ConflictException('Email already exists');

    const usernameExists = await this.prisma.user.findUnique({ where: { username } });
    if (usernameExists) throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // TODO: Trigger email queue

    return {
      user: { id: user.id, name: user.name, username: user.username, email: user.email },
      ...tokens,
    };
  }

  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, username: user.username, email: user.email },
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.updateRefreshToken(userId, null);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_SECRET') || 'refresh_secret_key',
      });

      const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
      if (!user || user.refreshToken !== refreshToken) {
         throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { id: user.id },
        { 
          secret: this.configService.get<string>('ACCESS_SECRET') || 'access_secret_key',
          expiresIn: '15m' 
        }
      );

      return { accessToken: newAccessToken };

    } catch (e) {
      throw new UnauthorizedException('Expired or invalid refresh token');
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return {
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      }
    };
  }

  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId },
        { 
          secret: this.configService.get<string>('ACCESS_SECRET') || 'access_secret_key',
          expiresIn: '15m' 
        },
      ),
      this.jwtService.signAsync(
        { id: userId },
        { 
          secret: this.configService.get<string>('REFRESH_SECRET') || 'refresh_secret_key',
          expiresIn: '7d' 
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
