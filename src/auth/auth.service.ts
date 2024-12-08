import { Injectable } from "@nestjs/common";
import { UsersService } from "src/modules/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/modules/users/users.interface";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //username and password là 2 tham số thư viện passport sẽ truyền vào
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && this.usersService.isValidPassword(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: IUser) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      name,
      email,
      role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
