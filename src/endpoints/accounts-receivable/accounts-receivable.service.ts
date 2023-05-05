import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { UpdateAccountsReceivableDto } from './dto/update-accounts-receivable.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class AccountsReceivableService {
  async create(createAccountsReceivableDto: CreateAccountsReceivableDto) {
    const sheet = await prisma.sheets.findUnique({ where: { id: createAccountsReceivableDto.sheetId } });

    if (!sheet) {
      throw new HttpException(`not found sheetId: ${createAccountsReceivableDto.sheetId}`, HttpStatus.NOT_FOUND);
    }

    const user = await prisma.users.findUnique({ where: { id: createAccountsReceivableDto.creatorUserId } });
    
    if (!user) {
      throw new HttpException(`not found userId: ${createAccountsReceivableDto.creatorUserId}`, HttpStatus.NOT_FOUND);
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
      throw new HttpException(`not found accountReceivableId: ${id}`, HttpStatus.NOT_FOUND);
    }

    return accountReceivable;
  }

  async update(id: number, updateAccountsReceivableDto: UpdateAccountsReceivableDto) {
    const accountReceivable = await prisma.accountsReceivable.findUnique({
      where: {
        id
      },
    });;

    if (!accountReceivable) {
      throw new HttpException(`not found accountReceivableId: ${id}`, HttpStatus.NOT_FOUND);
    }

    return prisma.accountsReceivable.update({
      where: {
        id
      },
      data: {
        ...updateAccountsReceivableDto,
        updatedAt: new Date()
      }
    });
  }

  async remove(id: number) {
    const accountReceivable = await prisma.accountsReceivable.findUnique({
      where: {
        id
      },
    });;

    if (!accountReceivable) {
      throw new HttpException(`not found accountReceivableId: ${id}`, HttpStatus.NOT_FOUND);
    }

    return prisma.accountsReceivable.delete({
      where: {
        id
      }
    });;
  }
}
