import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAccountsReceivableDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', description: 'Descrição da conta a receber.' })
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ type: 'number', description: 'Valor da conta a receber.' })
    value: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ type: 'integer', description: 'Identificador da folha associada à conta a receber.' })
    sheetId: number;
}
