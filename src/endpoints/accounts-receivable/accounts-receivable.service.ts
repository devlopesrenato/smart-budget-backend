import { Injectable } from '@nestjs/common';
import { CreateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { UpdateAccountsReceivableDto } from './dto/update-accounts-receivable.dto';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { Utils } from 'src/utils';

const prisma = new PrismaClient();
@Injectable()
export class AccountsReceivableService {
  constructor(
    private readonly utils: Utils
  ) { }
  
  async create(createAccountsReceivableDto: CreateAccountsReceivableDto, userId: number) {
    const sheet = await prisma.sheets.findUnique({ where: { id: createAccountsReceivableDto.sheetId } });

    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${createAccountsReceivableDto.sheetId}`);
    }

    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError(`user token invalid`);
    }

    return prisma.accountsReceivable.create({
      data: {
        ...createAccountsReceivableDto,
        creatorUserId: user.id,
        sheetId: sheet.id,
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

  async findOne(id: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const accountReceivable = await prisma.accountsReceivable.findUnique({
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

    if (!accountReceivable) {
      throw new NotFoundError(`not found accountReceivableId: ${id}`);
    }

    return accountReceivable;
  }

  async update(id: number, updateAccountsReceivableDto: UpdateAccountsReceivableDto, userIdUpdate: string) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const accountReceivable = await prisma.accountsReceivable.findUnique({
      where: {
        id
      },
    });;

    if (!accountReceivable) {
      throw new NotFoundError(`not found accountReceivableId: ${id}`);
    }

    return prisma.accountsReceivable.update({
      where: {
        id
      },
      data: {
        ...updateAccountsReceivableDto,
        updatedAt: new Date(),
        updaterUserId: Number(userIdUpdate)
      }
    });
  }

  async remove(id: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const accountReceivable = await prisma.accountsReceivable.findUnique({
      where: {
        id
      },
    });;

    if (!accountReceivable) {
      throw new NotFoundError(`not found accountReceivableId: ${id}`);
    }

    return prisma.accountsReceivable.delete({
      where: {
        id
      }
    });;
  }
}
