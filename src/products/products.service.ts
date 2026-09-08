import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../generated/prisma/client';
import { productCardSelect, productDetailSelect } from './products.select';

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

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
