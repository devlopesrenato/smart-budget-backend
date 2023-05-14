import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

const msgEmailInvalid = { message: 'E-mail inválido!' };
const msgPasswordInvalid = { message: 'Senha inválida!' };

export class SigninDto {
  @ApiProperty({ type: 'string', description: 'Endereço de email do usuário.', example: "admin@admin.com" })
  @IsNotEmpty(msgEmailInvalid)
  @IsEmail({}, msgEmailInvalid)
  email: string;

  @ApiProperty({ type: 'string', description: 'Senha do usuário.', example: "12345" })
  @IsNotEmpty(msgPasswordInvalid)
  @IsString(msgPasswordInvalid)
  @MinLength(4, msgPasswordInvalid)
  password: string;
}
