import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from '../../generated/prisma/client';

export class CreateCategoryDto implements Partial<Category> {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
