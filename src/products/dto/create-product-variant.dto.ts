import { Type, Transform } from 'class-transformer';
import { ProductVariant } from '../../generated/prisma/client';
import {
  Min,
  Max,
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';
import { trimString } from '../../common/helpers/trim.helper';

export class CreateProductVariantDto implements Partial<ProductVariant> {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1500) // 1.5 kg
  poidsGramme!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999.99)
  prix!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100_000)
  stock?: number;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Z0-9][A-Z0-9\-_]{1,49}$/i)
  sku!: string;
}
