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
import { clear, log } from 'console';

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
    // Validate model existence
    const model = await this.ModelRepo.findOne({ where: { id: data.modelId } });
    if (!model) {
      throw new NotFoundException('Model not found.');
    }
    log('::::::::', data.mashVariant?.mash);

    let mashVariantEntity: MashVariants | null = null;

    // Handle mash variant if present
    if (data.mashVariant) {
      // Optional: prevent nesting
      for (const mashItem of data.mashVariant.mash) {
        if (mashItem.mashVariant) {
          throw new UnprocessableEntityException(
            'Nested mash variants are not allowed.',
          );
        }
      }

      try {
        // Create mash variant first
        mashVariantEntity = this.MashVariantsRepo.create({
          name: data.mashVariant.name,
        });
        mashVariantEntity = await this.MashVariantsRepo.save(mashVariantEntity);

        // Create mash entries for this variant
        const mashEntities = data.mashVariant.mash.map((mashDto) => {
          log('0>', mashDto);
          return this.MashRepo.create({
            name: mashDto.name,
            itOptional: mashDto.itOptional,
            textureEnable: mashDto.textureEnable,
            thumbnailUrl: mashDto.thumbnailUrl,
            url: mashDto.url,
            mashName: mashDto.mashName,

            mashVariants: mashVariantEntity ?? undefined,
            fabricRange: [],
          });
        });

        console.log('-><>---', mashEntities);

        const savedMashEntities = await this.MashRepo.save(mashEntities);

        // Assign mash to variant
        mashVariantEntity.mash = savedMashEntities;
        await this.MashVariantsRepo.save(mashVariantEntity);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(
          'Failed to create mash variant.',
        );
      }
    }

    // Resolve fabric ranges
    const fabricRangeEntities: FabricRage[] = [];

    if (data.fabricRanges?.length) {
      for (const item of data.fabricRanges) {
        if (!item.fabricRangeId) continue;

        const fabricRange = await this.FabricRageRepo.findOne({
          where: { id: item.fabricRangeId },
        });

        if (!fabricRange) {
          throw new UnprocessableEntityException(
            `Fabric range with ID ${item.fabricRangeId} not found.`,
          );
        }

        fabricRangeEntities.push(fabricRange);
      }
    }

    try {
      console.log('ssssssssssssss', data.textureEnable);

      // Create main mash
      const newMash = this.MashRepo.create({
        name: data.name,
        itOptional: data.itOptional,
        textureEnable: data.textureEnable,
        thumbnailUrl: data.thumbnailUrl,
        url: data.url,
        mashName: data.mashName,
        model,
        mashVariants: mashVariantEntity ?? undefined,
        fabricRange: fabricRangeEntities,
      });

      const savedMash = await this.MashRepo.save(newMash);
      return savedMash;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create mash entry.');
    }
  }
}
