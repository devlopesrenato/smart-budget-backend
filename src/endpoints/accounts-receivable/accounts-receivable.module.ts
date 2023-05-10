import { Module } from '@nestjs/common';
import { AccountsReceivableService } from './accounts-receivable.service';
import { AccountsReceivableController } from './accounts-receivable.controller';
import { Utils } from 'src/utils';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AccountsReceivableController],
  providers: [
    AccountsReceivableService, 
    Utils,
    AuthService,
    PrismaService
  ]
})
export class AccountsReceivableModule {}
