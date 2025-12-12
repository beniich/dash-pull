import { Injectable } from '@nestjs/common';
import { CreateWorkflowDto } from './dto/create-workflow.dto';

@Injectable()
export class AutomationService {
    // In‑memory placeholder – replace with DB later
    private readonly workflows = new Map<string, any>();

    async createWorkflow(dto: CreateWorkflowDto) {
        const id = Date.now().toString();
        const workflow = { id, ...dto };
        this.workflows.set(id, workflow);
        return workflow;
    }

    async getWorkflow(id: string) {
        return this.workflows.get(id) ?? { error: 'Workflow not found' };
    }
}
