import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { LocalAuthGuard } from "./auth/guard/local-auth.guard";
import { AuthService } from "./auth/auth.service";
import { Public } from "./decorator/customize";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
