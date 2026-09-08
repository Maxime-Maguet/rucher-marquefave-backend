import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '../generated/prisma/client';
import { generateSlug } from '../common/helpers/slug.helper';
import { CategoryUpdateInput } from '../generated/prisma/models';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = generateSlug(createCategoryDto.nom);
    return await this.prisma.category.create({
      data: {
        nom: createCategoryDto.nom,
        description: createCategoryDto.description,
        slug,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        nom: true,
        slug: true,
        description: true,
      },
    });
  }

  async findOne(id: Category['id']) {
    return await this.prisma.category.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        nom: true,
        slug: true,
        description: true,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const data: CategoryUpdateInput = { ...updateCategoryDto };
    if (updateCategoryDto.nom) {
      data.slug = generateSlug(updateCategoryDto.nom);
    }
    return await this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
