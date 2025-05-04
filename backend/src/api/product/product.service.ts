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
import { ModelCreateDto } from './dto/Model/create.dto';
import { Model } from './enititys/model.enitity';
import { Dimensions } from './enititys/dimensions.enitity';
import { dimensionsCreateDto } from './dto/dimensions/create.dto';
import { FabricRage } from './enititys/fabric-rage.enitity';
import { createFabricRage } from './dto/fabric-rage/create.dto';
import { CreateFabricDTO } from './dto/fabric/create.dto';
import { Fabric } from './enititys/fabric.enitity';
import MashCreteDTO from './dto/Mash/create.dto';
import { Mash } from './enititys/mash.enitity';
import { MashVariants } from './enititys/mash-variants.enitity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepo: Repository<Product>,
    @InjectRepository(Model)
    private readonly ModelRepo: Repository<Model>,
    @InjectRepository(Dimensions)
    private readonly DimensionRepo: Repository<Dimensions>,
    @InjectRepository(FabricRage)
    private readonly FabricRageRepo: Repository<FabricRage>,
    @InjectRepository(Fabric)
    private readonly FabricRepo: Repository<Fabric>,
    @InjectRepository(Mash)
    private readonly MashRepo: Repository<Mash>,
    @InjectRepository(MashVariants)
    private readonly MashVariantsRepo: Repository<MashVariants>,
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
  async createDimensions(data: dimensionsCreateDto[]) {
    const allModelIdSame = data.every((v) => v.ModelId === data[0].ModelId);
    if (!allModelIdSame) {
      throw new UnprocessableEntityException('model id not same!!');
    }
    const model = await this.ModelRepo.findOne({
      where: {
        id: data[0].ModelId,
      },
    });
    if (!model) {
      throw new UnprocessableEntityException('model not found!');
    }

    const newDim = this.DimensionRepo.create(
      data.map((v) => ({
        ...v,
        model: {
          id: model.id,
        },
      })),
    );
    const dim = await this.DimensionRepo.save(newDim);

    return dim;
  }
  async createFabricRage(data: createFabricRage) {
    const newRage = this.FabricRageRepo.create(data);
    const rage = this.FabricRageRepo.save(newRage);
    return rage;
  }
  async createFabric(
    data: CreateFabricDTO,
    url?: string,
    thumbnailUrl?: string,
  ) {
    const fabricRageExited = await this.FabricRageRepo.findOne({
      where: {
        id: data.FabricRageId,
      },
    });
    if (!fabricRageExited) {
      throw new NotFoundException('Fabric rang not found!!');
    }
    const newF = this.FabricRepo.create({
      ...data,
      url,
      thumbnailUrl,
      fabricRage: {
        id: fabricRageExited.id,
      },
    });
    return await this.FabricRepo.save(newF);
  }

  async createMash(data: MashCreteDTO) {
    const modelExists = await this.ModelRepo.findOne({
      where: { id: data.modelId },
    });

    if (!modelExists) {
      throw new NotFoundException('Model not found.');
    }

    let mashVariantId: number | null = null;

    if (data.mashVariant) {
      for (const mashItem of data.mashVariant.mash) {
        if (mashItem.mashVariant) {
          throw new UnprocessableEntityException(
            'Nested mash variants are not allowed.',
          );
        }
      }

      try {
        const createdMash = this.MashRepo.create(data.mashVariant.mash);
        const savedMash = await this.MashRepo.save(createdMash);

        const newMashVariant = this.MashVariantsRepo.create({
          name: data.mashVariant.name,
          mash: savedMash,
        });

        const savedMashVariant =
          await this.MashVariantsRepo.save(newMashVariant);
        mashVariantId = savedMashVariant.id;
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to create mash variant.',
        );
      }
    }

    const fabricRangeArray: FabricRage[] = [];

    for (const item of data.fabricRanges) {
      const fabricRange = await this.FabricRageRepo.findOne({
        where: { id: item.fabricRangeId },
      });

      if (!fabricRange) {
        throw new UnprocessableEntityException(
          `Fabric range with ID ${item.fabricRangeId} not found.`,
        );
      }

      fabricRangeArray.push(fabricRange);
    }

    try {
      const newMash = this.MashRepo.create({
        ...data,
        fabricRange: fabricRangeArray,
        mashVariants: mashVariantId ? { id: mashVariantId } : undefined,
      });

      const savedMash = await this.MashRepo.save(newMash);
      return savedMash;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create mash entry.');
    }
  }

  async getAllModel(productId: number) {
    return await this.ModelRepo.find({
      where: {
        product: {
          id: productId,
        },
      },
    });
  }
}
