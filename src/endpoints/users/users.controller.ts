import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './entities/user.entity';
import { ApiResponseGenerate } from 'src/@types/swagger/api-response-generate';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário', description: 'Cria um novo usuário com as informações fornecidas.' })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso.', type: UserEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários', description: 'Retorna uma lista de todos os usuários cadastrados.' })
  @ApiOkResponse({ description: 'Lista de usuários retornada com sucesso.', type: [UserEntity] })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID', description: 'Retorna as informações do usuário com o ID fornecido.' })
  @ApiOkResponse({ description: 'Usuário encontrado com sucesso.', type: UserEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário', description: 'Atualiza as informações do usuário com o ID fornecido.' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso.', type: UserEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário', description: 'Exclui o usuário com o ID fornecido.' })
  @ApiOkResponse({ description: 'Usuário excluído com sucesso.', type: UserEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Login do usuário', description: 'Retorna os dados do usuário e um token de acesso..' })
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
  public async signin(
    @Body() signinDto: SigninDto,
  ): Promise<LoginResponse> {
    return this.usersService.signin(signinDto);
  }
}