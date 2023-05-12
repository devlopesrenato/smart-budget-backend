import { Injectable } from '@nestjs/common';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { Utils } from 'src/utils';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';

const prisma = new PrismaClient();
@Injectable()
export class AccountsPayableService {
  constructor(
    private readonly utils: Utils
  ) { }

  async create(createAccountsPayableDto: CreateAccountsPayableDto, userId: number) {
    const sheet = await prisma.sheets.findUnique({ where: { id: createAccountsPayableDto.sheetId } });

    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${createAccountsPayableDto.sheetId}`);
    }

    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError(`user token invalid`);
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
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
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

  async update(id: number, updateAccountsPayableDto: UpdateAccountsPayableDto, userIdUpdate: string) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
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
        updatedAt: new Date(),
        updaterUserId: Number(userIdUpdate)
      }
    });
  }

  async remove(id: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
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
