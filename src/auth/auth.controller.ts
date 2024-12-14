import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { AuthService } from "./auth.service";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { RegisterUserDto } from "src/modules/users/dto/create-user.dto";
import { Response, Request } from "express";
import { IUser } from "src/modules/users/users.interface";
import { RolesService } from "src/modules/roles/roles.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("User login")
  @Post("login")
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage("Register a new user")
  @Post("register")
  handleRegister(@Body() register: RegisterUserDto) {
    return this.authService.register(register);
  }

  @ResponseMessage("Get user information")
  @Get("account")
  async handleGetAccount(@User() user: IUser) {
    const temp = (await this.rolesService.findOne(user.role._id)) as any;
    user.permissions = temp.permissions;
    return { user };
  }

  @Public()
  @ResponseMessage("Get user by refresh token")
  @Get("refresh")
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies["refresh_token"];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage("Logout user")
  @Post("logout")
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
