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
import { SubscribersService } from "./subscribers.service";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";
import { UpdateSubscriberDto } from "./dto/update-subscriber.dto";
import { ResponseMessage, User } from "src/decorator/customize";
import { IUser } from "../users/users.interface";

@Controller("subscribers")
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @ResponseMessage("Create subscriber successfully")
  @Post()
  create(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @ResponseMessage("Fetch all subscribers")
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage("Fetch subscriber by id")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.subscribersService.findOne(id);
  }

  @ResponseMessage("Update subscriber successfully")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.update(id, updateSubscriberDto, user);
  }

  @ResponseMessage("Delete subscriber")
  @Delete(":id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
