
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { ApiTags, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Folhas')
@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) { }

  @Post()
  @ApiBody({ type: CreateSheetDto })
  @ApiResponse({ status: 201, description: 'Folha criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createSheetDto: CreateSheetDto) {
    return this.sheetsService.create(createSheetDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Folhas retornadas com sucesso' })
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.sheetsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID da folha' })
  @ApiResponse({ status: 200, description: 'Folha retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Folha não encontrada' })
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.sheetsService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID da folha' })
  @ApiBody({ type: UpdateSheetDto })
  @ApiResponse({ status: 200, description: 'Folha atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 404, description: 'Folha não encontrada' })
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateSheetDto: UpdateSheetDto) {
    return this.sheetsService.update(+id, updateSheetDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID da folha' })
  @ApiResponse({ status: 200, description: 'Folha removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Folha não encontrada' })
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.sheetsService.remove(+id);
  }
}