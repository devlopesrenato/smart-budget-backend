
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiResponseGenerate } from 'src/@types/swagger/api-response-generate';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { SheetEntity } from './entities/sheet.entity';
import { SheetsService } from './sheets.service';

@ApiTags('Folhas')
@Controller('sheets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova folha' })
  @ApiBody({ type: CreateSheetDto })
  @ApiResponse({ status: 201, description: 'Folha criada com sucesso', type: SheetEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  create(@Body() createSheetDto: CreateSheetDto, @Req() req) {
    return this.sheetsService.create(createSheetDto, req.user?.id);
  }

  @Post(':sheetId')
  @ApiOperation({ summary: 'Duplica uma nova folha' })
  @ApiResponse({ status: 201, description: 'Folha duplicada com sucesso', type: SheetEntity })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  duplicate(@Param('sheetId') sheetId: string, @Req() req) {
    return this.sheetsService.duplicate(+sheetId, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obter uma lista de todas as folhas' })
  @ApiResponse({ status: 200, description: 'Folhas retornadas com sucesso', type: [SheetEntity] })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  findAll(@Req() req) {
    return this.sheetsService.findAll(req.user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma única folha por ID' })
  @ApiParam({ name: 'id', description: 'ID da folha' })
  @ApiResponse({ status: 200, description: 'Folha retornada com sucesso', type: SheetEntity })
  @ApiResponse({ status: 404, description: 'Folha não encontrada' })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  findOne(@Param('id') id: string, @Req() req) {
    return this.sheetsService.findOne(+id, req.user?.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma folha existente por ID' })
  @ApiParam({ name: 'id', description: 'ID da folha' })
  @ApiBody({ type: UpdateSheetDto })
  @ApiResponse({ status: 200, description: 'Folha atualizada com sucesso', type: SheetEntity })
  @ApiResponse({ status: 404, description: 'Folha não encontrada' })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  update(@Param('id') id: string, @Body() updateSheetDto: UpdateSheetDto, @Req() req) {
    return this.sheetsService.update(+id, updateSheetDto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma folha existente por ID' })
  @ApiParam({ name: 'id', description: 'ID da folha' })
  @ApiResponse({ status: 200, description: 'Folha removida com sucesso', type: SheetEntity })
  @ApiResponse({ status: 404, description: 'Folha não encontrada' })
  @ApiBadRequestResponse(ApiResponseGenerate(400, ["Token not sent.", "invalid id", "Bad Request"]))
  @ApiUnauthorizedResponse(ApiResponseGenerate(401, "Unauthorized"))
  remove(@Param('id') id: string, @Req() req) {
    return this.sheetsService.remove(+id, req.user?.id);
  }
}