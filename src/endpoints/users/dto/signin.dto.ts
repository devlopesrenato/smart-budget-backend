import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

const msgEmailInvalid = { message: 'E-mail inválido!' };
const msgPasswordInvalid = { message: 'Senha inválida!' };

export class SigninDto {
  @IsNotEmpty(msgEmailInvalid)
  @IsEmail({}, msgEmailInvalid)
  email: string;

  @IsNotEmpty(msgPasswordInvalid)
  @IsString(msgPasswordInvalid)
  @MinLength(4, msgPasswordInvalid)
  password: string;
}
