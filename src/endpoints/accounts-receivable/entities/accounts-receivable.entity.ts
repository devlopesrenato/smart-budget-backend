import { ApiProperty } from '@nestjs/swagger';
import { AccountsReceivable } from '@prisma/client';

export class AccountsReceivableEntity implements AccountsReceivable {
    @ApiProperty({ type: 'integer', description: 'Identificador único da conta a receber.' })
    id: number;

    @ApiProperty({ type: 'string', description: 'Descrição da conta a receber.' })
    description: string;

    @ApiProperty({ type: 'number', description: 'Valor da conta a receber.' })
    value: number;

    @ApiProperty({ type: 'string', format: 'date-time', description: 'Data de criação da conta a receber.' })
    createdAt: Date;

    @ApiProperty({ type: 'string', format: 'date-time', description: 'Data da última atualização da conta a receber.' })
    updatedAt: Date;

    @ApiProperty({ type: 'integer', description: 'Identificador do usuário que criou a conta a receber.' })
    creatorUserId: number;

    @ApiProperty({ type: 'integer', description: 'Identificador do usuário que atualizou a conta a receber pela última vez.' })
    updaterUserId: number;

    @ApiProperty({ type: 'integer', description: 'Identificador da folha associada à conta a receber.' })
    sheetId: number;
}

