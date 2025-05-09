import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dimensions } from './enitity/dimensions.enitity';
import { Repository } from 'typeorm';
import { dimensionsCreateDto } from './dto/create.dto';
import { Model } from '../model/enitity/model.enitity';

@Injectable()
export class DimensionsService {
  constructor(
    @InjectRepository(Dimensions)
    private readonly DimensionRepo: Repository<Dimensions>,
    @InjectRepository(Model)
    private readonly ModelRepo: Repository<Model>,
  ) {}

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
}
