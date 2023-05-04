import { AccountsPayable } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AccountsPayableEntity implements AccountsPayable {
  @ApiProperty({ type: 'integer', description: 'ID da conta a pagar.' })
  id: number;

  @ApiProperty({ type: 'string', description: 'Descrição da conta a pagar.' })
  description: string;

  @ApiProperty({ type: 'number', description: 'Valor da conta a pagar.' })
  value: number;

  @ApiProperty({ type: 'string', format: 'date-time', description: 'Data de criação da conta a pagar.' })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date-time', description: 'Data de atualização da conta a pagar.' })
  updatedAt: Date;

  @ApiProperty({ type: 'integer', description: 'ID do usuário criador da conta a pagar.' })
  creatorUserId: number;

  @ApiProperty({ type: 'integer', description: 'ID do usuário que atualizou a conta a pagar pela última vez.' })
  updaterUserId: number;

  @ApiProperty({ type: 'integer', description: 'ID da folha à qual a conta a pagar pertence.' })
  sheetId: number;
}
