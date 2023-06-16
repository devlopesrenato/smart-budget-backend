import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
export class ResendValidationEmailDto {

    @ApiProperty({ type: 'string', description: 'Endereço de email do usuário.', example: "admin@admin.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

}