import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { AuthService } from "./auth.service";
import { Public, ResponseMessage } from "src/decorator/customize";
import { RegisterUserDto } from "src/modules/users/dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  handleLogin(@Request() req) {
    console.log(req.user);
    return this.authService.login(req.user);
  }

  @Public()
  @ResponseMessage("Register a new user")
  @Post("register")
  handleRegister(@Body() register: RegisterUserDto) {
    return this.authService.register(register);
  }
}
