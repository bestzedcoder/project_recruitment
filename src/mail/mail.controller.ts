import { Controller, Get } from "@nestjs/common";
import { Public, ResponseMessage } from "src/decorator/customize";
import { MailerService } from "@nestjs-modules/mailer";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import {
  Subscriber,
  SubscriberDocument,
} from "src/modules/subscribers/schema/subscriber.schema";
import { Job, JobDocument } from "src/modules/jobs/schema/job.schema";
import { InjectModel } from "@nestjs/mongoose";

@Controller("mail")
export class MailController {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private readonly jobModel: SoftDeleteModel<JobDocument>,
  ) {}
  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    const jobs = [
      {
        name: "test",
        company: "test",
        salary: "test",
        skills: ["React", "NodeJS"],
      },
      {
        name: "test22",
        company: "test22",
        salary: "test22",
        skills: ["React", "NodeJS"],
      },
    ];

    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: { $in: subsSkills },
      });
      // console.log(jobWithMatchingSkills);
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((job) => {
          return {
            name: job.name,
            company: job.company.name,
            salary:
              `${job.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ",
            skills: job.skills,
          };
        });
        //send email
        await this.mailerService.sendMail({
          to: "quachlinh1252004@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from
          subject: "Welcome to Nice App! Confirm your Email",
          template: "job", // HTML body content
          context: {
            receiver: subs.name,
            jobs,
          },
        });
      }
      //build template
    }
  }
}
