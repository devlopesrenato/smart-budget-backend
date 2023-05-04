import { Injectable } from '@nestjs/common';
import { CreateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { UpdateAccountsReceivableDto } from './dto/update-accounts-receivable.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class AccountsReceivableService {
  create(createAccountsReceivableDto: CreateAccountsReceivableDto) {
    return prisma.accountsReceivable.create({
      data: {
        ...createAccountsReceivableDto,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  findAll() {
    return prisma.accountsReceivable.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
        updatedBy: {
          select: {
            id: true,
            name: true
          }
        },
        sheet: {
          select: {
            id: true,
            description: true
          }
        }
      }
    });
  }

  findOne(id: number) {
    return prisma.accountsReceivable.findUnique({
      where: {
        id
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
        updatedBy: {
          select: {
            id: true,
            name: true
          }
        },
        sheet: {
          select: {
            id: true,
            description: true
          }
        }
      }
    });;
  }

  update(id: number, updateAccountsReceivableDto: UpdateAccountsReceivableDto) {
    return prisma.accountsReceivable.update({
      where: {
        id
      },
      data: {
        ...updateAccountsReceivableDto,
        updatedAt: new Date()
      }
    });
  }

  remove(id: number) {
    return prisma.accountsReceivable.delete({
      where: {
        id
      }
    });;
  }
}
