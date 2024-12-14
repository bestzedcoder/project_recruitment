import { Controller, Get } from "@nestjs/common";
import { MailService } from "./mail.service";
import { Public, ResponseMessage } from "src/decorator/customize";
import { MailerService } from "@nestjs-modules/mailer";

@Controller("mail")
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
  ) {}
  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: "emhuy7a@gmail.com",
      from: '"Support Team" <support@example.com>', // override default from
      subject: "Welcome to Nice App! Confirm your Email",
      template: "test", // HTML body content
    });
  }
}
