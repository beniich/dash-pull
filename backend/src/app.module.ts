import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutomationModule } from './modules/automation/automation.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { LogsModule } from './modules/logs/logs.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AutomationModule,
    TemplatesModule,
    LogsModule,
    IntegrationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
