import { Module } from '@nestjs/common';
import { AccountsPayableService } from './accounts-payable.service';
import { AccountsPayableController } from './accounts-payable.controller';
import { Utils } from 'src/utils';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AccountsPayableController],
  providers: [
    AccountsPayableService,
    Utils,
    AuthService,
    PrismaService
  ]
})
export class AccountsPayableModule { }
