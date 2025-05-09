import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class dimensionsCreateDto {
  @IsNumber()
  @ApiProperty()
  ModelId: number;

  @IsString()
  @ApiProperty()
  label: string;

  @IsNumber()
  @ApiProperty()
  x: number;
  @IsNumber()
  @ApiProperty()
  y: number;
  @IsNumber()
  @ApiProperty()
  z: number;
  @IsNumber()
  @ApiProperty()
  end_x: number;

  @IsNumber()
  @ApiProperty()
  end_y: number;
  @IsNumber()
  @ApiProperty()
  end_z: number;
}
