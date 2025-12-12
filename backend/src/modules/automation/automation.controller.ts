import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';

@Controller('automation')
export class AutomationController {
    constructor(private readonly automationService: AutomationService) { }

    @Post('workflows')
    async createWorkflow(@Body() dto: CreateWorkflowDto) {
        return this.automationService.createWorkflow(dto);
    }

    @Get('workflows/:id')
    async getWorkflow(@Param('id') id: string) {
        return this.automationService.getWorkflow(id);
    }
}
