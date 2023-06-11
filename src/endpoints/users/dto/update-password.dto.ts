import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class UpdatePasswordDto {

    @ApiProperty({ type: 'string', description: 'Endereço de email do usuário.', example: "admin@admin.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ type: 'string', description: 'Senha do usuário.', example: "12345" })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    password: string;
}