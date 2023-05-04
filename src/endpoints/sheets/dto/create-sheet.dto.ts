import { ApiProperty } from "@nestjs/swagger";

export class CreateSheetDto {
    @ApiProperty({ type: 'string', description: 'Descrição da folha.' })
    description: string;
}
