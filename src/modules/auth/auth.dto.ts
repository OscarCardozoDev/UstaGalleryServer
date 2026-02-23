import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateCredentialDto {
  @ApiProperty({ example: 'usuario@correo.com' })
  @IsEmail()
  mail: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}
