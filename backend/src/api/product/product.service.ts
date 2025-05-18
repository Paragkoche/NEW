import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Product } from './enititys/product.enitity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddProductDto } from './dto/product/create.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepo: Repository<Product>,
  ) {}

  async getAllProduct() {
    return await this.ProductRepo.find({});
  }

  async getProductById(id: string) {
    const product = await this.ProductRepo.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
  async createPost(data: AddProductDto, fileUrl?: string, pdf?: string) {
    console.log(data);

    const isExitProduct = await this.ProductRepo.findOne({
      where: {
        name: data.name,
      },
    });
    console.log(isExitProduct);

    if (isExitProduct) {
      throw new UnprocessableEntityException(
        'duplicate product found, product name is respited',
      );
    }
    const newProduct = this.ProductRepo.create({
      name: data.name,
      pdfText: pdf,
      thumbnailUrl: fileUrl,
    });
    const product = await this.ProductRepo.save(newProduct);
    return product;
  }

  async updateProduct(
    id: string,
    data: Partial<AddProductDto>,
    fileUrl?: string,
    pdfUrl?: string,
  ) {
    console.log(data, fileUrl, pdfUrl);

    const product = await this.ProductRepo.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = {
      ...product,
      ...data,
      thumbnailUrl: fileUrl || product.thumbnailUrl,
      pdfText: pdfUrl || product.pdfText,
    };
    console.log(updatedProduct);

    return await this.ProductRepo.save(updatedProduct);
  }

  async deleteFun(id: string) {
    const data = await this.ProductRepo.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      throw new NotFoundException('Product not fount');
    }

    return this.ProductRepo.remove(data);
  }
}
