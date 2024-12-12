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
import { ResumesService } from "./resumes.service";
import { CreateResumeDto, CreateUserCvDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { IUser } from "../users/users.interface";

@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @ResponseMessage("Create a new resume")
  @Post()
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @ResponseMessage("Fetch all resumes")
  @Public()
  @Get()
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+current, +pageSize, qs);
  }

  @Post("by-user")
  @ResponseMessage("Get Resume by User")
  getResumeByUser(@User() user: IUser) {
    return this.resumesService.findResumeByUser(user);
  }

  @ResponseMessage("Fetch a resume by id")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.resumesService.findOne(id);
  }

  @ResponseMessage("Update a resume by id")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body("status") status: string,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, status, user);
  }

  @ResponseMessage("Remove a resume by id")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.resumesService.remove(id);
  }
}
