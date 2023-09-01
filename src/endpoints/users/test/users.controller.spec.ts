import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '@src/endpoints/users/dto/create-user.dto';
import { SigninDto } from '@src/endpoints/users/dto/signin.dto';
import { UpdatePasswordDto } from '@src/endpoints/users/dto/update-password.dto';
import { UpdateUserDto } from '@src/endpoints/users/dto/update-user.dto';
import { VerifyDataDto } from '@src/endpoints/users/dto/verify-data-dto.dto';
import { UsersController } from '@src/endpoints/users/users.controller';
import { UsersService } from '@src/endpoints/users/users.service';
import { UsersDataMock } from './users.data-mock';

describe('Users Controller', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  const loginResponse = {
    name: "User 1",
    email: "user@user.com",
    jwtToken: "jwtToken"
  };
  const confimResponse = {
    statusCode: 200,
    message: "email confirmed successfully"
  }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockReturnValueOnce(UsersDataMock[0]),
            update: jest.fn().mockReturnValueOnce(UsersDataMock[0]),
            updatePassword: jest.fn().mockReturnValueOnce(UsersDataMock[0]),
            remove: jest.fn().mockReturnValueOnce(UsersDataMock[0]),
            signup: jest.fn().mockReturnValueOnce(UsersDataMock[0]),
            signin: jest.fn().mockReturnValueOnce(loginResponse),
            emailConfirmation: jest.fn().mockReturnValueOnce(confimResponse),
            recoverPassword: jest.fn().mockReturnValueOnce({ message: "sent password recovery" }),
            verifyData: jest.fn().mockReturnValueOnce(UsersDataMock[0]),
            resendValidationEmail: jest.fn().mockReturnValueOnce({ message: "email successfully sent" }),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should find a user by ID', () => {
    const userId = '1';
    const request = {
      user: { id: 1 },
    };

    const result = usersController.findOne(userId, request);

    expect(result).toEqual(UsersDataMock[0]);
    expect(usersService.findOne).toHaveBeenCalledWith(+userId, request.user.id);
  });

  it('should update a user by ID', () => {
    const userId = '1';
    const dataUpdated: UpdateUserDto = {
      email: "new_email@user.com.br",
      name: "new_name",
      password: "new_password"
    }
    const request = {
      user: { id: 1 },
    };

    const result = usersController.update(userId, dataUpdated, request);

    expect(result).toEqual(UsersDataMock[0]);
    expect(usersService.update).toHaveBeenCalledWith(+userId, dataUpdated, request.user.id);
  });

  it('should update password', () => {
    const dataUpdated: UpdatePasswordDto = {
      email: "user@user.com.br",
      password: "new_password"
    }
    const request = {
      user: { id: 1 },
    };

    const result = usersController.updatePassword(dataUpdated, request);

    expect(result).toEqual(UsersDataMock[0]);
    expect(usersService.updatePassword).toHaveBeenCalledWith(dataUpdated, request.user.id);
  });

  it('should remove a user by ID', () => {
    const userId = '1';
    const request = {
      user: { id: 1 },
    };

    const result = usersController.remove(userId, request);

    expect(result).toEqual(UsersDataMock[0]);
    expect(usersService.remove).toHaveBeenCalledWith(+userId, request.user.id);
  });

  it('should create a user', () => {
    const userCreate: CreateUserDto = {
      email: 'user@user.com.br',
      name: 'User 1',
      password: 'password_bcrypt'
    }

    const result = usersController.create(userCreate);

    expect(result).toEqual(UsersDataMock[0]);
    expect(usersService.signup).toHaveBeenCalledWith(userCreate);
  });

  it('should login user', async () => {
    const userLogin: SigninDto = {
      email: 'user@user.com.br',
      password: 'password_bcrypt'
    }

    const result = await usersController.signin(userLogin);

    expect(result).toEqual(loginResponse);
    expect(usersService.signin).toHaveBeenCalledWith(userLogin);
  });

  it('should confirm email', async () => {
    const request = {
      user: { id: 1 },
    };

    const result = await usersController.emailConfirmation(request);

    expect(result).toEqual(confimResponse);
    expect(usersService.emailConfirmation).toHaveBeenCalledWith(request.user.id);
  });

  it('should recover password', async () => {
    const result = await usersController.recoverPassword({ email: 'user@user.com' });

    expect(result).toEqual({ message: "sent password recovery" });
    expect(usersService.recoverPassword).toHaveBeenCalledWith({ email: 'user@user.com' });
  });

  it('should validate a user data', () => {
    const userData: VerifyDataDto = {
      email: 'user@user.com',
      name: 'User 1'
    };
    const request = {
      user: { id: 1 },
    };

    const result = usersController.validateData(userData, request);

    expect(result).toEqual(UsersDataMock[0]);
    expect(usersService.verifyData).toHaveBeenCalledWith(userData, request.user.id);
  });

  it('should resend validation email', async () => {
    const result = await usersController.resendValidationEmail({ email: 'user@user.com' });

    expect(result).toEqual({ message: "email successfully sent" });
    expect(usersService.resendValidationEmail).toHaveBeenCalledWith('user@user.com');
  });

});