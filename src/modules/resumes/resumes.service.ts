import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateResumeDto, CreateUserCvDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { IUser } from "../users/users.interface";
import { InjectModel } from "@nestjs/mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { Resume, ResumeDocument } from "./schema/resume.schema";
import aqp from "api-query-params";
import mongoose from "mongoose";

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}
  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const { companyId, jobId, url } = createUserCvDto;
    const { _id, email } = user;
    const result = await this.resumeModel.create({
      companyId,
      jobId,
      url,
      userId: _id,
      email,
      status: "PENDING",
      history: [
        {
          status: "PENDING",
          updatedAt: new Date(),
          updatedBy: {
            _id,
            email,
          },
        },
      ],
      createdBy: {
        _id,
        email,
      },
    });
    return {
      _id: result._id,
      createdAt: result.createdAt,
    };
  }

  async findAll(current: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.pageSize;
    delete filter.current;
    let offset = (current - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("Id is invalid");
    return (await this.resumeModel.findById(id)).populate([
      {
        path: "jobId",
        select: { name: 1 },
      },
      {
        path: "companyId",
        select: { name: 1 },
      },
    ]);
  }

  async update(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("invalid id format");
    return await this.resumeModel.updateOne(
      { _id: id },
      {
        status,
        $push: {
          history: {
            status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("Id is invalid");
    return await this.resumeModel.softDelete({ _id: id });
  }

  async findResumeByUser(user: IUser) {
    const result = await this.resumeModel
      .find({ userId: user._id })
      .sort("-createdAt")
      .populate([
        {
          path: "jobId",
          select: { name: 1 },
        },
        {
          path: "companyId",
          select: { name: 1 },
        },
      ]);
    return result;
  }
}
