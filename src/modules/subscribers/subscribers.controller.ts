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
import {
  PublicPermission,
  ResponseMessage,
  User,
} from "src/decorator/customize";
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

  @Post("skills")
  @ResponseMessage("Get subscriber's skills")
  @PublicPermission()
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getSkills(user);
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
  @PublicPermission()
  @Patch()
  update(
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @ResponseMessage("Delete subscriber")
  @Delete(":id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
