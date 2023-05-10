import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';
import { Utils } from 'src/utils';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [SheetsController],
  providers: [
    SheetsService,
    Utils,
    AuthService,
    PrismaService
  ]
})
export class SheetsModule { }
