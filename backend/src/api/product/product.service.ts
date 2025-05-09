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
  async createPost(data: AddProductDto, fileUrl?: string) {
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
      pdfText: data.pdfText,
      thumbnailUrl: fileUrl,
    });
    const product = await this.ProductRepo.save(newProduct);
    return product;
  }
}
