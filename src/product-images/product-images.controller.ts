import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly imagesProductService: ProductImagesService) {}

  @Post()
  create(@Body() createImagesProductDto: any) {
    return this.imagesProductService.addProductImages(createImagesProductDto);
  }

  @Get()
  findAll() {
    return this.imagesProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesProductService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ) {
    return this.imagesProductService.update(+id, updateProductImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesProductService.remove(+id);
  }
}
