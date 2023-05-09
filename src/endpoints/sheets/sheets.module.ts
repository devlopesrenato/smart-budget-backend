import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';
import { Utils } from 'src/utils';

@Module({
  controllers: [SheetsController],
  providers: [SheetsService, Utils]
})
export class SheetsModule {}
