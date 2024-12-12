import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Role, RoleDocument } from "./schema/role.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModule: SoftDeleteModel<RoleDocument>,
  ) {}
  create(createRoleDto: CreateRoleDto) {
    return "This action adds a new role";
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
