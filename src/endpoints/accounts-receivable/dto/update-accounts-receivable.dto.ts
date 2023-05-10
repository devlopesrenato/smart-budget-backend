
import { PartialType } from '@nestjs/swagger';
import { CreateAccountsReceivableDto } from './create-accounts-receivable.dto';


export class UpdateAccountsReceivableDto extends PartialType(CreateAccountsReceivableDto) { }
