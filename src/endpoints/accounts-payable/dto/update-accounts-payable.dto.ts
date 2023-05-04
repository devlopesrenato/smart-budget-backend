
import { PartialType } from '@nestjs/swagger';
import { CreateAccountsPayableDto } from './create-accounts-payable.dto';

export class UpdateAccountsPayableDto extends PartialType(CreateAccountsPayableDto) {}
