import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ResponseMessage, User } from "src/decorator/customize";
import { IUser } from "../users/users.interface";

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ResponseMessage("Create a role")
  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @ResponseMessage("Fetch all roles")
  @Get()
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string,
  ) {
    return this.rolesService.findAll(+current, +pageSize, qs);
  }

  @ResponseMessage("Fetch a role by id")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.rolesService.findOne(id);
  }

  @ResponseMessage("Update a role")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @ResponseMessage("Remove a role")
  @Delete(":id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
