import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@src/auth/auth.service';
import { BadRequestError } from '@src/common/errors/types/BadRequestError';
import { ConflictError } from '@src/common/errors/types/ConflictError';
import { InternalServerError } from '@src/common/errors/types/InternalServerError';
import { NotFoundError } from '@src/common/errors/types/NotFoundError';
import { UnauthorizedError } from '@src/common/errors/types/UnauthorizedError';
import { UsersService } from "@src/endpoints/users/users.service";
import { PrismaService } from '@src/prisma/prisma.service';
import { EmailService } from '@src/services/email/email.service';
import { Utils } from '@src/utils';
import { UsersDataMock } from './users.data-mock';

describe('Users Service', () => {
    let usersService: UsersService;
    let prismaService: PrismaService;
    let emailService: EmailService;
    let utils: Utils;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                Utils,
                AuthService,
                EmailService,
                {
                    provide: PrismaService,
                    useValue: {
                        users: {
                            findUnique: jest.fn(({ where: { id, email } }) => UsersDataMock.find(({ id: userID, email: userEmail }) => userID === id || userEmail === email)),
                            update: jest.fn(({ where: { id }, data }) => {
                                const user = UsersDataMock.find(({ id: userID }) => userID === id)
                                return { id, ...user, ...data }
                            }),
                            create: jest.fn(({ data: userData }) => ({ id: 3, ...userData, createdAt: UsersDataMock[0].createdAt })),
                            delete: jest.fn().mockReturnValueOnce(UsersDataMock[0]),
                        }
                    },
                },
                {
                    provide: EmailService,
                    useValue: {
                        sendMail: jest.fn().mockResolvedValue({ sent: true, info: { accepted: ['new_user@user.com'] } })
                    }
                }
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
        emailService = module.get<EmailService>(EmailService);
        utils = module.get<Utils>(Utils);
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
        expect(prismaService).toBeDefined();
    });

    describe('findOne', () => {
        it('should find a user by ID', async () => {
            const userId = 1;
            const request = {
                user: { id: 1 },
            };

            const result = await usersService.findOne(userId, request.user.id);
            expect(result).toEqual({
                ...UsersDataMock[0],
                createdAt: utils.getDateTimeZone(UsersDataMock[0].createdAt),
                updatedAt: utils.getDateTimeZone(UsersDataMock[0].updatedAt)
            });
            expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
        });

        it('should throw a BadRequestError when the id is invalid', async () => {
            try {
                await usersService.findOne(Number('a'), 1);

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('invalid id');
            }
        });

        it('should throw a NotFoundError when the id is not found', async () => {
            try {
                await usersService.findOne(10, 1);

                throw new Error('Expected a NotFoundError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toEqual('not found userId: 10');
            }
        });

        it('should throw a UnauthorizedError when the id is different ', async () => {
            try {
                await usersService.findOne(1, 2);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('you don\'t have permission to access this user');
            }
        });
    })

    describe('update', () => {
        it('should update', async () => {
            const result = await usersService.update(1, { password: "user_test" }, 1);

            expect(result).toEqual({
                ...UsersDataMock[0],
                password: result.password,
                createdAt: utils.getDateTimeZone(UsersDataMock[0].createdAt),
                updatedAt: result.updatedAt,
            });
        });

        it('should throw a BadRequestError when the id is invalid', async () => {
            try {
                await usersService.update(Number('a'), { name: "User Test" }, 1);

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('invalid id');
            }
        });

        it('should throw a NotFoundError when the id is not found', async () => {
            try {
                await usersService.update(10, { name: "User Test" }, 1);

                throw new Error('Expected a NotFoundError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toEqual('not found userId: 10');
            }
        });

        it('should throw a UnauthorizedError when the id is different from the id obtained in the token', async () => {
            try {
                await usersService.update(1, { name: "User Test" }, 2);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('you don\'t have permission to access this user');
            }
        });

        it('should throw a ConflictError when the email already exists', async () => {
            try {
                await usersService.update(1, { email: "user_2@user.com.br" }, 1);

                throw new Error('Expected a ConflictError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(ConflictError);
                expect(error.message).toEqual('this email already exists: user_2@user.com.br');
            }
        });
    });

    describe('update password', () => {
        it('should update password', async () => {
            const result = await usersService.updatePassword({
                email: "user@user.com.br",
                password: "user_test"
            }, 1);

            expect(result).toEqual({
                ...UsersDataMock[0],
                password: result.password,
                createdAt: utils.getDateTimeZone(UsersDataMock[0].createdAt),
                updatedAt: result.updatedAt,
            });
        });

        it('should throw a NotFoundError when the id is not found', async () => {
            try {
                await usersService.updatePassword({
                    email: "user@user.com.br",
                    password: "user_test"
                }, 50);

                throw new Error('Expected a NotFoundError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toEqual('not found user');
            }
        });

        it('should throw a BadRequestError when the sent email is different from the email obtained by the id', async () => {
            try {
                await usersService.updatePassword({
                    email: "user_fake@user.com.br",
                    password: "user_test"
                }, 1);

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('this email does not belong to this userToken');
            }
        });

        it('should throw a BadRequestError when the sent password is not sent', async () => {
            try {
                await usersService.updatePassword({
                    email: "user@user.com.br",
                    password: undefined
                }, 1);

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('password not sent');
            }
        });
    });

    describe('delete', () => {
        it('should delete user', async () => {
            const result = await usersService.remove(1, 1);

            expect(result).toEqual({
                ...UsersDataMock[0],
                createdAt: utils.getDateTimeZone(UsersDataMock[0].createdAt),
                updatedAt: utils.getDateTimeZone(UsersDataMock[0].updatedAt),
            });
        });

        it('should throw a BadRequestError when the id is invalid', async () => {
            try {
                await usersService.remove(Number('a'), 1);

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('invalid id');
            }
        });

        it('should throw a NotFoundError when the id is not found', async () => {
            try {
                await usersService.remove(50, 1);

                throw new Error('Expected a NotFoundError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toEqual('not found userId: 50');
            }
        });

        it('should throw a UnauthorizedError when the id is different ', async () => {
            try {
                await usersService.remove(1, 2);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('you don\'t have permission to access this user');
            }
        });
    });

    describe('signup', () => {
        it('should signup', async () => {
            const result = await usersService.signup({
                email: "new_user@user.com",
                name: "New User",
                password: "new_password"
            });

            expect(result).toEqual({
                id: 3,
                name: "New User",
                email: "new_user@user.com",
                createdAt: utils.getDateTimeZone(UsersDataMock[0].createdAt),
            });
        });

        it('should throw a ConflictError when the email already exists', async () => {
            try {
                await usersService.signup({
                    email: "user@user.com.br",
                    name: "New User",
                    password: "new_password"
                });
                throw new Error('Expected a ConflictError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(ConflictError);
                expect(error.message).toEqual('this email already exists: user@user.com.br');
            }
        });
    });

    describe('signin', () => {
        it('should signin', async () => {
            const result = await usersService.signin({
                email: "user@user.com.br",
                password: "password_bcrypt"
            });

            expect(result).toEqual({
                id: 1,
                name: "User 1",
                email: "user@user.com.br",
                jwtToken: result.jwtToken,
            });
        });

        it('should throw a UnauthorizedError when the email is incorrect', async () => {
            try {
                await usersService.signin({
                    email: "user@user.com",
                    password: "password_bcrypt"
                });
                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('Invalid Credentials');
            }
        });

        it('should throw a UnauthorizedError when the password is incorrect', async () => {
            try {
                await usersService.signin({
                    email: "user@user.com.br",
                    password: "password-bcrypt"
                });
                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('Invalid Credentials');
            }
        });

        it('should throw a UnauthorizedError when the email is not confirmed', async () => {
            try {
                await usersService.signin({
                    email: "user_2@user.com.br",
                    password: "password_bcrypt"
                });
                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('email not validated. validate the email before logging in');
            }
        });
    });

    describe('email confirmation', () => {
        it('should send email confirmation', async () => {
            const result = await usersService.emailConfirmation(2);

            expect(result).toEqual({
                statusCode: 200,
                message: 'email confirmed successfully'
            });
        });

        it('should throw a BadRequestError when the id is invalid', async () => {
            try {
                await usersService.emailConfirmation(Number('a'));

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('Invalid token');
            }
        });

        it('should throw a UnauthorizedError when the id is not found', async () => {
            try {
                await usersService.emailConfirmation(10);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('Invalid token');
            }
        });

        it('should throw a BadRequestError when the email is already confirmed', async () => {
            try {
                await usersService.emailConfirmation(1);

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('email already confirmed');
            }
        });
    });

    describe('recover password', () => {
        it('should recover password', async () => {
            const result = await usersService.recoverPassword({
                email: "user@user.com.br"
            });

            expect(result).toEqual({
                message: 'sent password recovery',
            });
        });

        it('should throw a BadRequestError when the email was not sent', async () => {
            try {
                await usersService.recoverPassword({
                    email: undefined
                });

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('email not sent');
            }
        });

        it('should throw a BadRequestError when the password reset email has already been sent in less than 5 minutes', async () => {
            try {
                await usersService.recoverPassword({
                    email: "user_2@user.com.br"
                });

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('A password reset email has already been sent in less than 5 minutes.');
            }
        });
    });

    describe('verify data', () => {
        it('should check the data', async () => {
            const result = await usersService.verifyData({
                email: "user@user.com.br",
                name: "User 1"
            }, 1);

            expect(result).toEqual({ message: 'successfully validated data' });
        });

        it('should throw a BadRequestError when the id is not found', async () => {
            try {
                await usersService.verifyData({
                    email: "user@user.com.br",
                    name: "User 1"
                }, 10);

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('user not found');
            }
        });

        it('should throw a BadRequestError when the email is different from the email obtained by the id', async () => {
            try {
                await usersService.verifyData({
                    email: "user_2@user.com.br",
                    name: "User 1"
                }, 1);

                throw new Error('Expected a BadRequestError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
                expect(error.message).toEqual('this email does not belong to this userToken');
            }
        });
    });

    describe('resend validation email', () => {
        it('should resend the validation email', async () => {
            const result = await usersService.resendValidationEmail("user@user.com.br");

            expect(result).toEqual({ message: 'email successfully sent' });
        });

        it('should throw a NotFoundError when the id is not found', async () => {
            try {
                await usersService.resendValidationEmail("user_3@user.com.br");

                throw new Error('Expected a NotFoundError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toEqual('not found user by email: user_3@user.com.br');
            }
        });

        it('should throw a InternalServerError when the email was not sent', async () => {
            try {
                emailService.sendMail = jest.fn().mockResolvedValue({ sent: false, info: "error" })

                await usersService.resendValidationEmail("user@user.com.br");

                throw new Error('Expected a InternalServerError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerError);
                expect(error.message).toEqual('Internal Server Error - Error sending e-mail');
            }

            emailService.sendMail = jest.fn().mockResolvedValue({ sent: true, info: { accepted: ['new_user@user.com'] } })
        });
    });

});