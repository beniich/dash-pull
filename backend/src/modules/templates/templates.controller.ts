import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateResponseDto } from './dto/create-template.dto';

@Controller('templates')
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) { }

    @Post()
    async create(@Body() dto: CreateTemplateDto): Promise<TemplateResponseDto> {
        return this.templatesService.create(dto);
    }

    @Get()
    async findAll(): Promise<TemplateResponseDto[]> {
        return this.templatesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<TemplateResponseDto> {
        return this.templatesService.findOne(id);
    }
}
