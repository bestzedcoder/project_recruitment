import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { DatabasesService } from "./databases.service";

@Controller("databases")
export class DatabasesController {
  constructor(private readonly databasesService: DatabasesService) {}
}
