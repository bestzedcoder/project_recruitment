import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { hashSync, genSaltSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "./users.interface";
import { CreateUserDto, RegisterUserDto } from "./dto/create-user.dto";
import aqp from "api-query-params";
import { Role, RoleDocument } from "../roles/schema/role.schema";
import { USER_ROLE } from "src/databases/sample";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async findUserByUsername(username: string) {
    return await this.userModel
      .findOne({
        email: username,
      })
      .populate({ path: "role", select: { name: 1 } });
  }

  async register(user: RegisterUserDto) {
    const hashPassword = this.getHashPassword(user.password);
    const isExist = await this.userModel.findOne({ email: user.email });
    if (isExist)
      throw new BadRequestException(
        `Email : ${user.email} đã tồn tại trên hệ thống.Vui lòng nhập email khác`,
      );
    const role = await this.roleModel.findOne({ name: USER_ROLE });

    return await this.userModel.create({
      ...user,
      password: hashPassword,
      role: role?._id,
    });
  }

  async create(createUser: CreateUserDto, user: IUser) {
    const hashPassword = this.getHashPassword(createUser.password);
    const isExist = await this.userModel.findOne({ email: createUser.email });
    if (isExist)
      throw new BadRequestException(
        `Email : ${user.email} đã tồn tại trên hệ thống.Vui lòng nhập email khác`,
      );

    const newUser = await this.userModel.create({
      ...createUser,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.pageSize;
    delete filter.current;
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select("-password")
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return "not found user";
    const result = await this.userModel
      .findById({ _id: id })
      .select("-password")
      .populate({ path: "role", select: { _id: 1, name: 1 } });
    return result;
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("not found user");

    const isAdmin = await this.userModel.findById(id);
    if (isAdmin && isAdmin.email === "admin@gmail.com")
      throw new BadRequestException("Không thể xóa tài khoản admin");
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({ _id: id });
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByRefreshToken = async (refreshToken: string) => {
    return (await this.userModel.findOne({ refreshToken })).populate({
      path: "role",
      select: { name: 1 },
    });
  };
}
