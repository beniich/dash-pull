import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue, Job } from 'bull';
import type { WorkflowJob, WorkflowResult } from './workflow.processor';

@Injectable()
export class WorkflowEngineService {
    private readonly logger = new Logger(WorkflowEngineService.name);

    constructor(
        @InjectQueue('workflows') private readonly workflowQueue: Queue<WorkflowJob>,
    ) { }

    /**
     * Add a workflow to the execution queue
     */
    async executeWorkflow(job: WorkflowJob): Promise<Job<WorkflowJob>> {
        this.logger.log(`Queuing workflow: ${job.workflowName} (${job.workflowId})`);

        const queuedJob = await this.workflowQueue.add('execute', job, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: false, // Keep completed jobs for logs
            removeOnFail: false, // Keep failed jobs for debugging
        });

        return queuedJob;
    }

    /**
     * Get the status of a queued job
     */
    async getJobStatus(jobId: string): Promise<{
        id: string;
        status: string;
        progress: number;
        data: WorkflowJob;
        result?: WorkflowResult;
        failedReason?: string;
    } | null> {
        const job = await this.workflowQueue.getJob(jobId);
        if (!job) return null;

        const status = await job.getState();
        const progress = job.progress();

        return {
            id: job.id.toString(),
            status,
            progress: typeof progress === 'number' ? progress : 0,
            data: job.data,
            result: job.returnvalue as WorkflowResult | undefined,
            failedReason: job.failedReason,
        };
    }

    /**
     * Get all jobs in the queue (with pagination)
     */
    async getJobs(
        status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' = 'completed',
        start = 0,
        end = 20,
    ): Promise<Job<WorkflowJob>[]> {
        switch (status) {
            case 'waiting':
                return this.workflowQueue.getWaiting(start, end);
            case 'active':
                return this.workflowQueue.getActive(start, end);
            case 'completed':
                return this.workflowQueue.getCompleted(start, end);
            case 'failed':
                return this.workflowQueue.getFailed(start, end);
            case 'delayed':
                return this.workflowQueue.getDelayed(start, end);
            default:
                return [];
        }
    }

    /**
     * Get queue statistics
     */
    async getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
    }> {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            this.workflowQueue.getWaitingCount(),
            this.workflowQueue.getActiveCount(),
            this.workflowQueue.getCompletedCount(),
            this.workflowQueue.getFailedCount(),
            this.workflowQueue.getDelayedCount(),
        ]);

        return { waiting, active, completed, failed, delayed };
    }

    /**
     * Retry a failed job
     */
    async retryJob(jobId: string): Promise<void> {
        const job = await this.workflowQueue.getJob(jobId);
        if (job) {
            await job.retry();
            this.logger.log(`Retrying job: ${jobId}`);
        }
    }

    /**
     * Remove a job from the queue
     */
    async removeJob(jobId: string): Promise<void> {
        const job = await this.workflowQueue.getJob(jobId);
        if (job) {
            await job.remove();
            this.logger.log(`Removed job: ${jobId}`);
        }
    }

    /**
     * Clean old jobs
     */
    async cleanOldJobs(grace: number = 24 * 60 * 60 * 1000): Promise<void> {
        await this.workflowQueue.clean(grace, 'completed');
        await this.workflowQueue.clean(grace, 'failed');
        this.logger.log(`Cleaned jobs older than ${grace}ms`);
    }
}
