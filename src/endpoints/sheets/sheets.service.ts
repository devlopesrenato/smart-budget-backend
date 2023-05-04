import { Injectable } from '@nestjs/common';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { PrismaClient } from '@prisma/client';
import sumProp from '../../utils/sumProp'

const prisma = new PrismaClient();
@Injectable()
export class SheetsService {
  create(createSheetDto: CreateSheetDto) {
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
    const data = await prisma.sheets.findUnique({
      where: {
        id
      },
      include: {
        accountsPayable: true,
        accountsReceivable: true
      }
    });

    const totalAccountsPayable = sumProp(data.accountsPayable, 'value')
    const totalAccountsReceivable = sumProp(data.accountsReceivable, 'value')
    const balance = parseFloat((totalAccountsReceivable - totalAccountsPayable).toFixed(2));

    return {
      ...data,
      totalAccountsPayable,
      totalAccountsReceivable,
      balance
    }
  }

  update(id: number, updateSheetDto: UpdateSheetDto) {
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

  remove(id: number) {
    return prisma.sheets.delete({
      where: {
        id
      }
    });
  }
}
