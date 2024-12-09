import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { AuthService } from "./auth.service";
import { Public, ResponseMessage } from "src/decorator/customize";
import { RegisterUserDto } from "src/modules/users/dto/create-user.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("User login")
  @Post("login")
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    console.log(req.user);
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage("Register a new user")
  @Post("register")
  handleRegister(@Body() register: RegisterUserDto) {
    return this.authService.register(register);
  }
}
