import { Module } from '@nestjs/common';
import { AccountsReceivableService } from './accounts-receivable.service';
import { AccountsReceivableController } from './accounts-receivable.controller';

@Module({
  controllers: [AccountsReceivableController],
  providers: [AccountsReceivableService]
})
export class AccountsReceivableModule {}
