import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { SigninDto } from './dto/signin.dto';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';
import { ConflictError } from 'src/common/errors/types/ConflictError';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { Utils } from 'src/utils';

const prisma = new PrismaClient();
const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly utils: Utils
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = await prisma.users.findUnique({ where: { email: createUserDto.email } });
    if (user) {
      throw new ConflictError(`this email already exists: ${createUserDto.email}`);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const userCreated = await prisma.users.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return {
      ...userCreated,
      createdAt: this.utils.getDateTimeZone(userCreated.createdAt),
      updatedAt: this.utils.getDateTimeZone(userCreated.updatedAt)
    }
  }

  async findAll() {
    const users = await prisma.users.findMany();

    return users.map((item) => ({
      ...item,
      createdAt: this.utils.getDateTimeZone(item.createdAt),
      updatedAt: this.utils.getDateTimeZone(item.updatedAt)
    }))
  }

  async findOne(id: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`not found userId: ${id}`);
    }
    return {
      ...user,
      createdAt: this.utils.getDateTimeZone(user.createdAt),
      updatedAt: this.utils.getDateTimeZone(user.updatedAt)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`not found userId: ${id}`);
    }

    if (updateUserDto?.email) {
      const userEmail = await prisma.users.findUnique({ where: { email: updateUserDto?.email } });
      if (userEmail && userEmail?.id !== user.id) {
        throw new ConflictError(`this email already exists: ${updateUserDto?.email}`);
      }
    }

    const hashedPassword =
      updateUserDto.password
        ? await bcrypt.hash(updateUserDto.password, saltRounds)
        : undefined;

    const userUpdated = await prisma.users.update({
      where: {
        id
      },
      data: {
        ...updateUserDto,
        password: hashedPassword,
        updatedAt: new Date()
      }
    });

    return {
      ...userUpdated,
      createdAt: this.utils.getDateTimeZone(userUpdated.createdAt),
      updatedAt: this.utils.getDateTimeZone(userUpdated.updatedAt)
    }

  }

  async remove(id: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`not found userId: ${id}`);
    }
    const userDeleted = await prisma.users.delete({
      where: {
        id
      }
    });

    return {
      ...userDeleted,
      createdAt: this.utils.getDateTimeZone(userDeleted.createdAt),
      updatedAt: this.utils.getDateTimeZone(userDeleted.updatedAt)
    }

  }

  public async signin(signinDto: SigninDto): Promise<UserLogin> {
    const user: UserEntity = await prisma.users.findUnique({ where: { email: signinDto.email } });
    if (!user) {
      throw new UnauthorizedError('Invalid Credentials');
    }
    const match: boolean = await this.checkPassword(signinDto.password, user);
    if (!match) {
      throw new UnauthorizedError('Invalid Credentials');
    }
    const jwtToken = await this.authService.createAccessToken(user.id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      jwtToken: jwtToken,
    };
  }

  private async checkPassword(
    pass: string,
    user: UserEntity,
  ): Promise<boolean> {
    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      throw new UnauthorizedError('Invalid Credentials');
    }
    return match;
  }
}
