import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutomationModule } from './modules/automation/automation.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { LogsModule } from './modules/logs/logs.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';

@Module({
  imports: [AutomationModule, TemplatesModule, LogsModule, IntegrationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
