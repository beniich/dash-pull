import { IsString, IsOptional, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AiFunction {
    SENTIMENT_ANALYSIS = 'sentiment_analysis',
    SUMMARIZE = 'summarize',
    GENERATE_EMAIL = 'generate_email',
    NORMALIZE_DATA = 'normalize_data',
    CLASSIFY = 'classify',
    GENERATE_TASKS = 'generate_tasks',
    CUSTOM = 'custom',
}

export class AiNodeDto {
    @ApiProperty({
        description: 'Type de fonction IA à exécuter',
        enum: AiFunction,
        example: AiFunction.SENTIMENT_ANALYSIS,
    })
    @IsEnum(AiFunction)
    function: AiFunction;

    @ApiProperty({
        description: 'Texte d\'entrée à analyser',
        example: 'Le client est très satisfait de notre service.',
    })
    @IsString()
    input: string;

    @ApiPropertyOptional({
        description: 'Prompt personnalisé (pour fonction CUSTOM)',
        example: 'Extrais les informations clés de ce texte.',
    })
    @IsOptional()
    @IsString()
    customPrompt?: string;

    @ApiPropertyOptional({
        description: 'Modèle OpenAI à utiliser',
        default: 'gpt-4o-mini',
        example: 'gpt-4o',
    })
    @IsOptional()
    @IsString()
    model?: string;

    @ApiPropertyOptional({
        description: 'Température (créativité) de 0 à 2',
        default: 0.7,
        example: 0.7,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(2)
    temperature?: number;

    @ApiPropertyOptional({
        description: 'Nombre maximum de tokens en sortie',
        default: 1000,
        example: 500,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(4096)
    maxTokens?: number;
}

export class AiNodeResponseDto {
    @ApiProperty({ description: 'Résultat de l\'analyse IA' })
    result: string;

    @ApiProperty({ description: 'Fonction IA utilisée' })
    function: AiFunction;

    @ApiProperty({ description: 'Modèle utilisé' })
    model: string;

    @ApiProperty({ description: 'Tokens utilisés' })
    tokensUsed: number;

    @ApiProperty({ description: 'Durée d\'exécution en ms' })
    executionTimeMs: number;

    @ApiPropertyOptional({ description: 'Données structurées (si applicable)' })
    structuredData?: Record<string, any>;
}
