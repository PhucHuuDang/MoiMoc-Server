import { Module } from "@nestjs/common";
import { AboutMoiMocService } from "./about-moi-moc.service";
import { AboutMoiMocController } from "./about-moi-moc.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [AboutMoiMocController],
  providers: [AboutMoiMocService],
  imports: [DrizzleModule],
})
export class AboutMoiMocModule {}
