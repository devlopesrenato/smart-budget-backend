import { Injectable } from '@nestjs/common';
import { CreateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { UpdateAccountsReceivableDto } from './dto/update-accounts-receivable.dto';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { Utils } from 'src/utils';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';
import { ConflictError } from 'src/common/errors/types/ConflictError';

const prisma = new PrismaClient();
@Injectable()
export class AccountsReceivableService {
  constructor(
    private readonly utils: Utils
  ) { }

  async create(createAccountsReceivableDto: CreateAccountsReceivableDto, userId: number) {
        
    const user = await prisma.users.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }
    
    const sheet = await prisma.sheets.findUnique({ where: { id: createAccountsReceivableDto.sheetId } });

    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${createAccountsReceivableDto.sheetId}`);
    }

    const accountReceivable = await prisma.accountsReceivable.findFirst({
      where: {
        description: createAccountsReceivableDto.description,
        sheetId: createAccountsReceivableDto.sheetId
      }
    })

    if (accountReceivable) {
      throw new ConflictError(`account receivable already exists for this sheetId: ${createAccountsReceivableDto.sheetId}`)
    }

    const accountReceivableCreated = await prisma.accountsReceivable.create({
      data: {
        ...createAccountsReceivableDto,
        creatorUserId: user.id,
        sheetId: sheet.id,
      }
    });

    return {
      ...accountReceivableCreated,
      createdAt: this.utils.getDateTimeZone(accountReceivableCreated.createdAt),
      updatedAt: this.utils.getDateTimeZone(accountReceivableCreated.updatedAt)
    }
  }

  async findAll() {
    const accountsReceivable = await prisma.accountsReceivable.findMany({
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

    return accountsReceivable.map((item) => ({
      ...item,
      createdAt: this.utils.getDateTimeZone(item.createdAt),
      updatedAt: this.utils.getDateTimeZone(item.updatedAt)
    }))
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

    return {
      ...accountReceivable,
      createdAt: this.utils.getDateTimeZone(accountReceivable.createdAt),
      updatedAt: this.utils.getDateTimeZone(accountReceivable.updatedAt)
    }
  }

  async update(id: number, updateAccountsReceivableDto: UpdateAccountsReceivableDto, userIdUpdate: string) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }

    const user = await prisma.users.findUnique({ where: { id: Number(userIdUpdate) } });
    
    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }
    
    const accountReceivable = await prisma.accountsReceivable.findUnique({
      where: {
        id
      },
    });;

    if (!accountReceivable) {
      throw new NotFoundError(`not found accountReceivableId: ${id}`);
    }

    const sheet = await prisma.sheets.findUnique({
      where: {
        id: updateAccountsReceivableDto.sheetId
      }
    })

    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${id}`);
    }

    const accountReceivableUpdated = await prisma.accountsReceivable.update({
      where: {
        id
      },
      data: {
        ...updateAccountsReceivableDto,
        updaterUserId: Number(userIdUpdate)
      }
    });

    return {
      ...accountReceivableUpdated,
      createdAt: this.utils.getDateTimeZone(accountReceivableUpdated.createdAt),
      updatedAt: this.utils.getDateTimeZone(accountReceivableUpdated.updatedAt)
    }
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

    const accountReceivableDeleted = await prisma.accountsReceivable.delete({
      where: {
        id
      }
    });;

    return {
      ...accountReceivableDeleted,
      createdAt: this.utils.getDateTimeZone(accountReceivableDeleted.createdAt),
      updatedAt: this.utils.getDateTimeZone(accountReceivableDeleted.updatedAt)
    }

  }
}
