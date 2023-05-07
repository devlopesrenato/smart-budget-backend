import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';

const prisma = new PrismaClient();
@Injectable()
export class AccountsPayableService {

  async create(createAccountsPayableDto: CreateAccountsPayableDto) {
    const sheet = await prisma.sheets.findUnique({ where: { id: createAccountsPayableDto.sheetId } });

    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${createAccountsPayableDto.sheetId}`);
    }

    const user = await prisma.users.findUnique({ where: { id: createAccountsPayableDto.creatorUserId } });

    if (!user) {
      throw new NotFoundError(`not found userId: ${createAccountsPayableDto.creatorUserId}`);
    }

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

  async findOne(id: number) {
    const accountPayable = await prisma.accountsPayable.findUnique({
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

    if (!accountPayable) {
      throw new NotFoundError(`not found accountPayableId: ${id}`);
    }

    return accountPayable;
  }

  async update(id: number, updateAccountsPayableDto: UpdateAccountsPayableDto) {
    const accountPayable = await prisma.accountsPayable.findUnique({
      where: {
        id
      },
    });;

    if (!accountPayable) {
      throw new NotFoundError(`not found accountPayableId: ${id}`);
    }

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

  async remove(id: number) {
    const accountPayable = await prisma.accountsPayable.findUnique({
      where: {
        id
      },
    });;

    if (!accountPayable) {
      throw new NotFoundError(`not found accountPayableId: ${id}`);
    }

    return prisma.accountsPayable.delete({
      where: {
        id
      }
    });;
  }
}
