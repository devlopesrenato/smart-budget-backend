import { Module } from '@nestjs/common';
import { AccountsReceivableService } from './accounts-receivable.service';
import { AccountsReceivableController } from './accounts-receivable.controller';
import { Utils } from 'src/utils';

@Module({
  controllers: [AccountsReceivableController],
  providers: [AccountsReceivableService, Utils]
})
export class AccountsReceivableModule {}
