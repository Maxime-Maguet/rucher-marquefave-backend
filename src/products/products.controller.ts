import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /** GET /products — vitrine publique (disponibles uniquement) */
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  /** GET /products/:slug — fiche produit publique */
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
