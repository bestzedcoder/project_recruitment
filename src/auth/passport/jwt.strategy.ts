import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IUser } from "src/modules/users/users.interface";
import { RolesService } from "src/modules/roles/roles.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private rolesService: RolesService,
  ) {
    // quá trình decode token sẽ sử dụng secret key này
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: IUser) {
    const { _id, name, email, role } = payload;

    const roleUser = role as unknown as { _id: string; name: string };
    const temp = (await this.rolesService.findOne(roleUser._id)).toObject();

    return {
      _id,
      name,
      email,
      role,
      Permissions: temp?.permissions ?? [],
    };
  }
}
