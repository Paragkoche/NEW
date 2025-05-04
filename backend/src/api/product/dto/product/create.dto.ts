import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddProductDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty({
    type: 'string',
  })
  pdfText: string;
}
