import { Provider } from "@nestjs/common";
import { UsersDataMock } from "@src/endpoints/users/test/users.data-mock";
import { PrismaService } from "@src/prisma/prisma.service";
import { SheetsDataMock } from "./sheets.data-mock";

export const PrismaServiceMock: Provider = {
    provide: PrismaService,
    useValue: {
        sheets: {
            findMany: jest.fn(({ where: { creatorUserId, description } }) => sheetsFindMany({ creatorUserId, description })),
            create: jest.fn().mockResolvedValue(SheetsDataMock[0]),
            findUnique: jest.fn(({ where: { id } }) => sheetsFindUnique(id)),
            update: jest.fn().mockResolvedValue(SheetsDataMock[0]),
            findFirst: jest.fn().mockResolvedValue(SheetsDataMock[0]),
            delete: jest.fn().mockResolvedValue(SheetsDataMock[0]),
        },
        users: {
            findUnique: jest.fn(({ where: { id, email } }) => UsersDataMock.find(({ id: userID, email: userEmail }) => userID === id || userEmail === email))
        },
        accountsReceivable: {
            createMany: jest.fn(),
        },
        accountsPayable: {
            createMany: jest.fn(),
        }
    },
}

function sheetsFindUnique(id: number) {
    const sheet = SheetsDataMock.find(({ id: sheetId }) => id === sheetId);
    if (!sheet) return;
    return {
        ...sheet,
        accountsPayable: [],
        accountsReceivable: [],
    }
};

function sheetsFindMany({ creatorUserId, description }) {
    return SheetsDataMock.filter(({ creatorUserId: id, description: desc }) =>
        id === creatorUserId
        || desc === description
    )
}