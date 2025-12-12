import { Processor, Process, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { AiNodeService } from '../nodes/ai-node/ai-node.service';

export interface WorkflowJob {
    workflowId: string;
    workflowName: string;
    nodes: WorkflowNodeJob[];
    input: Record<string, any>;
}

export interface WorkflowNodeJob {
    id: string;
    type: string;
    config: Record<string, any>;
    nextNodeId?: string;
}

export interface WorkflowResult {
    workflowId: string;
    status: 'success' | 'failed';
    startedAt: Date;
    completedAt: Date;
    durationMs: number;
    nodeResults: NodeResult[];
    finalOutput: Record<string, any>;
    error?: string;
}

export interface NodeResult {
    nodeId: string;
    type: string;
    status: 'success' | 'failed' | 'skipped';
    input: Record<string, any>;
    output: Record<string, any>;
    executionTimeMs: number;
    error?: string;
}

@Processor('workflows')
export class WorkflowProcessor {
    private readonly logger = new Logger(WorkflowProcessor.name);

    constructor(private readonly aiNodeService: AiNodeService) { }

    @Process('execute')
    async handleExecution(job: Job<WorkflowJob>): Promise<WorkflowResult> {
        const { workflowId, workflowName, nodes, input } = job.data;
        const startedAt = new Date();
        const nodeResults: NodeResult[] = [];
        let currentData = { ...input };
        let error: string | undefined;

        this.logger.log(`Starting workflow execution: ${workflowName} (${workflowId})`);

        try {
            for (const node of nodes) {
                const nodeStartTime = Date.now();
                let nodeOutput: Record<string, any> = {};
                let nodeStatus: 'success' | 'failed' | 'skipped' = 'success';
                let nodeError: string | undefined;

                try {
                    nodeOutput = await this.executeNode(node, currentData);
                    currentData = { ...currentData, ...nodeOutput };
                } catch (err) {
                    nodeStatus = 'failed';
                    nodeError = err.message;
                    error = `Node ${node.id} failed: ${err.message}`;
                    this.logger.error(`Node ${node.id} (${node.type}) failed: ${err.message}`);
                }

                nodeResults.push({
                    nodeId: node.id,
                    type: node.type,
                    status: nodeStatus,
                    input: currentData,
                    output: nodeOutput,
                    executionTimeMs: Date.now() - nodeStartTime,
                    error: nodeError,
                });

                // Stop execution if node failed
                if (nodeStatus === 'failed') {
                    break;
                }

                // Update job progress
                await job.progress(Math.round((nodeResults.length / nodes.length) * 100));
            }
        } catch (err) {
            error = err.message;
            this.logger.error(`Workflow ${workflowId} failed: ${err.message}`);
        }

        const completedAt = new Date();

        return {
            workflowId,
            status: error ? 'failed' : 'success',
            startedAt,
            completedAt,
            durationMs: completedAt.getTime() - startedAt.getTime(),
            nodeResults,
            finalOutput: currentData,
            error,
        };
    }

    private async executeNode(
        node: WorkflowNodeJob,
        data: Record<string, any>,
    ): Promise<Record<string, any>> {
        this.logger.debug(`Executing node: ${node.id} (${node.type})`);

        switch (node.type) {
            case 'trigger':
                // Trigger nodes just pass through
                return data;

            case 'ai-node':
                const aiResult = await this.aiNodeService.execute({
                    function: node.config.function,
                    input: node.config.inputField ? data[node.config.inputField] : JSON.stringify(data),
                    model: node.config.model,
                    temperature: node.config.temperature,
                    maxTokens: node.config.maxTokens,
                    customPrompt: node.config.customPrompt,
                });
                return {
                    aiResult: aiResult.result,
                    aiStructuredData: aiResult.structuredData,
                    aiTokensUsed: aiResult.tokensUsed,
                };

            case 'condition':
                const conditionMet = this.evaluateCondition(node.config, data);
                return { conditionMet };

            case 'delay':
                const delayMs = node.config.delayMs || 1000;
                await new Promise((resolve) => setTimeout(resolve, delayMs));
                return { delayed: true, delayMs };

            case 'http':
                // HTTP request node (placeholder)
                return { httpResult: 'Not implemented yet' };

            case 'email':
                // Email node (placeholder)
                return { emailSent: false, message: 'Email node not configured' };

            case 'slack':
                // Slack node (placeholder)
                return { slackSent: false, message: 'Slack node not configured' };

            default:
                this.logger.warn(`Unknown node type: ${node.type}`);
                return data;
        }
    }

    private evaluateCondition(
        config: Record<string, any>,
        data: Record<string, any>,
    ): boolean {
        const { field, operator, value } = config;
        const fieldValue = data[field];

        switch (operator) {
            case 'equals':
                return fieldValue === value;
            case 'not_equals':
                return fieldValue !== value;
            case 'contains':
                return String(fieldValue).includes(value);
            case 'greater_than':
                return Number(fieldValue) > Number(value);
            case 'less_than':
                return Number(fieldValue) < Number(value);
            case 'is_empty':
                return !fieldValue || fieldValue === '';
            case 'is_not_empty':
                return !!fieldValue && fieldValue !== '';
            default:
                return false;
        }
    }

    @OnQueueActive()
    onActive(job: Job<WorkflowJob>) {
        this.logger.log(`Processing job ${job.id}: ${job.data.workflowName}`);
    }

    @OnQueueCompleted()
    onCompleted(job: Job<WorkflowJob>, result: WorkflowResult) {
        this.logger.log(
            `Job ${job.id} completed: ${result.status} in ${result.durationMs}ms`,
        );
    }

    @OnQueueFailed()
    onFailed(job: Job<WorkflowJob>, error: Error) {
        this.logger.error(`Job ${job.id} failed: ${error.message}`);
    }
}
