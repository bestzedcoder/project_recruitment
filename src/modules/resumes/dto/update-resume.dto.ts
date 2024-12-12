import { PartialType } from "@nestjs/mapped-types";
import { CreateResumeDto } from "./create-resume.dto";
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import mongoose, { mongo, Types } from "mongoose";

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @IsArray({ message: "History phải là một mảng" })
  @Type(() => History)
  @IsNotEmpty({ message: "history không được bỏ trống" })
  @ValidateNested({ each: true })
  history: History[];
}

class UpdatedBy {
  @IsNotEmpty({ message: "_id không được bỏ trống" })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: "email không được bỏ trống" })
  @IsEmail({ message: "email không đúng định dạng" })
  email: string;
}

class History {
  @IsNotEmpty({ message: "status không được bỏ trống" })
  status: string;

  @IsNotEmpty({ message: "updatedAt không được bỏ trống" })
  @Transform(({ value }) => new Date(value))
  updatedAt: Date;

  @IsNotEmpty({ message: "updatedBy không được bỏ trống" })
  @ValidateNested()
  @IsObject()
  @Type(() => UpdatedBy)
  updatedBy: UpdatedBy;
}
