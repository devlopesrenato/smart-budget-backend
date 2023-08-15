import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { ConflictError } from 'src/common/errors/types/ConflictError';
import { InternalServerError } from 'src/common/errors/types/InternalServerError';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/services/email/email.service';
import { Utils } from 'src/utils';
import { recoverPasswordMessage } from '../../services/email/messages/recover-password.message';
import { validationCodeMessage } from '../../services/email/messages/validation-code.message';
import { CreateUserDto } from './dto/create-user.dto';
import { RecoverPasswordDto } from './dto/recover.dto';
import { SigninDto } from './dto/signin.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyDataDto } from './dto/verify-data-dto.dto';
import { UserEntity } from './entities/user.entity';

const moment = require('moment-timezone')
const saltRounds = 10;
@Injectable()
export class UsersService {
  constructor(
    private readonly utils: Utils,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) { }

  async findOne(id: number, userID: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid id')
    }
    const user = await this.prisma.users.findUnique({ where: { id } });
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
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`not found userId: ${id}`);
    }

    if (user.id !== userID) {
      throw new UnauthorizedError('you don\'t have permission to access this user')
    }

    if (updateUserDto?.email) {
      const userEmail = await this.prisma.users.findUnique({ where: { email: updateUserDto?.email } });
      if (userEmail && userEmail?.id !== user.id) {
        throw new ConflictError(`this email already exists: ${updateUserDto?.email}`);
      }
    }

    const hashedPassword =
      updateUserDto.password
        ? await bcrypt.hash(updateUserDto.password, saltRounds)
        : undefined;

    const userUpdated = await this.prisma.users.update({
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

  async updatePassword(updatePasswordDto: UpdatePasswordDto, userID: number) {
    const user = await this.prisma.users.findUnique({ where: { id: userID } });
    if (!user) {
      throw new NotFoundError('not found user');
    }

    if (user.email !== updatePasswordDto.email) {
      throw new BadRequestError('this email does not belong to this userToken');
    }

    const hashedPassword =
      updatePasswordDto.password
        ? await bcrypt.hash(updatePasswordDto.password, saltRounds)
        : undefined;

    if (!hashedPassword) {
      throw new BadRequestError('password not sent');
    }

    const userUpdated = await this.prisma.users.update({
      where: {
        id: user.id
      },
      data: {
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
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`not found userId: ${id}`);
    }

    if (user.id !== userID) {
      throw new UnauthorizedError('you don\'t have permission to access this user')
    }

    const userDeleted = await this.prisma.users.delete({
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

  async signup(createUserDto: CreateUserDto) {
    const user = await this.prisma.users.findUnique({ where: { email: createUserDto.email } });
    if (user) {
      throw new ConflictError(`this email already exists: ${createUserDto.email}`);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const userCreated = await this.prisma.users.create({
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

    this.emailService.sendMail({
      clientEmail: userCreated.email,
      subject: 'Smart Budget - Confirme seu email.',
      message: validationCodeMessage(
        createUserDto.name,
        token
      ),
    })

    return {
      id: userCreated.id,
      name: userCreated.name,
      email: userCreated.email,
      createdAt: this.utils.getDateTimeZone(userCreated.createdAt)
    }
  }

  public async signin(signinDto: SigninDto): Promise<UserLogin> {
    const user: UserEntity = await this.prisma.users.findUnique({ where: { email: signinDto.email } });
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

  public async emailConfirmation(id: number) {
    if (!this.utils.isNotNumber(String(id))) {
      throw new BadRequestError('invalid token')
    }
    const user: UserEntity = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new UnauthorizedError('Invalid token');
    }
    if (user.emailValidated) {
      throw new BadRequestError('email already confirmed')
    }
    await this.prisma.users.update({
      where: {
        id
      },
      data: {
        emailValidated: true,
        emailValidatedAt: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
      }
    });

    return {
      statusCode: 200,
      message: 'email confirmed successfully'
    }

  }

  public async recoverPassword(recoverPasswordDto: RecoverPasswordDto) {
    if (!recoverPasswordDto.email) {
      throw new BadRequestError('email not sent')
    }

    const user = await this.prisma.users.findUnique({
      where: {
        email: recoverPasswordDto.email
      }
    })

    if (!user) {
      throw new BadRequestError('email not found')
    }

    if (user.recoverSentAt) {
      const currentDate = moment(user.recoverSentAt);
      const diffMinutes = moment().diff(currentDate, 'minutes');
      if (diffMinutes <= 5) {
        throw new BadRequestError('A password reset email has already been sent in less than 5 minutes.')
      }
    }

    const token = await this.authService.createAccessTokenWithTime(
      user.id,
      '5min',
    );

    try {
      await this.prisma.users.update({
        where: {
          id: user.id
        },
        data: {
          recoverSentAt: this.utils.getDateTimeZone(new Date())
        }
      })
      this.emailService.sendMail({
        clientEmail: user.email,
        subject: 'Smart Budget - Recuperação de senha.',
        message: recoverPasswordMessage(
          user.name,
          user.email,
          token
        ),
      })
      return {
        message: 'sent password recovery',
      }
    } catch (error) {
      throw new InternalServerError('internal error')
    }
  }

  public async verifyData(verifyDataDto: VerifyDataDto, userID: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userID
      }
    })
    if (!user) {
      throw new BadRequestError('user not found');
    }
    if (user.email !== verifyDataDto.email) {
      throw new BadRequestError('this email does not belong to this userToken');
    }
    return { message: 'successfully validated data' }
  }

  public async resendValidationEmail(email: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundError(`not found user by email: ${email}`);
    }

    try {

      const token = await this.authService.createAccessTokenWithTime(
        user.id,
        '60min',
      );

      await this.emailService.sendMail({
        clientEmail: user.email,
        subject: 'Smart Budget - Confirme seu email.',
        message: validationCodeMessage(
          user.name,
          token
        ),
      }).then(result => {     
        if (!result?.sent) {          
          throw new InternalServerError('error sending email')
        }
      })

      return { message: 'email successfully sent' }

    } catch (error) {
      throw new InternalServerError('Internal Server Error - Error sending e-mail')
    }
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
