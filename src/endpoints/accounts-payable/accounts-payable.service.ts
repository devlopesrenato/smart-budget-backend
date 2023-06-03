import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { ConflictError } from 'src/common/errors/types/ConflictError';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';
import { Utils } from 'src/utils';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';

const prisma = new PrismaClient();
@Injectable()
export class AccountsPayableService {
  constructor(
    private readonly utils: Utils
  ) { }

  async create(createAccountsPayableDto: CreateAccountsPayableDto, userId: number) {

    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    const sheet = await prisma.sheets.findUnique({ where: { id: createAccountsPayableDto.sheetId } });

    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${createAccountsPayableDto.sheetId}`);
    }

    if (sheet.creatorUserId !== userId) {
      throw new UnauthorizedError('you don\'t have permission to add this payable in this sheet')
    }

    const accountPayable = await prisma.accountsPayable.findFirst({
      where: {
        description: createAccountsPayableDto.description,
        sheetId: createAccountsPayableDto.sheetId
      }
    })

    if (accountPayable) {
      throw new ConflictError(`account payable already exists for this sheetId: ${createAccountsPayableDto.sheetId}`)
    }

    const accountPayableCreated = await prisma.accountsPayable.create({
      data: {
        ...createAccountsPayableDto,
        creatorUserId: userId
      }
    });

    return {
      ...accountPayableCreated,
      createdAt: this.utils.getDateTimeZone(accountPayableCreated.createdAt),
      updatedAt: this.utils.getDateTimeZone(accountPayableCreated.updatedAt)
    }
  }

  async findAll(userId: number) {
    const accountsPayable = await prisma.accountsPayable.findMany({
      where: {
        creatorUserId: userId
      },
      include: {
        createdBy: {
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

    return accountsPayable.map((item) => ({
      ...item,
      createdAt: this.utils.getDateTimeZone(item.createdAt),
      updatedAt: this.utils.getDateTimeZone(item.updatedAt)
    }))
  }

  async findOne(id: number, userId: number) {
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
        sheet: {
          select: {
            id: true,
            description: true
          }
        }
      },
    });

    if (!accountPayable) {
      throw new NotFoundError(`not found accountPayableId: ${id}`);
    }

    if (accountPayable.creatorUserId !== userId) {
      throw new UnauthorizedError('you don\'t have permission to access this account payable')
    }

    return {
      ...accountPayable,
      createdAt: this.utils.getDateTimeZone(accountPayable.createdAt),
      updatedAt: this.utils.getDateTimeZone(accountPayable.updatedAt)
    }
  }

  async update(id: number, updateAccountsPayableDto: UpdateAccountsPayableDto, userIdUpdate: string) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }

    const user = await prisma.users.findUnique({ where: { id: Number(userIdUpdate) } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    if (updateAccountsPayableDto.sheetId) {
      const sheet = await prisma.sheets.findUnique({
        where: {
          id: updateAccountsPayableDto.sheetId
        }
      })

      if (!sheet) {
        throw new BadRequestError('sheetId invalid')
      }

      if (sheet.creatorUserId !== Number(userIdUpdate)) {
        throw new UnauthorizedError('you don\'t have permission to add this payable in this sheet')
      }
      return sheet
    }

    const accountPayable = await prisma.accountsPayable.findUnique({
      where: {
        id
      },
    });;

    if (!accountPayable) {
      throw new NotFoundError(`not found accountPayableId: ${id}`);
    }

    if (accountPayable.creatorUserId !== Number(userIdUpdate)) {
      throw new UnauthorizedError('you don\'t have permission to modify this account payable')
    }

    const accountPayableUpdated = await prisma.accountsPayable.update({
      where: {
        id
      },
      data: updateAccountsPayableDto
    });

    return {
      ...accountPayableUpdated,
      createdAt: this.utils.getDateTimeZone(accountPayable.createdAt),
      updatedAt: this.utils.getDateTimeZone(accountPayable.updatedAt)
    }
  }

  async remove(id: number, userId: number) {
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

    if (accountPayable.creatorUserId !== userId) {
      throw new UnauthorizedError('you don\'t have permission to delete this account payable')
    }

    const accountPayableDeleted = await prisma.accountsPayable.delete({
      where: {
        id
      }
    });;

    return {
      ...accountPayableDeleted,
      createdAt: this.utils.getDateTimeZone(accountPayableDeleted.createdAt),
      updatedAt: this.utils.getDateTimeZone(accountPayableDeleted.updatedAt)
    }
  }
}
