import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateFabricRage {
  @ApiProperty()
  @IsString()
  name: string;
}
