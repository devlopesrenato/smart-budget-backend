import { ApiProperty } from '@nestjs/swagger';
import { Sheets } from '@prisma/client';

export class SheetEntity implements Sheets {
    @ApiProperty({ type: 'integer', description: 'Identificador único da folha.' })
    id: number;
    
    @ApiProperty({ type: 'string', description: 'Descrição da folha.' })
    description: string;
    
    @ApiProperty({ type: 'string', format: 'date-time', description: 'Data e hora de criação da folha.' })
    createdAt: Date;
    
    @ApiProperty({ type: 'string', format: 'date-time', description: 'Id do Usuário.' })
    creatorUserId: number;    

    @ApiProperty({ type: 'string', format: 'date-time', description: 'Data e hora da última atualização da folha.' })
    updatedAt: Date;
}

