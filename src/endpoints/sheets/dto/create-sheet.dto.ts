import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSheetDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', description: 'Descrição da folha.' })
    description: string;
}
