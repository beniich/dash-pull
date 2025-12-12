import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiNodeService } from './ai-node.service';
import { AiNodeDto, AiNodeResponseDto } from '../../dto/ai-node.dto';

@ApiTags('automation')
@Controller('automation/ai')
export class AiNodeController {
    constructor(private readonly aiNodeService: AiNodeService) { }

    @Post('execute')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Exécuter une fonction IA',
        description: 'Exécute une fonction IA (sentiment, résumé, email, normalisation, classification, tâches)',
    })
    @ApiResponse({
        status: 200,
        description: 'Résultat de l\'exécution IA',
        type: AiNodeResponseDto,
    })
    async execute(@Body() dto: AiNodeDto): Promise<AiNodeResponseDto> {
        return this.aiNodeService.execute(dto);
    }

    @Post('sentiment')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Analyser le sentiment d\'un texte' })
    async analyzeSentiment(@Body('text') text: string): Promise<AiNodeResponseDto> {
        return this.aiNodeService.analyzeSentiment(text);
    }

    @Post('summarize')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Résumer un texte' })
    async summarize(@Body('text') text: string): Promise<AiNodeResponseDto> {
        return this.aiNodeService.summarize(text);
    }

    @Post('generate-email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Générer un email à partir d\'un contexte' })
    async generateEmail(@Body('context') context: string): Promise<AiNodeResponseDto> {
        return this.aiNodeService.generateEmail(context);
    }

    @Post('normalize')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Normaliser des données (téléphone, email, adresse)' })
    async normalizeData(@Body('text') text: string): Promise<AiNodeResponseDto> {
        return this.aiNodeService.normalizeData(text);
    }

    @Post('classify')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Classifier un texte (urgent/high/normal/low)' })
    async classify(@Body('text') text: string): Promise<AiNodeResponseDto> {
        return this.aiNodeService.classify(text);
    }

    @Post('generate-tasks')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Générer des tâches à partir d\'un texte' })
    async generateTasks(@Body('text') text: string): Promise<AiNodeResponseDto> {
        return this.aiNodeService.generateTasks(text);
    }
}
