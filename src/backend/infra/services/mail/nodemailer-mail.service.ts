import { IMailProps } from "@/backend/domain/entities";
import { IMailRepository } from "@/backend/domain/repositories";
import { Logger } from "@/shared";
import { getEnv } from "@/utils";
import * as nodemailer from "nodemailer";

export class NodemailerService implements IMailRepository {
  private readonly logger = Logger.withContext(NodemailerService.name);
  mailer: nodemailer.Transporter;

  constructor() {
    this.mailer = nodemailer.createTransport({
      from: getEnv("SMTP_FROM"),
      host: getEnv("SMTP_HOST"),
      port: getEnv("SMTP_PORT"),
      auth: {
        user: getEnv("SMTP_USER"),
        pass: getEnv("SMTP_PASSWORD"),
      },
    });

    this.mailer.verify((error) => {
      if (error) {
        console.error(error);
        this.logger.error(`Mail service connection error: ${error.message}`);
      } else {
        this.logger.info("Mail service is ready to send emails");
      }
    });
  }

  async send(props: IMailProps): Promise<void> {
    await this.mailer.sendMail({
      to: props.to,
      subject: props.subject,
      html: props.html,
      from: getEnv("SMTP_FROM"),
    });
  }
}
