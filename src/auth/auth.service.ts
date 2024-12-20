import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "src/modules/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/modules/users/users.interface";
import { RegisterUserDto } from "src/modules/users/dto/create-user.dto";
import { ConfigService } from "@nestjs/config";
import ms from "ms";
import { Response } from "express";
import { RolesService } from "src/modules/roles/roles.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rolesService: RolesService,
  ) {}

  //username and password là 2 tham số thư viện passport sẽ truyền vào
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByUsername(email);
    if (user && this.usersService.isValidPassword(pass, user.password)) {
      const userRole = user.role as unknown as { _id: string; name: string };
      const temp = await this.rolesService.findOne(userRole._id);
      const objUser = {
        ...user.toObject(),
        permissions: temp?.permissions ?? [],
      };
      return objUser;
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role, permissions } = user;
    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      name,
      email,
      role,
    };
    const refreshToken = this.createRefreshToken(payload);
    // update refreshToken to user
    await this.usersService.updateUserToken(refreshToken, _id);

    // set cookie
    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRES")),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
        permissions,
      },
    };
  }

  async register(user: RegisterUserDto) {
    let newUser = await this.usersService.register(user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn:
        ms(this.configService.get<string>("JWT_REFRESH_EXPIRES")) / 1000,
    });
    return refreshToken;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      });
      let user = await this.usersService.findUserByRefreshToken(refreshToken);
      if (!user)
        throw new BadRequestException(
          "refresh token khong hop le.Vui long dang nhap lai",
        );
      else {
        const { _id, name, email, role } = user;
        const payload = {
          sub: "refresh token",
          iss: "from server",
          _id,
          name,
          email,
          role,
        };
        const refreshToken = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refreshToken, _id.toString());
        // fetch role user
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.rolesService.findOne(userRole._id);

        response.clearCookie("refresh_token");
        response.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRES")),
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role,
            permissions: temp?.permissions ?? [],
          },
        };
      }
    } catch (error) {
      throw new BadRequestException(
        " refresh token khong hop le.Vui long dang nhap lai",
      );
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken("", user._id);
    response.clearCookie("refresh_token");
    return "ok";
  };
}
