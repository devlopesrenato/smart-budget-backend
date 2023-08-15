import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { ConflictError } from 'src/common/errors/types/ConflictError';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils';
import { CreateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { UpdateAccountsReceivableDto } from './dto/update-accounts-receivable.dto';

@Injectable()
export class AccountsReceivableService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: Utils
  ) { }

  async create(createAccountsReceivableDto: CreateAccountsReceivableDto, userId: number) {

    const user = await this.prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    const sheet = await this.prisma.sheets.findUnique({ where: { id: createAccountsReceivableDto.sheetId } });

    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${createAccountsReceivableDto.sheetId}`);
    }

    if (sheet.creatorUserId !== userId) {
      throw new UnauthorizedError('you don\'t have permission to add this receivable in this sheet')
    }

    const accountReceivable = await this.prisma.accountsReceivable.findFirst({
      where: {
        description: createAccountsReceivableDto.description,
        sheetId: createAccountsReceivableDto.sheetId
      }
    })

    if (accountReceivable) {
      throw new ConflictError(`account receivable already exists for this sheetId: ${createAccountsReceivableDto.sheetId}`)
    }

    const accountReceivableCreated = await this.prisma.accountsReceivable.create({
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

  async duplicate(id: number, userID: number) {
    const user = await this.prisma.users.findUnique({ where: { id: userID } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }

    const accountsReceivable = await this.prisma.accountsReceivable.findUnique({
      where: { id },
    });

    if (!accountsReceivable) {
      throw new NotFoundError(`not found accountsReceivableId: ${id}`);
    }

    if (accountsReceivable.creatorUserId !== userID) {
      throw new UnauthorizedError('you don\'t have permission to duplique this account receivable')
    }

    const newItemDescription = await this.generateDuplicateDescription(accountsReceivable.description, user.id)
    try {
      const accountsReceivableDuplicated = await this.prisma.accountsReceivable.create({
        data: {
          description: newItemDescription,
          value: accountsReceivable.value,
          creatorUserId: accountsReceivable.creatorUserId,
          sheetId: accountsReceivable.sheetId,
        }
      })

      return {
        ...accountsReceivableDuplicated,
        createdAt: this.utils.getDateTimeZone(accountsReceivableDuplicated.createdAt),
        updatedAt: this.utils.getDateTimeZone(accountsReceivableDuplicated.updatedAt)
      }
    } catch (error) {
      const created = await this.prisma.accountsReceivable.findFirst({
        where: {
          description: newItemDescription
        }
      })
      if (created) {
        await this.prisma.accountsReceivable.delete({
          where: {
            id: created.id,
          }
        })
      }
      throw new InternalServerErrorException()
    }
  }

  async findAll(userId: number) {
    const accountsReceivable = await this.prisma.accountsReceivable.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return accountsReceivable.map((item) => ({
      ...item,
      createdAt: this.utils.getDateTimeZone(item.createdAt),
      updatedAt: this.utils.getDateTimeZone(item.updatedAt)
    }))
  }

  async findOne(id: number, userId: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const accountReceivable = await this.prisma.accountsReceivable.findUnique({
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
      }
    });;

    if (!accountReceivable) {
      throw new NotFoundError(`not found accountReceivableId: ${id}`);
    }

    if (accountReceivable.creatorUserId !== userId) {
      throw new UnauthorizedError('you don\'t have permission to access this account receivable')
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

    const user = await this.prisma.users.findUnique({ where: { id: Number(userIdUpdate) } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    if (updateAccountsReceivableDto.sheetId) {
      const sheet = await this.prisma.sheets.findUnique({
        where: {
          id: updateAccountsReceivableDto.sheetId
        }
      })

      if (!sheet) {
        throw new BadRequestError('sheetId invalid')
      }

      if (sheet.creatorUserId !== Number(userIdUpdate)) {
        throw new UnauthorizedError('you don\'t have permission to add this receivable in this sheet')
      }
      return sheet
    }

    const accountReceivable = await this.prisma.accountsReceivable.findUnique({
      where: {
        id
      },
    });;

    if (!accountReceivable) {
      throw new NotFoundError(`not found accountReceivableId: ${id}`);
    }

    const accountReceivableUpdated = await this.prisma.accountsReceivable.update({
      where: {
        id
      },
      data: updateAccountsReceivableDto
    });

    return {
      ...accountReceivableUpdated,
      createdAt: this.utils.getDateTimeZone(accountReceivableUpdated.createdAt),
      updatedAt: this.utils.getDateTimeZone(accountReceivableUpdated.updatedAt)
    }
  }

  async remove(id: number, userId: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const accountReceivable = await this.prisma.accountsReceivable.findUnique({
      where: {
        id
      },
    });;

    if (!accountReceivable) {
      throw new NotFoundError(`not found accountReceivableId: ${id}`);
    }

    if (accountReceivable.creatorUserId !== userId) {
      throw new UnauthorizedError('you don\'t have permission to delete this account receivable')
    }

    const accountReceivableDeleted = await this.prisma.accountsReceivable.delete({
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

  async generateDuplicateDescription(originalDescription: string, userId: number) {
    try {
      let duplicateCount = 0
      let newItemDescription = originalDescription
      const userAccountReceivable = await this.prisma.accountsReceivable.findMany({
        where: {
          creatorUserId: userId
        }
      })

      const isDescriptionDuplicate = (description: string) => {
        return userAccountReceivable.some(({ description: existingDescription }) => {
          return existingDescription === description
        })
      }

      while (isDescriptionDuplicate(newItemDescription)) {
        duplicateCount++
        newItemDescription = `${originalDescription} (Cópia ${duplicateCount})`
      }

      return newItemDescription
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
