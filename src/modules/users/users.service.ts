import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { hashSync, genSaltSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({
      email: email,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const user = await this.userModel.create({
      password: hashPassword,
      name: createUserDto.name,
      email: createUserDto.email,
      address: createUserDto.address,
    });
    return user;
    // return createUserDto;
  }

  findAll() {
    return this.userModel.find({});
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return "not found user";
    return this.userModel.findById({ _id: id });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return "not found user";
    return this.userModel.softDelete({ _id: id });
  }
}
