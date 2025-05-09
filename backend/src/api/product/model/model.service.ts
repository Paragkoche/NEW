import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from './enitity/model.enitity';
import { Repository } from 'typeorm';
import { ModelCreateDto } from './dto/create.dto';
import { Product } from '../enititys/product.enitity';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepo: Repository<Product>,

    @InjectRepository(Model)
    private readonly ModelRepo: Repository<Model>,
  ) {}
  async createModel(data: ModelCreateDto, url: string) {
    const product = await this.ProductRepo.findOne({
      where: {
        id: data.productId,
      },
    });
    if (!product) {
      throw new UnprocessableEntityException('product not found');
    }
    const newProduct = this.ModelRepo.create({
      ...data,
      url: url,
      product: {
        id: product.id,
      },
    });
    const dbProduct = await this.ModelRepo.save(newProduct);
    return {
      data: dbProduct,
    };
  }
  async getAllModel() {
    return await this.ModelRepo.find();
  }
  async getAllByIdModel(productId: number) {
    const product = await this.ProductRepo.findOne({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return await this.ModelRepo.find({
      where: {
        product: {
          id: productId,
        },
      },
      relations: {
        mash: {
          mashVariants: true,
          fabricRange: {
            fabric: true,
          },
        },
      },
    });
  }
}
