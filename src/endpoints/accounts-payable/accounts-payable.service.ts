import { Injectable } from '@nestjs/common';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class AccountsPayableService {
  create(createAccountsPayableDto: CreateAccountsPayableDto) {
    return prisma.accountsPayable.create({
      data: {
        ...createAccountsPayableDto,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  findAll() {
    return prisma.accountsPayable.findMany({
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
    return prisma.accountsPayable.findUnique({
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

  update(id: number, updateAccountsPayableDto: UpdateAccountsPayableDto) {
    return prisma.accountsPayable.update({
      where: {
        id
      },
      data: {
        ...updateAccountsPayableDto,
        updatedAt: new Date()
      }
    });
  }

  remove(id: number) {
    return prisma.accountsPayable.delete({
      where: {
        id
      }
    });;
  }
}
