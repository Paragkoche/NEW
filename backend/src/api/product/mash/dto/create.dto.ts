import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

class FabricRangeArray {
  @ApiProperty()
  @IsNumber()
  fabricRangeId: string;
}
class MashVariants {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty({ isArray: true, type: () => MashCreteDTO })
  @IsArray()
  mash: MashCreteDTO[];
}

class MashCreteDTO {
  @ApiProperty()
  @IsNumber()
  modelId: string;

  @ApiProperty()
  @IsBoolean()
  itOptional?: boolean;

  @ApiProperty()
  @IsBoolean()
  textureEnable?: boolean;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  mashName: string;

  @ApiProperty({ isArray: true, type: () => FabricRangeArray })
  @IsArray()
  fabricRanges: FabricRangeArray[];

  @ApiProperty({ type: () => MashVariants })
  mashVariant?: MashVariants;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  thumbnailUrl?: string;
}

export default MashCreteDTO;
