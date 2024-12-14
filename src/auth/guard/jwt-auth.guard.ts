import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "src/decorator/customize";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    const request: Request = context.switchToHttp().getRequest();

    if (err || !user) {
      throw err || new UnauthorizedException("Token không hợp lệ");
    }

    // check permission
    const targetMethod = request.method;
    const targetEndpoint = request.route?.path;
    // console.log(targetMethod, targetEndpoint);
    const permissions = user?.Permissions ?? [];
    // console.log(permissions);
    const isExist = permissions.find((permission) => {
      const { method, apiPath } = permission;
      return method === targetMethod && apiPath === targetEndpoint;
    });

    if (!isExist) {
      throw new ForbiddenException("Không có quyền truy cập");
    }

    return user;
  }
}
