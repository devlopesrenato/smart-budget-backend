import { Module } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { EmailService } from '@src/services/email/email.service';
import { Utils } from '@src/utils';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({  
  controllers: [UsersController],
  providers: [
    UsersService, 
    AuthService, 
    Utils,
    EmailService
  ]

})
export class UsersModule {}
