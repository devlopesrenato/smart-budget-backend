import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccountsPayableService } from './accounts-payable.service';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Contas a pagar')
@Controller('accounts-payable')
export class AccountsPayableController {
  constructor(private readonly accountsPayableService: AccountsPayableService) {}

  @ApiOperation({ summary: 'Criar uma nova conta a pagar' })
  @ApiBody({ type: CreateAccountsPayableDto })
  @ApiResponse({ status: 201, description: 'A conta a pagar foi criada com sucesso.'})
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createAccountsPayableDto: CreateAccountsPayableDto) {
    return this.accountsPayableService.create(createAccountsPayableDto);
  }

  @ApiOperation({ summary: 'Obter uma lista de todas as contas a pagar' })
  @ApiResponse({ status: 200, description: 'Retorna uma lista de contas a pagar.'})
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.accountsPayableService.findAll();
  }

  @ApiOperation({ summary: 'Obter uma única conta a pagar por ID' })
  @ApiParam({ name: 'id', description: 'O ID da conta a pagar para recuperar.' })
  @ApiResponse({ status: 200, description: 'A conta a pagar com o ID especificado.', type: UpdateAccountsPayableDto })
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.accountsPayableService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualizar uma conta a pagar existente por ID' })
  @ApiParam({ name: 'id', description: 'O ID da conta a pagar para atualizar.' })
  @ApiBody({ type: UpdateAccountsPayableDto })
  @ApiResponse({ status: 200, description: 'A conta a pagar atualizada.', type: UpdateAccountsPayableDto })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateAccountsPayableDto: UpdateAccountsPayableDto) {
    return this.accountsPayableService.update(+id, updateAccountsPayableDto);
  }

  @ApiOperation({ summary: 'Excluir uma conta a pagar existente por ID' })
  @ApiParam({ name: 'id', description: 'O ID da conta a pagar para excluir.' })
  @ApiResponse({ status: 200, description: 'A conta a pagar foi excluída com sucesso.'})
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.accountsPayableService.remove(+id);
  }
}
