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
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { IUser } from "./users.interface";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage("Create a new user")
  @Post()
  create(@Body() createUser: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUser, user);
  }

  @Public()
  @ResponseMessage("Fetch all users with pagination")
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @ResponseMessage("Fetch user by id")
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.usersService.findOne(id);
  }

  @ResponseMessage("Update a user")
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(updateUserDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a user")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
