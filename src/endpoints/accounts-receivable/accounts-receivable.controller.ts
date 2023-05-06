import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccountsReceivableService } from './accounts-receivable.service';
import { CreateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { UpdateAccountsReceivableDto } from './dto/update-accounts-receivable.dto';
import { ApiTags, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Contas a Receber')
@Controller('accounts-receivable')
export class AccountsReceivableController {
  constructor(private readonly accountsReceivableService: AccountsReceivableService) {}

  @Post()
  @ApiBody({ type: CreateAccountsReceivableDto })
  @ApiResponse({ status: 201, description: 'Conta a receber criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createAccountsReceivableDto: CreateAccountsReceivableDto) {
    return this.accountsReceivableService.create(createAccountsReceivableDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Contas a receber retornadas com sucesso' })
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.accountsReceivableService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID da conta a receber' })
  @ApiResponse({ status: 200, description: 'Conta a receber retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta a receber não encontrada' })
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.accountsReceivableService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID da conta a receber' })
  @ApiBody({ type: UpdateAccountsReceivableDto })
  @ApiResponse({ status: 200, description: 'Conta a receber atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 404, description: 'Conta a receber não encontrada' })
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateAccountsReceivableDto: UpdateAccountsReceivableDto) {
    return this.accountsReceivableService.update(+id, updateAccountsReceivableDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID da conta a receber' })
  @ApiResponse({ status: 200, description: 'Conta a receber removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta a receber não encontrada' })
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.accountsReceivableService.remove(+id);
  }
}
