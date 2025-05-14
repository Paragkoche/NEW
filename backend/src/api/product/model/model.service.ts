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
      isDefault:
        typeof data.isDefault == 'string'
          ? data.isDefault === 'true'
          : data.isDefault,
      shadow:
        typeof data.shadow == 'string' ? data.shadow === 'true' : data.shadow,

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
        dimensions: true,

        mash: {
          mashVariants: {
            mash: true,
          },
          fabricRange: {
            fabric: true,
          },
        },
      },
    });
  }
  async getModelById(id: number) {
    const model = await this.ModelRepo.findOne({
      where: { id },
      relations: {
        dimensions: true,
        product: true,
        mash: {
          mashVariants: {
            mash: true,
          },
          fabricRange: {
            fabric: true,
          },
        },
      },
    });
    if (!model) {
      throw new NotFoundException('Model not found');
    }
    return model;
  }

  async updateModel(id: number, data: Partial<ModelCreateDto>, url?: string) {
    const model = await this.ModelRepo.findOne({ where: { id } });
    if (!model) {
      throw new NotFoundException('Model not found');
    }
    const updatedModel = this.ModelRepo.merge(model, {
      ...data,
      isDefault:
        typeof data.isDefault == 'string'
          ? data.isDefault === 'true'
          : data.isDefault,
      shadow:
        typeof data.shadow == 'string' ? data.shadow === 'true' : data.shadow,
      url: url || model.url,
    });
    return await this.ModelRepo.save(updatedModel);
  }

  async deleteModel(id: number) {
    const model = await this.ModelRepo.findOne({
      where: { id },
      relations: {
        mash: {
          mashVariants: {
            mash: true,
          },
        },
      },
    });
    if (!model) {
      throw new NotFoundException('Model not found');
    }
    await this.ModelRepo.remove(model);
    return { message: 'Model deleted successfully' };
  }

  async addViewCount(id: number) {
    const data = await this.ModelRepo.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      throw new NotFoundException('Product not fount');
    }
    return await this.ModelRepo.update(data.id, {
      viewCount: data.viewCount + 1,
    });
  }
}
