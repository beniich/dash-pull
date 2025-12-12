import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NodeConfigDto } from '../../automation/dto/create-workflow.dto';

export class CreateTemplateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category?: string; // Marketing, Finance, Support, Sales, etc.

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NodeConfigDto)
    nodes: NodeConfigDto[];
}

export class TemplateResponseDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category?: string;

    nodes: NodeConfigDto[];
}
