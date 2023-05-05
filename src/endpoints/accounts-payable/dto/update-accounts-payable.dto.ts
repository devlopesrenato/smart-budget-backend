
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountsPayableDto {
    @ApiProperty({ type: 'string', description: 'Descrição da conta a receber.' })
    description: string;

    @ApiProperty({ type: 'number', description: 'Valor da conta a receber.' })
    value: number;
}
