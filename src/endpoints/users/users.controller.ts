import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário', description: 'Cria um novo usuário com as informações fornecidas.'})
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Requisição inválida. Verifique se os dados foram fornecidos corretamente.'})
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários', description: 'Retorna uma lista de todos os usuários cadastrados.'})
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID', description: 'Retorna as informações do usuário com o ID fornecido.'})
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Requisição inválida. Verifique se o ID fornecido é válido.'})
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário', description: 'Atualiza as informações do usuário com o ID fornecido.'})
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Requisição inválida. Verifique se o ID fornecido é válido e se os dados foram fornecidos corretamente.'})
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário', description: 'Exclui o usuário com o ID fornecido.'})
  @ApiResponse({ status: 200, description: 'Usuário excluído com sucesso.' })
  @ApiBadRequestResponse({ description: 'Requisição inválida. Verifique se o ID fornecido é válido.'})
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('signin')  
  public async signin(
    @Body() signinDto: SigninDto,
  ): Promise<{ name: string; jwtToken: string; email: string }> {
    return this.usersService.signin(signinDto);
  }
}
