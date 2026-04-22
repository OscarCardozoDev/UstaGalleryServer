import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class ClassParamsDto {
  @ApiProperty({ example: 'uuid-de-la-clase' })
  @IsString()
  uid: string;
}

export class GroupParamDto {
  @ApiProperty({ example: 'uuid-del-grupo' })
  @IsString()
  groupId: string;
}

export class GetClassesDto {
  @ApiPropertyOptional({ example: '2025-04-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2025-06-30T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  to?: string;
}

export class CreateClassDto {
  @ApiProperty({ example: 'uuid-del-grupo' })
  @IsString()
  groupId: string;

  @ApiProperty({ example: '2025-05-10T00:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '16:00' })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({ example: 'Técnica de acuarela' })
  @IsOptional()
  @IsString()
  topic?: string;
}

export class UpdateTopicDto {
  @ApiPropertyOptional({ example: 'Técnica de acuarela' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ example: 'Se practicó mezcla de colores y fondos húmedos' })
  @IsOptional()
  @IsString()
  review?: string;
}

export class AttendDto {
  @ApiProperty({ example: 'uuid-de-la-clase' })
  @IsString()
  classId: string;
}
