import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Category } from '../../generated/prisma/client';
import {
  trimString,
  trimToUndefined,
} from '../../common/helpers/trim.helper';

export class CreateCategoryDto implements Partial<Category> {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  nom!: string;

  @IsOptional()
  @Transform(trimToUndefined)
  @IsString()
  @MaxLength(200)
  description?: string;
}
