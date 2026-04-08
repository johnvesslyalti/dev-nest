import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { EmailService } from "./email.service";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "email",
      forceDisconnectOnShutdown: true,
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
