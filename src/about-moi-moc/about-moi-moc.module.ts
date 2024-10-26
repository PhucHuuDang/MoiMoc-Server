import { Module } from '@nestjs/common';
import { AboutMoiMocService } from './about-moi-moc.service';
import { AboutMoiMocController } from './about-moi-moc.controller';

@Module({
  controllers: [AboutMoiMocController],
  providers: [AboutMoiMocService],
})
export class AboutMoiMocModule {}
