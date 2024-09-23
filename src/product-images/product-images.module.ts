import { Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
  imports: [DrizzleModule],
})
export class ProductImagesModule {}
