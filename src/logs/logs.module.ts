import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { LogsRepository } from './repositories/logs.repository'

@Module({
  providers: [LogsService, LogsRepository],
  controllers: [LogsController],
})
export class LogsModule {}
