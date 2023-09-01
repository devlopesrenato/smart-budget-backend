import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        const baseUrl = process.env.API_URL || 'http://localhost:3000';
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect({
                status: "Budget Api executando com sucesso!",
                swagger: `${baseUrl}/api`
              });
    });
});