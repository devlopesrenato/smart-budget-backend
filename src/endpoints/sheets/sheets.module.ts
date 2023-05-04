import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';

@Module({
  controllers: [SheetsController],
  providers: [SheetsService]
})
export class SheetsModule {}
