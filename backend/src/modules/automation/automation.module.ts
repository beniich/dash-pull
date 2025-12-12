import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { AiNodeService } from './nodes/ai-node/ai-node.service';
import { AiNodeController } from './nodes/ai-node/ai-node.controller';
import { WorkflowProcessor } from './engine/workflow.processor';
import { WorkflowEngineService } from './engine/workflow-engine.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'workflows',
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
        }),
    ],
    controllers: [AutomationController, AiNodeController],
    providers: [
        AutomationService,
        AiNodeService,
        WorkflowProcessor,
        WorkflowEngineService,
    ],
    exports: [AutomationService, AiNodeService, WorkflowEngineService],
})
export class AutomationModule { }
