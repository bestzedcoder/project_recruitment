import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Role, RoleDocument } from "./schema/role.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "../users/users.interface";
import mongoose from "mongoose";
import aqp from "api-query-params";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const isRoleExist = await this.roleModel.findOne({
      name: createRoleDto.name,
    });
    if (isRoleExist) {
      throw new BadRequestException("Role đã tồn tại");
    }
    const role = await this.roleModel.create({
      ...createRoleDto,
      createdBy: { _id: user._id, email: user.email },
    });

    return {
      _id: role._id,
      createdAt: role.createdAt,
    };
  }

  async findAll(current: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.pageSize;
    delete filter.current;
    let offset = (current - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();
    return {
      meta: {
        current, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Id không hợp lệ");
    }
    return (await this.roleModel.findById(id)).populate({
      path: "permissions",
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }, // số 1 là chọn số -1 là không chọn
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Id không hợp lệ");
    }

    return await this.roleModel.updateOne(
      { _id: id },
      {
        ...updateRoleDto,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("Id không hợp lệ");
    const isRoleAdmin = await this.roleModel.findById(id);
    if (isRoleAdmin.name === "ADMIN")
      throw new BadRequestException("Không thể xóa role ADMIN");

    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
      },
    );
    return await this.roleModel.softDelete({ _id: id });
  }
}
