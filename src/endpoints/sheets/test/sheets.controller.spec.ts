import { Test, TestingModule } from "@nestjs/testing";
import { SheetsController } from "../sheets.controller";
import { SheetsService } from './../sheets.service';
import { SheetsDataMock } from "./sheets.data-mock";

describe('Sheets Controller', () => {
    let sheetsController: SheetsController;
    let sheetsService: SheetsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SheetsController],
            providers: [
                {
                    provide: SheetsService,
                    useValue: {
                        create: jest.fn().mockReturnValueOnce(SheetsDataMock[0]),
                        findAll: jest.fn().mockReturnValueOnce(SheetsDataMock),
                        findOne: jest.fn().mockReturnValueOnce(SheetsDataMock[0]),
                        update: jest.fn().mockReturnValueOnce(SheetsDataMock[0]),
                        duplicate: jest.fn().mockReturnValueOnce(SheetsDataMock[0]),
                        remove: jest.fn().mockReturnValueOnce(SheetsDataMock[0]),
                    },
                },
            ],
        }).compile();

        sheetsController = module.get<SheetsController>(SheetsController);
        sheetsService = module.get<SheetsService>(SheetsService);
    });

    it('should be defined', () => {
        expect(sheetsController).toBeDefined();
        expect(sheetsService).toBeDefined();
    });

    it('create', () => {
        const result = sheetsController.create({
            description: 'Sheet Test'
        }, 1);

        expect(result).toEqual(SheetsDataMock[0]);
        expect(sheetsService.create).toHaveBeenCalled();
    });

    it('find all', () => {
        const result = sheetsController.findAll(1);

        expect(result).toEqual(SheetsDataMock);
        expect(sheetsService.findAll).toHaveBeenCalled();
    });

    it('find one', () => {
        const result = sheetsController.findOne('1', 1);

        expect(result).toEqual(SheetsDataMock[0]);
        expect(sheetsService.findOne).toHaveBeenCalled();
    });

    it('update', () => {
        const result = sheetsController.update('1', {
            description: 'Sheet Test Update'
        }, 1);

        expect(result).toEqual(SheetsDataMock[0]);
        expect(sheetsService.update).toHaveBeenCalled();
    });

    it('duplicate', () => {
        const result = sheetsController.duplicate('1', 1);

        expect(result).toEqual(SheetsDataMock[0]);
        expect(sheetsService.duplicate).toHaveBeenCalled();
    });

    it('remove', () => {
        const result = sheetsController.remove('1', 1);

        expect(result).toEqual(SheetsDataMock[0]);
        expect(sheetsService.remove).toHaveBeenCalled();
    });

})
