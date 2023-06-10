import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RecoverPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', description: 'Endereço de email do usuário para recupeara a senha.' })
    email: string;
}