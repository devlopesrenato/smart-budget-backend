import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateAccountsPayableDto {
    @ApiProperty({ type: 'string', description: 'Descrição da conta a receber.' })
    @IsString()
    description: string;

    @ApiProperty({ type: 'number', description: 'Valor da conta a receber.' })
    @IsNumber()
    value: number;

    @ApiProperty({ type: 'integer', description: 'Identificador do usuário que criou a conta a receber.' })
    @IsNumber()
    creatorUserId: number;

    @ApiProperty({ type: 'integer', description: 'Identificador da folha associada à conta a receber.' })
    @IsNumber()
    sheetId: number;
}
