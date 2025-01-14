import { Controller, Get, Param } from '@nestjs/common';
import { ChannelResponse } from './dto/channel-response.dto';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getChannels(): Promise<ChannelResponse> {
    return await this.logsService.listChannels();
  }

  @Get(':channel')
  async getChannelLogs(@Param('channel') channel: string): Promise<string[]> {
    return await this.logsService.listChannelLogs(channel);
  }
}
