import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { ConflictError } from 'src/common/errors/types/ConflictError';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';
import { Utils } from 'src/utils';
import sumProp from '../../utils/sumProp';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';

const prisma = new PrismaClient();
@Injectable()
export class SheetsService {
  constructor(private readonly utils: Utils) { }

  async create(createSheetDto: CreateSheetDto, userID: number) {
    const user = await prisma.users.findUnique({ where: { id: userID } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    const sheets = await prisma.sheets.findMany({
      where: {
        creatorUserId: user.id
      }
    });

    const sheetTest = sheets.filter(({ description }) => {
      description
        .trim()
        .toLocaleLowerCase() ===
        createSheetDto.description
          .trim()
          .toLocaleLowerCase()
    })

    if (sheetTest.length) {
      throw new ConflictError(`this sheet already exists: ${createSheetDto.description}`);
    }

    const sheetCreated = await prisma.sheets.create({
      data: {
        ...createSheetDto,
        description: createSheetDto.description.trim(),
        creatorUserId: user.id,
      }

    })

    return {
      ...sheetCreated,
      createdAt: this.utils.getDateTimeZone(sheetCreated.createdAt),
      updatedAt: this.utils.getDateTimeZone(sheetCreated.updatedAt)
    }
  }

  async findAll(userID: number) {
    const user = await prisma.users.findUnique({ where: { id: userID } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    const sheets = await prisma.sheets.findMany({
      where: {
        creatorUserId: user.id
      }
    });

    return sheets.map((item) => ({
      ...item,
      createdAt: this.utils.getDateTimeZone(item.createdAt),
      updatedAt: this.utils.getDateTimeZone(item.updatedAt)
    }))
  }

  async findOne(id: number, userID: number) {
    const user = await prisma.users.findUnique({
      where: {
        id: userID
      }
    });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const sheet = await prisma.sheets.findUnique({
      where: {
        id,
      },
      include: {
        accountsPayable: true,
        accountsReceivable: true
      }
    });

    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${id}`);
    }

    if (sheet.creatorUserId !== userID) {
      throw new UnauthorizedError('you don\'t have permission to access this sheet')
    }

    const totalAccountsPayable = sumProp(sheet.accountsPayable, 'value')
    const totalAccountsReceivable = sumProp(sheet.accountsReceivable, 'value')
    const balance = parseFloat((totalAccountsReceivable - totalAccountsPayable).toFixed(2));

    return {
      ...sheet,
      createdAt: this.utils.getDateTimeZone(sheet.createdAt),
      updatedAt: this.utils.getDateTimeZone(sheet.updatedAt),
      totalAccountsPayable,
      totalAccountsReceivable,
      balance
    }
  }

  async update(id: number, updateSheetDto: UpdateSheetDto, userID: number) {
    const user = await prisma.users.findUnique({ where: { id: userID } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }

    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }

    const sheet = await prisma.sheets.findUnique({ where: { id } });

    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${id}`);
    }

    if (sheet.creatorUserId !== userID) {
      throw new UnauthorizedError('you don\'t have permission to modify this sheet')
    }

    const sheetDeleted = await prisma.sheets.update({
      where: {
        id
      },
      data: {
        ...updateSheetDto,
        description: updateSheetDto.description.trim(),
      }
    })

    return {
      ...sheetDeleted,
      createdAt: this.utils.getDateTimeZone(sheetDeleted.createdAt),
      updatedAt: this.utils.getDateTimeZone(sheetDeleted.updatedAt)
    }
  }

  async remove(id: number, userID: number) {
    const user = await prisma.users.findUnique({ where: { id: userID } });

    if (!user) {
      throw new UnauthorizedError(`user token invalid`);
    }


    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const sheet = await prisma.sheets.findUnique({ where: { id } });
    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${id}`);
    }

    if (sheet.creatorUserId !== userID) {
      throw new UnauthorizedError('you don\'t have permission to delete this sheet')
    }

    return prisma.sheets.delete({
      where: {
        id
      }
    });
  }
}
