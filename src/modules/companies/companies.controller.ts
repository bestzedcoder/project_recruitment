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
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { IUser } from "../users/users.interface";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @ResponseMessage("Get all companies")
  @Public()
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage("Get company by id")
  @Get(":id")
  @Public()
  findOne(@Param("id") id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") idCompany: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(idCompany, user, updateCompanyDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
