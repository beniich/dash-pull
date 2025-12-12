import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { AiNodeDto, AiNodeResponseDto, AiFunction } from '../../dto/ai-node.dto';

@Injectable()
export class AiNodeService {
    private readonly logger = new Logger(AiNodeService.name);
    private readonly openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
        });
    }

    private getSystemPrompt(func: AiFunction): string {
        const prompts: Record<AiFunction, string> = {
            [AiFunction.SENTIMENT_ANALYSIS]: `Tu es un expert en analyse de sentiment. Analyse le texte fourni et retourne:
- sentiment: "positive", "negative", ou "neutral"
- confidence: un score de 0 à 100
- keywords: les mots-clés qui influencent le sentiment
Réponds en JSON uniquement.`,

            [AiFunction.SUMMARIZE]: `Tu es un expert en résumé de texte. Crée un résumé concis et clair du texte fourni.
Le résumé doit capturer les points essentiels en 2-3 phrases maximum.`,

            [AiFunction.GENERATE_EMAIL]: `Tu es un expert en rédaction d'emails professionnels. Génère un email basé sur le contexte fourni.
L'email doit être professionnel, clair et concis. Inclus un objet, une salutation, le corps du message et une signature.`,

            [AiFunction.NORMALIZE_DATA]: `Tu es un expert en extraction et normalisation de données. Extrais et structure les informations du texte:
- telephone: format international (+33...)
- email: format standard
- nom: prénom et nom séparés
- adresse: composants séparés (rue, ville, code postal, pays)
Réponds en JSON uniquement.`,

            [AiFunction.CLASSIFY]: `Tu es un expert en classification. Classe le texte dans une des catégories suivantes:
- urgent: nécessite une action immédiate
- high: priorité haute
- normal: priorité standard
- low: priorité basse
Retourne: { "priority": "...", "reason": "..." } en JSON.`,

            [AiFunction.GENERATE_TASKS]: `Tu es un expert en gestion de projet. À partir du texte fourni, génère une liste de tâches actionables.
Chaque tâche doit avoir: title, description, priority (high/medium/low), estimatedHours.
Réponds en JSON avec un tableau "tasks".`,

            [AiFunction.CUSTOM]: `Tu es un assistant IA polyvalent. Réponds à la demande de l'utilisateur de manière précise et utile.`,
        };
        return prompts[func];
    }

    async execute(dto: AiNodeDto): Promise<AiNodeResponseDto> {
        const startTime = Date.now();
        const model = dto.model || 'gpt-4o-mini';
        const temperature = dto.temperature ?? 0.7;
        const maxTokens = dto.maxTokens ?? 1000;

        const systemPrompt =
            dto.function === AiFunction.CUSTOM && dto.customPrompt
                ? dto.customPrompt
                : this.getSystemPrompt(dto.function);

        try {
            const completion = await this.openai.chat.completions.create({
                model,
                temperature,
                max_tokens: maxTokens,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: dto.input },
                ],
            });

            const result = completion.choices[0]?.message?.content || '';
            const tokensUsed = completion.usage?.total_tokens || 0;

            // Try to parse structured data if JSON response
            let structuredData: Record<string, any> | undefined;
            try {
                if (result.trim().startsWith('{') || result.trim().startsWith('[')) {
                    structuredData = JSON.parse(result);
                }
            } catch {
                // Not JSON, that's fine
            }

            this.logger.log(
                `AI Node executed: ${dto.function}, model: ${model}, tokens: ${tokensUsed}`,
            );

            return {
                result,
                function: dto.function,
                model,
                tokensUsed,
                executionTimeMs: Date.now() - startTime,
                structuredData,
            };
        } catch (error) {
            this.logger.error(`AI Node error: ${error.message}`);
            throw error;
        }
    }

    // Convenience methods for direct usage
    async analyzeSentiment(text: string): Promise<AiNodeResponseDto> {
        return this.execute({ function: AiFunction.SENTIMENT_ANALYSIS, input: text });
    }

    async summarize(text: string): Promise<AiNodeResponseDto> {
        return this.execute({ function: AiFunction.SUMMARIZE, input: text });
    }

    async generateEmail(context: string): Promise<AiNodeResponseDto> {
        return this.execute({ function: AiFunction.GENERATE_EMAIL, input: context });
    }

    async normalizeData(text: string): Promise<AiNodeResponseDto> {
        return this.execute({ function: AiFunction.NORMALIZE_DATA, input: text });
    }

    async classify(text: string): Promise<AiNodeResponseDto> {
        return this.execute({ function: AiFunction.CLASSIFY, input: text });
    }

    async generateTasks(text: string): Promise<AiNodeResponseDto> {
        return this.execute({ function: AiFunction.GENERATE_TASKS, input: text });
    }
}
