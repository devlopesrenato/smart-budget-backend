import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { ConflictError } from 'src/common/errors/types/ConflictError';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';

@Injectable()
export class AccountsPayableService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: Utils
  ) { }

  async create(createAccountsPayableDto: CreateAccountsPayableDto, userId: number) {

    const user = await this.prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    const sheet = await this.prisma.sheets.findUnique({ where: { id: createAccountsPayableDto.sheetId } });

    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${createAccountsPayableDto.sheetId}`);
    }

    if (sheet.creatorUserId !== userId) {
      throw new UnauthorizedError('you don\'t have permission to add this payable in this sheet')
    }

    const accountPayable = await this.prisma.accountsPayable.findFirst({
      where: {
        description: createAccountsPayableDto.description,
        sheetId: createAccountsPayableDto.sheetId
      }
    })

    if (accountPayable) {
      throw new ConflictError(`account payable already exists for this sheetId: ${createAccountsPayableDto.sheetId}`)
    }

    const accountPayableCreated = await this.prisma.accountsPayable.create({
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

  async duplicate(id: number, userID: number) {
    const user = await this.prisma.users.findUnique({ where: { id: userID } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }

    const accountsPayable = await this.prisma.accountsPayable.findUnique({
      where: { id },
    });

    if (!accountsPayable) {
      throw new NotFoundError(`not found accountsPayableId: ${id}`);
    }

    if (accountsPayable.creatorUserId !== userID) {
      throw new UnauthorizedError('you don\'t have permission to duplique this account payable')
    }

    const newItemDescription = await this.generateDuplicateDescription(accountsPayable.description, user.id)
    try {
      const accountsPayableDuplicated = await this.prisma.accountsPayable.create({
        data: {
          description: newItemDescription,
          value: accountsPayable.value,
          creatorUserId: accountsPayable.creatorUserId,
          sheetId: accountsPayable.sheetId,
        }
      })

      return {
        ...accountsPayableDuplicated,
        createdAt: this.utils.getDateTimeZone(accountsPayableDuplicated.createdAt),
        updatedAt: this.utils.getDateTimeZone(accountsPayableDuplicated.updatedAt)
      }
    } catch (error) {
      const created = await this.prisma.accountsPayable.findFirst({
        where: {
          description: newItemDescription
        }
      })
      if (created) {
        await this.prisma.accountsPayable.delete({
          where: {
            id: created.id,
          }
        })
      }
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  async findAll(userId: number) {
    const accountsPayable = await this.prisma.accountsPayable.findMany({
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
    const accountPayable = await this.prisma.accountsPayable.findUnique({
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

    const user = await this.prisma.users.findUnique({ where: { id: Number(userIdUpdate) } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    if (updateAccountsPayableDto.sheetId) {
      const sheet = await this.prisma.sheets.findUnique({
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

    const accountPayable = await this.prisma.accountsPayable.findUnique({
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

    const accountPayableUpdated = await this.prisma.accountsPayable.update({
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
    const accountPayable = await this.prisma.accountsPayable.findUnique({
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

    const accountPayableDeleted = await this.prisma.accountsPayable.delete({
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

  async generateDuplicateDescription(originalDescription: string, userId: number) {
    try {
      let duplicateCount = 0
      let newItemDescription = originalDescription
      const userAccountPayable = await this.prisma.accountsPayable.findMany({
        where: {
          creatorUserId: userId
        }
      })

      const isDescriptionDuplicate = (description: string) => {
        return userAccountPayable.some(({ description: existingDescription }) => {
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
