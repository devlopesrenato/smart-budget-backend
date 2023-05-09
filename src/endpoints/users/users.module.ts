import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { Utils } from 'src/utils';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService, PrismaService, Utils]
})
export class UsersModule {}
