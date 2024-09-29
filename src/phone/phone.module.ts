import { Module } from "@nestjs/common";
import { PhoneService } from "./phone.service";
import { PhoneController } from "./phone.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [PhoneController],
  providers: [PhoneService],
  imports: [DrizzleModule],
  exports: [PhoneService],
})
export class PhoneModule {}
