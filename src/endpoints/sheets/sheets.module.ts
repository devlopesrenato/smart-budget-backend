import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Utils } from 'src/utils';
import { SheetsController } from './sheets.controller';
import { SheetsService } from './sheets.service';

@Module({
  controllers: [SheetsController],
  providers: [
    SheetsService,
    Utils,
    AuthService,
  ]
})
export class SheetsModule { }
