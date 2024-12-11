import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
  @IsNotEmpty({ message: "Email không được để trống" })
  email: string;

  @IsNotEmpty({ message: "UserId không được để trống" })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: "Url không được để trống" })
  url: string;

  @IsNotEmpty({ message: "Status không được để trống" })
  status: string; // PENDING-REVIEWING-APPROVED-REJECTED

  @IsNotEmpty({ message: "CompanyId không được để trống" })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: "JobId không được để trống" })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: "Url không được để trống" })
  url: string;

  @IsNotEmpty({ message: "CompanyId không được để trống" })
  @IsMongoId({ message: "CompanyId không đúng định dạng" })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: "JobId không được để trống" })
  @IsMongoId({ message: "JobId không đúng định dạng" })
  jobId: mongoose.Schema.Types.ObjectId;
}
