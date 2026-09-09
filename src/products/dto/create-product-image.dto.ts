import { Transform, Type } from 'class-transformer';
import { ProductImage } from '../../generated/prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import {
  trimString,
  trimToUndefined,
} from '../../common/helpers/trim.helper';

export class CreateProductImageDto implements Partial<ProductImage> {
  @Transform(trimString)
  @IsNotEmpty()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  @MaxLength(2048)
  url!: string;

  @IsOptional()
  @Transform(trimToUndefined)
  @IsString()
  @MaxLength(255)
  altText?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(999)
  ordre?: number;
}
