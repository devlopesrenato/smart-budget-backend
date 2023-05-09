import { Module } from '@nestjs/common';
import { AccountsPayableService } from './accounts-payable.service';
import { AccountsPayableController } from './accounts-payable.controller';
import { Utils } from 'src/utils';

@Module({
  controllers: [AccountsPayableController],
  providers: [AccountsPayableService, Utils]
})
export class AccountsPayableModule {}
