import { Module } from "@nestjs/common";
import { DatabasesService } from "./databases.service";
import { DatabasesController } from "./databases.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/modules/users/schema/user.schema";
import { Role, RoleSchema } from "src/modules/roles/schema/role.schema";
import {
  Permission,
  PermissionSchema,
} from "src/modules/permissions/schema/permission.schema";
import { UsersService } from "src/modules/users/users.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService, UsersService],
})
export class DatabasesModule {}
