import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

class PhotoDto {
  @ApiProperty({ example: '/9j/4AAQSkZJRgAB...' })
  @IsString()
  base64: string;

  @ApiProperty({ example: 'foto.jpeg' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'users' })
  @IsString()
  folder: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'juanperez' })
  @IsString()
  username: string;

  @ApiPropertyOptional({ example: 'Estudiante de artes' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'M' })
  @IsString()
  gender: string;

  @ApiProperty({ example: '3001234567' })
  @IsString()
  telNumber: string;

  @ApiProperty({ example: 'uuid-del-tipo' })
  @IsString()
  userTypeId: string;

  @ApiPropertyOptional({ type: PhotoDto })
  @IsOptional()
  photo?: PhotoDto;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Juan' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Pérez' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'juanperez' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'M' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userTypeId?: string;
}

export class UpdateUserPhotoDto {
  @ApiProperty({ example: '/9j/4AAQSkZJRgAB...' })
  @IsString()
  base64: string;

  @ApiProperty({ example: 'foto.jpeg' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'users' })
  @IsString()
  folder: string;
}
