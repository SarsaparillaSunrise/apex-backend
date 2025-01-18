import { Controller, Get, Param } from '@nestjs/common';
import { ChannelResponse } from './dto/channel-response.dto';
import { ChannelListResponse } from './dto/channel-list-response.dto';
import { LogResponse } from './dto/log-response.dto';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getChannels(): Promise<ChannelListResponse> {
    return await this.logsService.listChannels();
  }

  @Get(':channel')
  async getChannelLogs(@Param('channel') channel: string): Promise<ChannelResponse> {
    return {name: channel, logs: await this.logsService.listChannelLogs(channel)};
  }

  @Get(':channel/:date')
  async getLog(@Param('channel') channel: string, @Param('date') date: string): Promise<LogResponse> {
    return {channel: channel, date: date, messages: await this.logsService.getLog(channel, date)};
  }
}
