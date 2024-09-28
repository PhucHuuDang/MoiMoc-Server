import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PhoneModule } from './phone/phone.module';
import { ProductsModule } from './products/products.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { CommentsModule } from './comments/comments.module';
import { AddressModule } from './address/address.module';
import { IngredientsModule } from './ingredients/ingredients.module';

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PhoneModule,
    ProductsModule,
    ProductImagesModule,
    ProductCategoryModule,
    CommentsModule,
    AddressModule,
    IngredientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
