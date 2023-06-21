import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiResponseGenerate } from 'src/@types/swagger/api-response-generate';
import { CreateUserDto } from './dto/create-user.dto';
import { RecoverPasswordDto } from './dto/recover.dto';
import { ResendValidationEmailDto } from './dto/resend-email-validation.dto';
import { SigninDto } from './dto/signin.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyDataDto } from './dto/verify-data-dto.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID', description: 'Retorna as informações do usuário com o ID fornecido.' })
  @ApiOkResponse({ description: 'Usuário encontrado com sucesso.', type: UserEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @ApiUnauthorizedResponse(ApiResponseGenerate(409, "this email already exists: example@example.com"))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Req() req) {
    return this.usersService.findOne(+id, req.user?.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário', description: 'Atualiza as informações do usuário com o ID fornecido.' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso.', type: UserEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.update(+id, updateUserDto, req.user?.id);
  }

  @Patch('')
  @ApiOperation({ summary: 'Atualizar senha do usuário', description: 'Atualiza a senha do usuário.' })
  @ApiOkResponse({ description: 'Senha atualizado com sucesso.', type: UserEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  updatePassword(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto, @Req() req) {
    return this.usersService.updatePassword(updatePasswordDto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário', description: 'Exclui o usuário com o ID fornecido.' })
  @ApiOkResponse({ description: 'Usuário excluído com sucesso.', type: UserEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() req) {
    return this.usersService.remove(+id, req.user?.id);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Criar novo usuário', description: 'Cria um novo usuário com as informações fornecidas.' })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso.', type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Login do usuário', description: 'Retorna os dados do usuário e um token de acesso.' })
  @ApiResponse({
    status: 200, description: 'Login efetuado com sucesso.',
    schema: {
      example: {
        name: 'Admin',
        email: 'admin@admin.com',
        jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4Mzc3NDQ1MywiZXhwIjoxNjgzNzc0NTEzfQ.TDvpfyTfrP2FgnpfEjVgMLAcqjC1pt1Xp9JZPWbyhWY'
      },
    },
  })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["E-mail inválido!", "Senha inválida!"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Invalid Credentials"))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "email not validated. validate the email before logging in"))
  public async signin(
    @Body() signinDto: SigninDto,
  ): Promise<LoginResponse> {
    return this.usersService.signin(signinDto);
  }

  @Post('signup/confirm-email')
  @ApiOperation({ summary: 'Confirmação de email', description: 'Confirma o email do usuário.' })
  @ApiResponse({
    status: 200, description: 'Email confirmado com sucesso.',
    schema: {
      example: {
        statusCode: 200,
        message: 'email confirmed successfully',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  public emailConfirmation(@Req() req) {
    return this.usersService.emailConfirmation(req.user?.id)
  }

  @Post('recover')
  @ApiOperation({ summary: 'Recuperação de senha', description: 'Envia um email para redefinição de senha do usuário.' })
  @ApiResponse({
    status: 200, description: 'Email de recuperação enviado.',
    schema: {
      example: {
        statusCode: 200,
        message: 'sent password recovery',
      },
    },
  })
  public async recoverPassword(
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ) {
    return this.usersService.recoverPassword(recoverPasswordDto)
  }

  @Post('validate-data')
  @ApiOperation({ summary: 'Validação dos dados do usuário', description: 'Verificar se o os dados do usuário pertencem ao token enviado' })
  @ApiResponse({
    status: 200, description: 'Dados validados com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'successfully validated data',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  public validateData(@Body() verifyDataDto: VerifyDataDto, @Req() req) {
    return this.usersService.verifyData(verifyDataDto, req.user?.id);
  }

  @Post('resend-validation-email')
  @ApiOperation({ summary: 'Reenviar email de validação', description: 'Reenvia o email de validação da conta.' })
  @ApiResponse({
    status: 200, description: 'Email enviado com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'email successfully sent',
      },
    },
  })
  public resendValidationEmail(@Body() resendValidationEmailDto: ResendValidationEmailDto) {
    return this.usersService.resendValidationEmail(resendValidationEmailDto.email)
  }
}