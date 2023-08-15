import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UnauthorizedError } from './common/errors/types/UnauthorizedError';
import { UsersService } from './endpoints/users/users.service';

@ApiTags('Api')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) { }

  @Get()
  @ApiOperation({ summary: 'Status da Api', description: 'Retorna o status da Api' })
  @ApiResponse({ status: 200, description: 'Api Orçamento Pessoal executando com sucesso' })
  getApi(): object {
    return this.appService.getApi();
  }

  @Get('/account/confirm')
  @ApiOperation({ summary: 'Confirmação do email', description: 'Rota para teste de confirmação do email' })
  @ApiResponse({ status: 200, description: 'email confirmed successfully' })
  async confirm(@Query('token') token: string) {
    try {
      const userId = await this.authService.extractDataFromToken(token);
      return this.userService.emailConfirmation(userId)
    } catch (error) {
      throw new UnauthorizedError('Invalid token')
    }
  }
}
