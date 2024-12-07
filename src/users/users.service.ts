import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { hashSync, genSaltSync, compareSync } from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
    return this.userModel.deleteOne({ _id: id });
  }
}
