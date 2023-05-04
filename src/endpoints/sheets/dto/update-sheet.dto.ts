
import { PartialType } from '@nestjs/swagger';
import { CreateSheetDto } from './create-sheet.dto';

export class UpdateSheetDto extends PartialType(CreateSheetDto) {}
