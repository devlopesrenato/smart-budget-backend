import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { ConflictError } from 'src/common/errors/types/ConflictError';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';
import { EmailService } from 'src/services/email/email.service';
import { Utils } from 'src/utils';
import { validationCodeMessage } from '../../services/email/messages/validation-code.message';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

const prisma = new PrismaClient();
const saltRounds = 10;
const emailService = new EmailService();
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
        emailValidated: false,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    const token = await this.authService.createAccessTokenWithTime(
      userCreated.id,
      '60min',
    );

    emailService.sendMail({
      clientEmail: userCreated.email,
      subject: 'BUDGET APP - Confirme seu email.',
      message: validationCodeMessage(
        createUserDto.name,
        token
      ),
    })

    return {
      ...userCreated,
      createdAt: this.utils.getDateTimeZone(userCreated.createdAt),
      updatedAt: this.utils.getDateTimeZone(userCreated.updatedAt)
    }
  }

  async findOne(id: number, userID: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`not found userId: ${id}`);
    }

    if (user.id !== userID) {
      throw new UnauthorizedError('you don\'t have permission to access this user')
    }

    return {
      ...user,
      createdAt: this.utils.getDateTimeZone(user.createdAt),
      updatedAt: this.utils.getDateTimeZone(user.updatedAt)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, userID: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`not found userId: ${id}`);
    }

    if (user.id !== userID) {
      throw new UnauthorizedError('you don\'t have permission to access this user')
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

  async remove(id: number, userID: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`not found userId: ${id}`);
    }

    if (user.id !== userID) {
      throw new UnauthorizedError('you don\'t have permission to access this user')
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

    if (!user.emailValidated) {
      throw new UnauthorizedError('email not validated. validate the email before logging in')
    }

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
