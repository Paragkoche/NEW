import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateFabricDTO {
  @ApiProperty()
  @IsNumber()
  FabricRageId?: string;

  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsNumber()
  size?: number;
}
