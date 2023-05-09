import { Injectable } from '@nestjs/common';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { PrismaClient } from '@prisma/client';
import sumProp from '../../utils/sumProp'
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { ConflictError } from 'src/common/errors/types/ConflictError';

const prisma = new PrismaClient();
@Injectable()
export class SheetsService {
  async create(createSheetDto: CreateSheetDto) {
    const sheet = await prisma.sheets.findUnique({
      where: {
        description: createSheetDto.description
      }
    });
    if (sheet) {
      throw new ConflictError(`this sheet already exists: ${createSheetDto.description}`);
    }
    return prisma.sheets.create({
      data: {
        ...createSheetDto,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  findAll() {
    return prisma.sheets.findMany();
  }

  async findOne(id: number) {
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
      totalAccountsPayable,
      totalAccountsReceivable,
      balance
    }
  }

  async update(id: number, updateSheetDto: UpdateSheetDto) {
    const sheet = await prisma.sheets.findUnique({ where: { id } });
    if (!sheet) {
      throw new NotFoundError(`not found sheetId: ${id}`);
    }
    return prisma.sheets.update({
      where: {
        id
      },
      data: {
        ...updateSheetDto,
        updatedAt: new Date()
      }
    })
  }

  async remove(id: number) {
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
