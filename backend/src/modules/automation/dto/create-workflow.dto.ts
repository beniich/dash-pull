import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class NodeConfigDto {
    @IsString()
    @IsNotEmpty()
    type: string; // e.g., 'trigger', 'action', 'ai-node'

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    config?: Record<string, any>;
}

export class CreateWorkflowDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NodeConfigDto)
    nodes: NodeConfigDto[];

    @IsOptional()
    @IsString()
    description?: string;
}
