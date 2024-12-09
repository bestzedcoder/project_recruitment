import { Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from "class-validator";
import mongoose from "mongoose";
export class RegisterUserDto {
  @IsNotEmpty({ message: "Name không được để trống" })
  name: string;

  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty({ message: "Email không được để trống" })
  email: string;

  @IsNotEmpty({ message: "Password không được để trống" })
  password: string;

  @IsNotEmpty({ message: "Age không được để trống" })
  address: string;

  @IsNotEmpty({ message: "Age không được để trống" })
  age: number;

  @IsNotEmpty({ message: "gender không được để trống" })
  gender: string;
}

class Company {
  @IsNotEmpty({ message: "company_id không được để trống" })
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: "company_name không được để trống" })
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: "Name không được để trống" })
  name: string;

  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty({ message: "Email không được để trống" })
  email: string;

  @IsNotEmpty({ message: "Password không được để trống" })
  password: string;

  @IsNotEmpty({ message: "Age không được để trống" })
  address: string;

  @IsNotEmpty({ message: "Age không được để trống" })
  age: number;

  @IsNotEmpty({ message: "gender không được để trống" })
  gender: string;

  @IsNotEmpty({ message: "role không được để trống" })
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
