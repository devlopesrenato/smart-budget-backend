import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSheetDto {
    @ApiProperty({ type: 'string', description: 'Descrição da folha.' })
    @IsString()
    description: string;
}
