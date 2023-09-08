import { SheetEntity } from "../entities/sheet.entity";

export const SheetsDataMock: SheetEntity[] = [
    {
        id: 1,
        description: "Sheet 1",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        creatorUserId: 1,
        updatedAt: new Date("2023-01-01T00:00:00Z"),
    },
    {
        id: 2,
        description: "Sheet 2",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        creatorUserId: 2,
        updatedAt: new Date("2023-01-01T00:00:00Z"),
    },
    {
        id: 3,
        description: "Sheet 3",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        creatorUserId: 1,
        updatedAt: new Date("2023-01-01T00:00:00Z"),
    },
    {
        id: 4,
        description: "Sheet 4",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        creatorUserId: 2,
        updatedAt: new Date("2023-01-01T00:00:00Z"),
    }
]