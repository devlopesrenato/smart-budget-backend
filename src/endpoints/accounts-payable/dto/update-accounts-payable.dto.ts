
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateAccountsPayableDto {
    @ApiProperty({ type: 'string', description: 'Descrição da conta a receber.' })
    @IsString()
    description: string;

    @ApiProperty({ type: 'number', description: 'Valor da conta a receber.' })
    @IsNumber()
    value: number;
}
