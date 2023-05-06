import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsPayableModule } from './endpoints/accounts-payable/accounts-payable.module';
import { AccountsReceivableModule } from './endpoints/accounts-receivable/accounts-receivable.module';
import { UsersModule } from './endpoints/users/users.module';
import { SheetsModule } from './endpoints/sheets/sheets.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AccountsPayableModule,
    AccountsReceivableModule,
    UsersModule,
    SheetsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService
  ],
})
export class AppModule { }
