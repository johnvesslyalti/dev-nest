import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
  Ip,
  Headers,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto/auth.dto";
import { Response, Request } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers("user-agent") userAgent: string,
  ) {
    const result = await this.authService.register(registerDto, ip, userAgent);
    this.setCookie(res, result.refreshToken);
    return {
      message: "User registered successfully",
      accessToken: result.accessToken,
      ...result.user,
    };
  }

  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers("user-agent") userAgent: string,
  ) {
    const result = await this.authService.login(loginDto, ip, userAgent);
    this.setCookie(res, result.refreshToken);
    return {
      message: "Login successful",
      accessToken: result.accessToken,
      ...result.user,
    };
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies["refreshToken"];
    await this.authService.logout(refreshToken);
    res.clearCookie("refreshToken");
    return { message: "Logged out successfully" };
  }

  @Post("refresh")
  async refresh(
    @Req() req: Request, 
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers("user-agent") userAgent: string,
  ) {
    const refreshToken = req.cookies["refreshToken"];
    const result = await this.authService.refresh(refreshToken, ip, userAgent);
    this.setCookie(res, result.refreshToken);
    return result;
  }

  @Post("delete")
  @UseGuards(AuthGuard("jwt"))
  async deleteAccount(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.softDelete(req.user.id);
    res.clearCookie("refreshToken");
    return { message: "Account deleted successfully" };
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async me(@Req() req: any) {
    return this.authService.me(req.user.id);
  }

  private setCookie(res: Response, token: string) {
    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
