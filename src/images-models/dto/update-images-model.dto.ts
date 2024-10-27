import { PartialType } from '@nestjs/mapped-types';
import { CreateImagesModelDto } from './create-images-model.dto';

export class UpdateImagesModelDto extends PartialType(CreateImagesModelDto) {}
