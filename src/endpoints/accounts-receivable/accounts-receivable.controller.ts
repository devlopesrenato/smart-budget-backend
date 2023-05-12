import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AccountsReceivableService } from './accounts-receivable.service';
import { CreateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { UpdateAccountsReceivableDto } from './dto/update-accounts-receivable.dto';
import { ApiTags, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiOperation, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponseGenerate } from 'src/@types/swagger/api-response-generate';
import { AccountsReceivableEntity } from './entities/accounts-receivable.entity';

@ApiTags('Contas a Receber')
@Controller('accounts-receivable')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class AccountsReceivableController {
  constructor(private readonly accountsReceivableService: AccountsReceivableService) { }

  @Post()
  @ApiBody({ type: CreateAccountsReceivableDto })
  @ApiOperation({ summary: 'Criar uma nova conta a receber' })
  @ApiResponse({ status: 201, description: 'Conta a receber criada com sucesso', type: AccountsReceivableEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  create(@Body() createAccountsReceivableDto: CreateAccountsReceivableDto, @Req() req) {
    return this.accountsReceivableService.create(createAccountsReceivableDto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obter uma lista de todas as contas a receber' })
  @ApiResponse({ status: 200, description: 'Contas a receber retornadas com sucesso', type: [AccountsReceivableEntity] })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  findAll() {
    return this.accountsReceivableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma única conta a receber por ID' })
  @ApiParam({ name: 'id', description: 'ID da conta a receber' })
  @ApiResponse({ status: 200, description: 'Conta a receber retornada com sucesso', type: AccountsReceivableEntity })
  @ApiResponse(ApiResponseGenerate(404, "Conta a receber não encontrada"))
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  findOne(@Param('id') id: string) {
    return this.accountsReceivableService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma conta a receber existente por ID' })
  @ApiParam({ name: 'id', description: 'ID da conta a receber' })
  @ApiBody({ type: UpdateAccountsReceivableDto })
  @ApiResponse({ status: 200, description: 'Conta a receber atualizada com sucesso', type: AccountsReceivableEntity })
  @ApiResponse(ApiResponseGenerate(404, "Conta a receber não encontrada"))
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse({ description: 'Não autorizado.', schema: ApiResponseGenerate(401, "Unauthorized") })
  update(@Param('id') id: string, @Body() updateAccountsReceivableDto: UpdateAccountsReceivableDto, @Req() req) {
    return this.accountsReceivableService.update(+id, updateAccountsReceivableDto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma conta a receber existente por ID' })
  @ApiParam({ name: 'id', description: 'ID da conta a receber' })
  @ApiResponse({ status: 200, description: 'Conta a receber removida com sucesso', type: AccountsReceivableEntity })
  @ApiResponse(ApiResponseGenerate(404, "Conta a receber não encontrada"))
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  remove(@Param('id') id: string) {
    return this.accountsReceivableService.remove(+id);
  }
}
