import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';

export class UserEntity implements Users {
  @ApiProperty({ type: 'integer', description: 'Identificador único do usuário.' })
  id: number;

  @ApiProperty({ type: 'string', description: 'Endereço de email do usuário.' })
  email: string;

  @ApiProperty({ type: 'string', description: 'Nome do usuário.' })
  name: string;

  @ApiProperty({ type: 'string', description: 'Senha do usuário.' })
  password: string;

  @ApiProperty({ type: 'string', format: 'date-time', description: 'Data de criação do registro.' })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date-time', description: 'Data de atualização do registro.' })
  updatedAt: Date;
}
