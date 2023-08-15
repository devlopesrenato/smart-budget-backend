import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Utils } from 'src/utils';
import { AccountsReceivableController } from './accounts-receivable.controller';
import { AccountsReceivableService } from './accounts-receivable.service';

@Module({
  controllers: [AccountsReceivableController],
  providers: [
    AccountsReceivableService, 
    Utils,
    AuthService,
  ]
})
export class AccountsReceivableModule {}
