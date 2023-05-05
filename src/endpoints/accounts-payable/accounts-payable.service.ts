import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class AccountsPayableService {

  async create(createAccountsPayableDto: CreateAccountsPayableDto) {
    const sheet = await prisma.sheets.findUnique({ where: { id: createAccountsPayableDto.sheetId } });
    
    if (!sheet) {
      throw new HttpException(`not found sheetId: ${createAccountsPayableDto.sheetId}`, HttpStatus.NOT_FOUND);
    }

    const user = await prisma.users.findUnique({ where: { id: createAccountsPayableDto.creatorUserId } });
    
    if (!user) {
      throw new HttpException(`not found userId: ${createAccountsPayableDto.creatorUserId}`, HttpStatus.NOT_FOUND);
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
      throw new HttpException(`not found accountPayableId: ${id}`, HttpStatus.NOT_FOUND);
    }

    return accountPayable;
  }

  async update(id: number, updateAccountsPayableDto: UpdateAccountsPayableDto) {
    const accountPayable = await prisma.accountsPayable.findUnique({
      where: {
        id
      },
    });;

    if (!accountPayable) {
      throw new HttpException(`not found accountPayableId: ${id}`, HttpStatus.NOT_FOUND);
    }

    return prisma.accountsPayable.update({
      where: {
        id
      },
      data: {
        ...updateAccountsPayableDto,
        updatedAt: new Date()
      }
    });
  }

  async remove(id: number) {
    const accountPayable = await prisma.accountsPayable.findUnique({
      where: {
        id
      },
    });;

    if (!accountPayable) {
      throw new HttpException(`not found accountPayableId: ${id}`, HttpStatus.NOT_FOUND);
    }

    return prisma.accountsPayable.delete({
      where: {
        id
      }
    });;
  }
}
