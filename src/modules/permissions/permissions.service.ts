import { BadRequestException, Injectable } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Permission, PermissionDocument } from "./schema/permission.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "../users/users.interface";
import aqp from "api-query-params";
import mongoose from "mongoose";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const isCheckPermission = await this.permissionModel.findOne({
      apiPath: createPermissionDto.apiPath,
      method: createPermissionDto.method,
    });
    console.log(isCheckPermission);
    if (isCheckPermission) {
      throw new BadRequestException("Permission đã tồn tại");
    }

    const permission = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: { _id: user._id, email: user.email },
    });

    return {
      _id: permission._id,
      createdAt: permission.createdAt,
    };
  }

  async findAll(current: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.pageSize;
    delete filter.current;
    let offset = (current - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.permissionModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("Id is invalid");
    return await this.permissionModel.findById(id);
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("Id is invalid");
    const isCheckPermission = await this.permissionModel.findOne({
      apiPath: updatePermissionDto.apiPath,
      method: updatePermissionDto.method,
    });
    if (isCheckPermission) {
      throw new BadRequestException("Permission đã tồn tại");
    }

    const permission = await this.permissionModel.updateOne(
      { _id: id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return permission;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("Id is invalid");

    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
      },
    );
    return await this.permissionModel.softDelete({ _id: id });
  }
}
