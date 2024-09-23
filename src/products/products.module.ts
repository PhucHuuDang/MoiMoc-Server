import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductImagesService } from 'src/product-images/product-images.service';
import { ProductImagesModule } from 'src/product-images/product-images.module';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductImagesService],
  imports: [ProductImagesModule, DrizzleModule],
})
export class ProductsModule {}