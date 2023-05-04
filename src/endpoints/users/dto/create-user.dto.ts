import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ type: 'string', description: 'Endereço de email do usuário.' })
    email: string;

    @ApiProperty({ type: 'string', description: 'Nome do usuário.' })
    name: string;

    @ApiProperty({ type: 'string', description: 'Senha do usuário.' })
    password: string;
}
