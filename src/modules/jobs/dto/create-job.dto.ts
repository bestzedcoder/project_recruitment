import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";
import mongoose from "mongoose";

class Company {
  @IsNotEmpty({ message: "company_id không được để trống" })
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: "company_name không được để trống" })
  name: string;
  @IsNotEmpty({ message: "logo không được để trống" })
  logo: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: "Name không được để trống" })
  name: string;

  @IsNotEmpty({ message: "Skills không được để trống" })
  @IsArray({ message: "Skills phải là một mảng" })
  @IsString({ each: true, message: "Skills định dạng là một string" })
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({ message: "Location không được để trống" })
  location: string;

  @IsNotEmpty({ message: "Quantity không được để trống" })
  quantity: number;

  @IsNotEmpty({ message: "Salary không được để trống" })
  salary: number;

  @IsNotEmpty({ message: "Level không được để trống" })
  level: string;

  @IsNotEmpty({ message: "Description không được để trống" })
  description: string;

  @IsNotEmpty({ message: "StartDate không được để trống" })
  @IsDate({ message: "StartDate phải là có định dạng Date" })
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsNotEmpty({ message: "EndDate không được để trống" })
  @IsDate({ message: "EndDate phải là có định dạng Date" })
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsNotEmpty({ message: "IsActive không được để trống" })
  @IsBoolean({ message: "IsActive phải là một boolean" })
  isActive: boolean;
}
