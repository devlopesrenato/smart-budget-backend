import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Utils } from 'src/utils';
import { AccountsPayableController } from './accounts-payable.controller';
import { AccountsPayableService } from './accounts-payable.service';

@Module({
  controllers: [AccountsPayableController],
  providers: [
    AccountsPayableService,
    Utils,
    AuthService,
  ]
})
export class AccountsPayableModule { }
