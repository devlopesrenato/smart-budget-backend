import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountsPayableModule } from './endpoints/accounts-payable/accounts-payable.module';
import { AccountsReceivableModule } from './endpoints/accounts-receivable/accounts-receivable.module';
import { SheetsModule } from './endpoints/sheets/sheets.module';
import { UsersModule } from './endpoints/users/users.module';
import { UsersService } from './endpoints/users/users.service';
import { PrismaModule } from './prisma/prisma.module';
import { Utils } from './utils';

@Module({
  imports: [
    AccountsPayableModule,
    AccountsReceivableModule,
    UsersModule,
    SheetsModule,
    AuthModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    Utils
  ],
})
export class AppModule { }
