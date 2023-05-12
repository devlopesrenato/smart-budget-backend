import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', description: 'Endereço de email do usuário.' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', description: 'Nome do usuário.' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', description: 'Senha do usuário.' })
    password: string;
}
