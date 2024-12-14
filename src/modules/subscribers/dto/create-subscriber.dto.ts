import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
  @IsNotEmpty({ message: "Email không được bỏ trống" })
  @IsEmail({}, { message: "Email không đúng định dạng" })
  email: string;

  @IsNotEmpty({ message: "Name không được bỏ trống" })
  name: string;

  @IsNotEmpty({ message: "Skills không được bỏ trống" })
  @IsArray({ message: "Skills phải là một mảng" })
  @IsString({ each: true, message: "Skills phải là một mảng các chuỗi" })
  skills: string[];
}
