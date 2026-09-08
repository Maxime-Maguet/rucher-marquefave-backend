import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Category } from '../../generated/prisma/client';

export class CreateCategoryDto implements Partial<Category> {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  nom!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;
}
