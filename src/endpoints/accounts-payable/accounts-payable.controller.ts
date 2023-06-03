import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiResponseGenerate } from 'src/@types/swagger/api-response-generate';
import { AuthService } from 'src/auth/auth.service';
import { AccountsPayableService } from './accounts-payable.service';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { AccountsPayableEntity } from './entities/accounts-payable.entity';

@Controller('accounts-payable')
@ApiTags('Contas a pagar')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class AccountsPayableController {
  constructor(
    private readonly accountsPayableService: AccountsPayableService,
    private readonly authService: AuthService
  ) { }

  @Post()
  @ApiBody({ type: CreateAccountsPayableDto })
  @ApiOperation({ summary: 'Criar uma nova conta a pagar' })
  @ApiResponse({ status: 201, description: 'A conta a pagar foi criada com sucesso.', type: AccountsPayableEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  create(@Body() createAccountsPayableDto: CreateAccountsPayableDto, @Req() req) {
    return this.accountsPayableService.create(createAccountsPayableDto, req.user?.id);
  }

  @ApiOperation({ summary: 'Obter uma lista de todas as contas a pagar' })
  @ApiResponse({ status: 200, description: 'Retorna uma lista de contas a pagar.', type: [AccountsPayableEntity] })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @Get()
  findAll(@Req() req) {
    return this.accountsPayableService.findAll(req.user?.id);
  }

  @ApiOperation({ summary: 'Obter uma única conta a pagar por ID' })
  @ApiParam({ name: 'id', description: 'O ID da conta a pagar para recuperar.' })
  @ApiResponse({ status: 200, description: 'A conta a pagar com o ID especificado.', type: AccountsPayableEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.accountsPayableService.findOne(+id, req.user?.id);
  }

  @ApiOperation({ summary: 'Atualizar uma conta a pagar existente por ID' })
  @ApiParam({ name: 'id', description: 'O ID da conta a pagar para atualizar.' })
  @ApiBody({ type: UpdateAccountsPayableDto })
  @ApiResponse({ status: 200, description: 'A conta a pagar atualizada.', type: AccountsPayableEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAccountsPayableDto: UpdateAccountsPayableDto, @Req() req) {

    return this.accountsPayableService.update(+id, updateAccountsPayableDto, req.user?.id);
  }

  @ApiOperation({ summary: 'Excluir uma conta a pagar existente por ID' })
  @ApiParam({ name: 'id', description: 'O ID da conta a pagar para excluir.' })
  @ApiResponse({ status: 200, description: 'A conta a pagar foi excluída com sucesso.', type: AccountsPayableEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.accountsPayableService.remove(+id, req.user?.id);
  }
}
