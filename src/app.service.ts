import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApi(): object {
    const baseUrl = process.env.API_URL || 'http://localhost:3000';
    return {
      status: "Budget Api executando com sucesso!",
      swagger: `${baseUrl}/api`
    };
  }
}
