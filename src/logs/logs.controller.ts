import { Controller, Get } from '@nestjs/common';
import { ChannelResponse } from './dto/channel-response.dto';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getChannels(): Promise<ChannelResponse> {
    const channelList = await this.logsService.listChannels();
    return channelList
  }
}
