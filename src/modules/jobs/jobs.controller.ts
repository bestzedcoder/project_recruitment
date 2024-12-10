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
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { IUser } from "../users/users.interface";
import { Public, ResponseMessage, User } from "src/decorator/customize";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ResponseMessage("Create a new job")
  @Post()
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @ResponseMessage("Fetch all jobs with pagination")
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage("Fetch a job by id")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @ResponseMessage("Update a job")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser,
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @ResponseMessage("Delete a job")
  @Delete(":id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
