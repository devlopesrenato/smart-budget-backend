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

const prisma = new PrismaClient();
const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
  ) { }

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
    return 'oi'//prisma.users.findMany();
  }

  async findOne(id: number) {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`not found userId: ${id}`);
    }
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`not found userId: ${id}`);
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
      throw new NotFoundError(`not found userId: ${id}`);
    }
    return prisma.users.delete({
      where: {
        id
      }
    });
  }

  public async signin(signinDto: SigninDto): Promise<{
    id: number;
    name: string;
    email: string;
    jwtToken: string;
  }> {
    const user = await prisma.users.findUnique({ where: { email: signinDto.email } });
    const match = await this.checkPassword(signinDto.password, user);
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
