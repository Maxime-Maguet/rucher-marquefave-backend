import { ProductVariant } from '../../generated/prisma/client';
import {
  IsNotEmpty,
  Min,
  Max,
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreateProductVariantDto implements Partial<ProductVariant> {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1500) // 1.5 kg
  poidsGramme!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  prix!: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku!: string;
}
