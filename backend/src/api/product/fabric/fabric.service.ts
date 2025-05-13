import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFabricDTO } from './dto/create.dto';
import { FabricRage } from '../fabric-rage/enitity/fabric-rage.enitity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fabric } from './enitity/fabric.enitity';
import { UpdateFabricDTO } from './dto/update.dto';

@Injectable()
export class FabricService {
  constructor(
    @InjectRepository(Fabric)
    private readonly FabricRepo: Repository<Fabric>,
    @InjectRepository(FabricRage)
    private readonly FabricRageRepo: Repository<FabricRage>,
  ) {}

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

  async updateFabric(
    id: number,
    body: UpdateFabricDTO,
    fabric?: string,
    thumbnail?: string,
  ) {
    const data = await this.FabricRepo.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      throw new NotFoundException('fabric range not fount');
    }
    const FRdata = await this.FabricRageRepo.findOne({
      where: {
        id: body.FabricRageId,
      },
    });
    if (!FRdata) {
      throw new NotFoundException('fabric range not fount');
    }
    console.log(FRdata);

    data.thumbnailUrl = thumbnail ? thumbnail : data.thumbnailUrl;
    data.url = fabric ? fabric : data.url;
    data.name = body.name ? body.name : data.name;
    data.size = body.size ? body.size : data.size;
    data.fabricRage = FRdata;
    return this.FabricRepo.save(data);
  }

  async deleteFabric(id: number) {
    const data = await this.FabricRepo.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      throw new NotFoundException('fabric range not fount');
    }

    return this.FabricRepo.remove(data);
  }

  async getAllFabric() {
    return await this.FabricRepo.find({
      relations: {
        fabricRage: true,
      },
      select: {
        fabricRage: {
          name: true,
        },
      },
    });
  }

  async getFabricById(id: number) {
    return await this.FabricRepo.findOne({
      where: {
        id,
      },
      relations: {
        fabricRage: true,
      },
    });
  }
}
