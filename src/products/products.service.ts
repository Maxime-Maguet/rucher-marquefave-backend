import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductUpdateInput } from '../generated/prisma/models';
import { Product } from '../generated/prisma/client';
import { productCardSelect, productDetailSelect } from './products.select';
import { generateSlug } from '../common/helpers/slug.helper';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.product.findMany({
      where: { estDisponible: true },
      orderBy: [{ misEnAvant: 'desc' }, { nom: 'asc' }],
      select: productCardSelect,
    });
  }

  async findBySlug(slug: Product['slug']) {
    return await this.prisma.product.findUniqueOrThrow({
      where: { slug },
      select: productDetailSelect,
    });
  }

  async create(createProductDto: CreateProductDto) {
    const { nom, variantes, images, ...rest } = createProductDto;
    const slug = generateSlug(nom);
    return await this.prisma.product.create({
      data: {
        ...rest,
        nom,
        slug,
        variantes: {
          create: variantes,
        },
        images: images?.length
          ? {
              create: images,
            }
          : undefined,
      },
      select: productDetailSelect,
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const data: ProductUpdateInput = { ...updateProductDto };
    if (updateProductDto.nom) {
      data.slug = generateSlug(updateProductDto.nom);
    }
    return await this.prisma.product.update({
      where: { id },
      data,
      select: productDetailSelect,
    });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }
}
