import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountsReceivableDto {
    @ApiProperty({ type: 'string', description: 'Descrição da conta a receber.' })
    description: string;

    @ApiProperty({ type: 'number', description: 'Valor da conta a receber.' })
    value: number;

    @ApiProperty({ type: 'integer', description: 'Identificador do usuário que criou a conta a receber.' })
    creatorUserId: number;

    @ApiProperty({ type: 'integer', description: 'Identificador da folha associada à conta a receber.' })
    sheetId: number;
}
