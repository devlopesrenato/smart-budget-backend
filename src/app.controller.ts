import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Api')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Status da Api', description: 'Retorna o status da Api' })
  @ApiResponse({ status: 200, description: 'Api Orçamento Pessoal executando com sucesso' })
  getApi(): string {
    return this.appService.getApi();
  }
}
