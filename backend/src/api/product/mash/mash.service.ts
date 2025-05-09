import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import MashCreteDTO from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mash } from './enitity/mash.enitity';
import { Repository } from 'typeorm';
import { Model } from '../model/enitity/model.enitity';
import { MashVariants } from '../mash-variants/enitity/mash-variants.enitity';
import { FabricRage } from '../fabric-rage/enitity/fabric-rage.enitity';

@Injectable()
export class MashService {
  constructor(
    @InjectRepository(Mash)
    private readonly MashRepo: Repository<Mash>,
    @InjectRepository(Model)
    private readonly ModelRepo: Repository<Model>,
    @InjectRepository(MashVariants)
    private readonly MashVariantsRepo: Repository<MashVariants>,
    @InjectRepository(FabricRage)
    private readonly FabricRageRepo: Repository<FabricRage>,
  ) {}

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
}
