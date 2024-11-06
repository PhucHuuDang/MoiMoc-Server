import { Module } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { FeedbackController } from "./feedback.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  imports: [DrizzleModule],
})
export class FeedbackModule {}
