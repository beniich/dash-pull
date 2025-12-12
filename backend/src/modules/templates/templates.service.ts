import { Injectable } from '@nestjs/common';
import { CreateTemplateDto, TemplateResponseDto } from './dto/create-template.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TemplatesService {
    private readonly templates = new Map<string, TemplateResponseDto>();

    async create(dto: CreateTemplateDto): Promise<TemplateResponseDto> {
        const id = uuidv4();
        const template: TemplateResponseDto = {
            id,
            name: dto.name,
            description: dto.description,
            category: dto.category,
            nodes: dto.nodes,
        };
        this.templates.set(id, template);
        return template;
    }

    async findAll(): Promise<TemplateResponseDto[]> {
        return Array.from(this.templates.values());
    }

    async findOne(id: string): Promise<TemplateResponseDto | null> {
        const tmpl = this.templates.get(id);
        if (!tmpl) {
            return null;
        }
        return tmpl;
    }
}
