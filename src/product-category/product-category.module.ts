import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  imports: [DrizzleModule],
})
export class ProductCategoryModule {}
