import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const saltRounds = 10;

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    return await prisma.users.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  findAll() {
    return prisma.users.findMany();
  }

  async findOne(id: number) {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(`not found userId: ${id}`, HttpStatus.NOT_FOUND);
    }
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(`not found userId: ${id}`, HttpStatus.NOT_FOUND);
    }
    const hashedPassword =
      updateUserDto.password
        ? await bcrypt.hash(updateUserDto.password, saltRounds)
        : undefined;

    return prisma.users.update({
      where: {
        id
      },
      data: {
        ...updateUserDto,
        password: hashedPassword,
        updatedAt: new Date()
      }
    });
  }

  async remove(id: number) {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(`not found userId: ${id}`, HttpStatus.NOT_FOUND);
    }
    return prisma.users.delete({
      where: {
        id
      }
    });
  }
}
