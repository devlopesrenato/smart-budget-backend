import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ type: 'string', description: 'Endereço de email do usuário.' })
    @IsEmail()
    email: string;

    @ApiProperty({ type: 'string', description: 'Nome do usuário.' })
    @IsString()
    name: string;

    @IsString()
    @ApiProperty({ type: 'string', description: 'Senha do usuário.' })
    password: string;
}
