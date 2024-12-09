import { OmitType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateUserDto extends OmitType(CreateUserDto, [
  "password",
  "email",
] as const) {
  @IsNotEmpty({ message: "User id không được để trống" })
  _id: string;
}
