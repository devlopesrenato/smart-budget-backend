import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApi(): string {
    return 'Api Orçamento Pessoal executando com sucesso!';
  }
}
