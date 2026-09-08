import { ProductImage } from '../../generated/prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';

export class CreateProductImageDto implements Partial<ProductImage> {
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(2048)
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  ordre?: number;
}
