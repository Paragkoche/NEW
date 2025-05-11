import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class ModelCreateDto {
  @IsNumber()
  @ApiProperty()
  productId: number;

  @IsString()
  @ApiProperty()
  name: string;
  @IsString()
  @ApiProperty()
  imageBank: string;

  @IsBoolean()
  @ApiProperty()
  isDefault: boolean;

  @IsBoolean()
  @ApiProperty()
  shadow: boolean;

  @IsBoolean()
  @ApiProperty()
  autoRotate: boolean;

  @IsNumber()
  @ApiProperty()
  RotationSpeed: number;
}
