import { Injectable } from '@nestjs/common';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { PrismaClient } from '@prisma/client';
import sumProp from '../../utils/sumProp'
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { ConflictError } from 'src/common/errors/types/ConflictError';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { Utils } from 'src/utils';

const prisma = new PrismaClient();
@Injectable()
export class SheetsService {
  constructor(
    private readonly utils: Utils
  ) { }

  async create(createSheetDto: CreateSheetDto) {
    const sheet = await prisma.sheets.findUnique({
      where: {
        description: createSheetDto.description
      }
    });
    if (sheet) {
      throw new ConflictError(`this sheet already exists: ${createSheetDto.description}`);
    }
    const sheetCreated = await prisma.sheets.create({
      data: {
        ...createSheetDto
      }
    })

    return {
      ...sheetCreated,
      createdAt: this.utils.getDateTimeZone(sheetCreated.createdAt),
      updatedAt: this.utils.getDateTimeZone(sheetCreated.updatedAt)
    }
  }

  async findAll() {
    const sheets = await prisma.sheets.findMany();

    return sheets.map((item) => ({
      ...item,
      createdAt: this.utils.getDateTimeZone(item.createdAt),
      updatedAt: this.utils.getDateTimeZone(item.updatedAt)
    }))
  }

  async findOne(id: number) {
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

  async update(id: number, updateSheetDto: UpdateSheetDto) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    
    const sheet = await prisma.sheets.findUnique({ where: { id } });
    
    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${id}`);
    }

    const sheetDeleted = await prisma.sheets.update({
      where: {
        id
      },
      data: {
        ...updateSheetDto
      }
    })

    return {
      ...sheetDeleted,
      createdAt: this.utils.getDateTimeZone(sheetDeleted.createdAt),
      updatedAt: this.utils.getDateTimeZone(sheetDeleted.updatedAt)
    }
  }

  async remove(id: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const sheet = await prisma.sheets.findUnique({ where: { id } });
    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${id}`);
    }
    return prisma.sheets.delete({
      where: {
        id
      }
    });
  }
}
