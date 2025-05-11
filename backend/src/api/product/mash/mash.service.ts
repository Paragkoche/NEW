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
    // console.log(data);

    const modelExists = await this.ModelRepo.findOne({
      where: { id: data.modelId },
    });

    if (!modelExists) {
      throw new NotFoundException('Model not found.');
    }

    let mashVariantId: number | null = null;
    if (data.mashVariant) {
      // for (const mashItem of data.mashVariant.mash) {
      //   if (mashItem.mashVariant) {
      //     throw new UnprocessableEntityException(
      //       'Nested mash variants are not allowed.',
      //     );
      //   }
      // }
      for (let mash of data.mashVariant) {
        console.log(':', mash);
        // console.log('mash', mash);

        try {
          const createdMash = this.MashRepo.create(
            mash.mash.map((v) => ({
              name: v.name,
              itOptional: v.itOptional,
              textureEnable: v.textureEnable,
              thumbnailUrl: v.thumbnailUrl,
              url: v.url,
              mashName: v.mashName,
              fabricRange: [],
            })),
          );
          const savedMash = await this.MashRepo.save(createdMash);
          console.log('savedMash', savedMash);

          const newMashVariant = this.MashVariantsRepo.create({
            name: mash.name,
          });
          const savedMashVariant =
            await this.MashVariantsRepo.save(newMashVariant);
          savedMashVariant.mash = [];
          for (let i of savedMash) {
            savedMashVariant.mash.push(i);
          }
          await this.MashVariantsRepo.save(savedMashVariant);

          console.log('newMashVariant', savedMashVariant);

          mashVariantId = savedMashVariant.id;
        } catch (error) {
          console.log(error);

          throw new InternalServerErrorException(
            'Failed to create mash variant.',
          );
        }
      }
    }

    const fabricRangeArray: FabricRage[] = [];
    // console.log(data.fabricRanges);

    if (data.fabricRanges && data.fabricRanges.length !== 0) {
      for (const item of data.fabricRanges) {
        if (!item.fabricRangeId) {
          continue;
        }
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
    }

    try {
      const newMash = this.MashRepo.create({
        ...data,

        mashVariants: mashVariantId ? { id: mashVariantId } : undefined,
      });

      const savedMash = await this.MashRepo.save(newMash);
      // console.log('savedMash', savedMash);
      savedMash.fabricRange = [];
      for (let i of fabricRangeArray) {
        savedMash.fabricRange.push(i);
      }
      await this.MashRepo.save(savedMash);
      return savedMash;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Failed to create mash entry.');
    }
  }
}
