import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { trimString, trimToUndefined } from '../../common/helpers/trim.helper';
import { MaxCurrentYear } from '../../common/validators/max-current-year.decorator';
import { CreateProductImageDto } from './create-product-image.dto';
import { CreateProductVariantDto } from './create-product-variant.dto';

export class CreateProductDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nom!: string;

  @IsOptional()
  @Transform(trimToUndefined)
  @IsString()
  @MaxLength(300)
  resume?: string;

  @IsOptional()
  @Transform(trimToUndefined)
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @Transform(trimToUndefined)
  @IsString()
  @MaxLength(150)
  origine?: string;

  @IsOptional()
  @Transform(trimToUndefined)
  @IsString()
  @MaxLength(150)
  fleuraison?: string;

  @IsOptional()
  @Transform(trimToUndefined)
  @IsString()
  @MaxLength(100)
  typeMiel?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @MaxCurrentYear()
  anneeRecolte?: number;

  @IsOptional()
  @IsBoolean()
  misEnAvant?: boolean;

  @IsOptional()
  @IsBoolean()
  estDisponible?: boolean;

  @Transform(trimString)
  @IsUUID('4')
  categoryId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variantes!: CreateProductVariantDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];
}
