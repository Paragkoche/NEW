import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FabricRage } from './enitity/fabric-rage.enitity';
import { Repository } from 'typeorm';
import { createFabricRage } from './dto/create.dto';
import { UpdateFabricRage } from './dto/update.dto';

@Injectable()
export class FabricRageService {
  constructor(
    @InjectRepository(FabricRage)
    private readonly FabricRageRepo: Repository<FabricRage>,
  ) {}
  async createFabricRage(data: createFabricRage) {
    const newRage = this.FabricRageRepo.create(data);
    const rage = this.FabricRageRepo.save(newRage);
    return rage;
  }

  async getAll() {
    return await this.FabricRageRepo.find({
      relations: {
        fabric: true,
      },
      select: {
        fabric: {
          id: true,
        },
      },
    });
  }
  async getById(id: string) {
    return await this.FabricRageRepo.findOne({
      where: {
        id,
      },
    });
  }
  async update(id: string, body: UpdateFabricRage) {
    const data = await this.FabricRageRepo.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      throw new NotFoundException('fabric range not fount');
    }
    data.name = body.name;

    return this.FabricRageRepo.save(data);
  }
  async deleteFun(id: string) {
    const data = await this.FabricRageRepo.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      throw new NotFoundException('fabric range not fount');
    }

    return this.FabricRageRepo.delete({
      id: data.id,
    });
  }
}
