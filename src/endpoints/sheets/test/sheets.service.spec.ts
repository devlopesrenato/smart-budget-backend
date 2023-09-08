import { Test, TestingModule } from "@nestjs/testing";
import { ConflictError } from "@src/common/errors/types/ConflictError";
import { NotFoundError } from "@src/common/errors/types/NotFoundError";
import { UnauthorizedError } from "@src/common/errors/types/UnauthorizedError";
import { PrismaService } from "@src/prisma/prisma.service";
import { Utils } from "@src/utils";
import { SheetsService } from "../sheets.service";
import { PrismaServiceMock } from "./prisma-service.mock";
import { SheetsDataMock } from "./sheets.data-mock";

describe('Sheets Service', () => {
    let sheetsService: SheetsService;
    let prismaService: PrismaService;
    let utils: Utils;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SheetsService,
                Utils,
                PrismaServiceMock
            ],
        }).compile();

        sheetsService = module.get<SheetsService>(SheetsService);
        prismaService = module.get<PrismaService>(PrismaService);
        utils = module.get<Utils>(Utils);
    });

    it('should be defined', () => {
        expect(sheetsService).toBeDefined();
        expect(prismaService).toBeDefined();
    });

    describe('create', () => {
        it('should create', async () => {
            const result = await sheetsService.create({
                description: 'Sheet Test'
            }, 1);

            expect(result).toEqual({
                ...SheetsDataMock[0],
                createdAt: utils.getDateTimeZone(SheetsDataMock[0].createdAt),
                updatedAt: utils.getDateTimeZone(SheetsDataMock[0].updatedAt),
            });
            expect(prismaService.sheets.create).toHaveBeenCalled();
        });

        it('should throw a UnauthorizedError when the token id is invalid', async () => {
            try {
                await sheetsService.create({
                    description: 'Sheet Test'
                }, 10);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('user token invalid');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 10 } });
            }
        });

        it('should throw a ConflictError when the description already exists', async () => {
            try {
                await sheetsService.create({
                    description: 'Sheet 1'
                }, 1);

                throw new Error('Expected a ConflictError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(ConflictError);
                expect(error.message).toEqual('this sheet already exists: Sheet 1');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            }
        });
    });

    describe('findAll', () => {
        it('should find all', async () => {
            const userID = 1;
            const result = await sheetsService.findAll(userID);

            expect(result).toEqual(SheetsDataMock.map((item) => ({
                ...item,
                createdAt: utils.getDateTimeZone(item.createdAt),
                updatedAt: utils.getDateTimeZone(item.updatedAt)
            })).filter(({ creatorUserId }) => creatorUserId === userID));
            
            expect(prismaService.sheets.findMany).toHaveBeenCalled();
            expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: userID } });
        });

        it('should throw a UnauthorizedError when the token id is invalid', async () => {
            try {
                await sheetsService.findAll(10);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('user token invalid');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 10 } });
            }
        });
    });

    describe('find one', () => {
        it('should find one', async () => {
            const result = await sheetsService.findOne(1, 1);

            expect(result).toEqual({
                ...SheetsDataMock[0],
                createdAt: utils.getDateTimeZone(SheetsDataMock[0].createdAt),
                updatedAt: utils.getDateTimeZone(SheetsDataMock[0].updatedAt),
                accountsPayable: [],
                accountsReceivable: [],
                totalAccountsPayable: 0,
                totalAccountsReceivable: 0,
                balance: 0,
            });
            expect(prismaService.sheets.findUnique).toHaveBeenCalled();
            expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw a UnauthorizedError when the token id is invalid', async () => {
            try {
                await sheetsService.findOne(1, 10);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('user token invalid');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 10 } });
            }
        });

        it('should throw a NotFoundError when the sheet id is not found', async () => {
            try {
                await sheetsService.findOne(10, 1);

                throw new Error('Expected a NotFoundError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toEqual('not found sheetId: 10');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            }
        });

        it('should throw a UnauthorizedError when the user doesn\'t have permission to access the sheet', async () => {
            try {
                await sheetsService.findOne(2, 1);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('you don\'t have permission to access this sheet');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            }
        });
    });

    describe('update', () => {
        it('should update', async () => {
            const result = await sheetsService.update(1, {
                description: 'Sheet Test Update'
            }, 1);

            expect(result).toEqual({
                ...SheetsDataMock[0],
                createdAt: utils.getDateTimeZone(SheetsDataMock[0].createdAt),
                updatedAt: utils.getDateTimeZone(SheetsDataMock[0].updatedAt),
            });
            expect(prismaService.sheets.findUnique).toHaveBeenCalled();
            expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw a UnauthorizedError when the token id is invalid', async () => {
            try {
                await sheetsService.update(1, {
                    description: 'Sheet Test Update'
                }, 10);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('user token invalid');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 10 } });
            }
        });

        it('should throw a NotFoundError when the sheet id is not found', async () => {
            try {
                await sheetsService.update(10, {
                    description: 'Sheet Test Update'
                }, 1);

                throw new Error('Expected a NotFoundError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toEqual('not found sheetId: 10');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            }
        });

        it('should throw a UnauthorizedError when the user doesn\'t have permission to access the sheet', async () => {
            try {
                await sheetsService.update(2, {
                    description: 'Sheet Test Update'
                }, 1);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('you don\'t have permission to modify this sheet');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            }
        });

        it('should throw a ConflictError when trying to rename to an existing description', async () => {
            try {
                await sheetsService.update(1, {
                    description: 'Sheet 3'
                }, 1);

                throw new Error('Expected a ConflictError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(ConflictError);
                expect(error.message).toEqual('this sheet already exists: Sheet 3');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            }
        });
    })

    describe('duplicate', () => {
        it('should duplicate', async () => {
            const result = await sheetsService.duplicate(1, 1);

            expect(result).toEqual({
                ...SheetsDataMock[0],
                createdAt: utils.getDateTimeZone(SheetsDataMock[0].createdAt),
                updatedAt: utils.getDateTimeZone(SheetsDataMock[0].updatedAt),
            });
            expect(prismaService.sheets.findUnique).toHaveBeenCalled();
            expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(prismaService.accountsReceivable.createMany).toHaveBeenCalled();
            expect(prismaService.accountsReceivable.createMany).toHaveBeenCalled();
        });

        it('should throw a UnauthorizedError when the token id is invalid', async () => {
            try {
                await sheetsService.duplicate(1, 10);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('user token invalid');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 10 } });
            }
        });

        it('should throw a NotFoundError when the sheet id is not found', async () => {
            try {
                await sheetsService.duplicate(10, 1);

                throw new Error('Expected a NotFoundError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toEqual('not found sheetId: 10');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            }
        });

        it('should throw a UnauthorizedError when the user doesn\'t have permission to access the sheet', async () => {
            try {
                await sheetsService.duplicate(1, 2);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('you don\'t have permission to duplique this sheet');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            }
        });
    })

    describe('remove', () => {
        it('should remove', async () => {
            const result = await sheetsService.remove(1, 1);

            expect(result).toEqual(SheetsDataMock[0]);
            expect(prismaService.sheets.findUnique).toHaveBeenCalled();
            expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw a UnauthorizedError when the token id is invalid', async () => {
            try {
                await sheetsService.remove(1, 10);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('user token invalid');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 10 } });
            }
        });

        it('should throw a NotFoundError when the sheet id is not found', async () => {
            try {
                await sheetsService.remove(10, 1);

                throw new Error('Expected a NotFoundError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toEqual('not found sheetId: 10');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            }
        });

        it('should throw a UnauthorizedError when the user doesn\'t have permission to access the sheet', async () => {
            try {
                await sheetsService.remove(2, 1);

                throw new Error('Expected a UnauthorizedError to be thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
                expect(error.message).toEqual('you don\'t have permission to delete this sheet');
                expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            }
        });
    });

    it('generate duplicate description', async () => {
        prismaService.sheets.findMany = jest.fn().mockResolvedValue([
            SheetsDataMock[0],
            {
                ...SheetsDataMock[1],
                description: 'Sheet 1 (Cópia 1)'
            }
        ]);

        const result = await sheetsService.generateDuplicateDescription('Sheet 1', 1);

        expect(result).toEqual('Sheet 1 (Cópia 2)');
        expect(prismaService.sheets.findMany).toHaveBeenCalled();
    })
});