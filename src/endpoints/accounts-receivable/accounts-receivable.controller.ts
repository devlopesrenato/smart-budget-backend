import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AccountsReceivableService } from './accounts-receivable.service';
import { CreateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { UpdateAccountsReceivableDto } from './dto/update-accounts-receivable.dto';
import { ApiTags, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Contas a Receber')
@Controller('accounts-receivable')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class AccountsReceivableController {
  constructor(private readonly accountsReceivableService: AccountsReceivableService) {}

  @Post()
  @ApiBody({ type: CreateAccountsReceivableDto })
  @ApiOperation({ summary: 'Criar uma nova conta a receber' })
  @ApiResponse({ status: 201, description: 'Conta a receber criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  create(@Body() createAccountsReceivableDto: CreateAccountsReceivableDto) {
    return this.accountsReceivableService.create(createAccountsReceivableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obter uma lista de todas as contas a receber' })
  @ApiResponse({ status: 200, description: 'Contas a receber retornadas com sucesso' })
  findAll() {
    return this.accountsReceivableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma única conta a receber por ID' })
  @ApiParam({ name: 'id', description: 'ID da conta a receber' })
  @ApiResponse({ status: 200, description: 'Conta a receber retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta a receber não encontrada' })
  findOne(@Param('id') id: string) {
    return this.accountsReceivableService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma conta a receber existente por ID' })
  @ApiParam({ name: 'id', description: 'ID da conta a receber' })
  @ApiBody({ type: UpdateAccountsReceivableDto })
  @ApiResponse({ status: 200, description: 'Conta a receber atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 404, description: 'Conta a receber não encontrada' })
  update(@Param('id') id: string, @Body() updateAccountsReceivableDto: UpdateAccountsReceivableDto, @Req() req) {
    return this.accountsReceivableService.update(+id, updateAccountsReceivableDto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma conta a receber existente por ID' })
  @ApiParam({ name: 'id', description: 'ID da conta a receber' })
  @ApiResponse({ status: 200, description: 'Conta a receber removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta a receber não encontrada' })
  remove(@Param('id') id: string) {
    return this.accountsReceivableService.remove(+id);
  }
}
