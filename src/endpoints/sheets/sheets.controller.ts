
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { ApiTags, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Folhas')
@Controller('sheets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova folha' })
  @ApiBody({ type: CreateSheetDto })
  @ApiResponse({ status: 201, description: 'Folha criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  create(@Body() createSheetDto: CreateSheetDto) {
    return this.sheetsService.create(createSheetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obter uma lista de todas as folhas' })
  @ApiResponse({ status: 200, description: 'Folhas retornadas com sucesso' })
  findAll() {
    return this.sheetsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma única folha por ID' })
  @ApiParam({ name: 'id', description: 'ID da folha' })
  @ApiResponse({ status: 200, description: 'Folha retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Folha não encontrada' })
  findOne(@Param('id') id: string) {
    return this.sheetsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma folha existente por ID' })
  @ApiParam({ name: 'id', description: 'ID da folha' })
  @ApiBody({ type: UpdateSheetDto })
  @ApiResponse({ status: 200, description: 'Folha atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 404, description: 'Folha não encontrada' })
  update(@Param('id') id: string, @Body() updateSheetDto: UpdateSheetDto) {
    return this.sheetsService.update(+id, updateSheetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma folha existente por ID' })
  @ApiParam({ name: 'id', description: 'ID da folha' })
  @ApiResponse({ status: 200, description: 'Folha removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Folha não encontrada' })
  remove(@Param('id') id: string) {
    return this.sheetsService.remove(+id);
  }
}