import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class VerifyDataDto {
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({ type: 'string', description: 'Endereço de email do usuário.' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({ type: 'string', description: 'Nome do usuário.' })
    name: string;
}