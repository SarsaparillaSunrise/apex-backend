import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelResponse } from './dto/channel-response.dto';
import { ChannelListResponse } from './dto/channel-list-response.dto';
import { LogResponse } from './dto/log-response.dto';
import { LogsService } from './logs.service';

@ApiTags('logs')
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @ApiOperation({ summary: 'Get list of all channels' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of available channels and favorites',
    type: ChannelListResponse 
  })
  @Get()
  async getChannels(): Promise<ChannelListResponse> {
    return await this.logsService.listChannels();
  }

  @ApiOperation({ summary: 'Get logs for a specific channel' })
  @ApiParam({ name: 'channel', description: 'Channel name' })
  @ApiResponse({ 
    status: 200, 
    description: 'Channel logs listing',
    type: ChannelResponse 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Channel not found' 
  })
  @Get(':channel')
  async getChannelLogs(@Param('channel') channel: string): Promise<ChannelResponse> {
    const logs = await this.logsService.listChannelLogs(channel);
    if (!logs || logs.length === 0) {
      throw new NotFoundException(`Channel ${channel} not found`);
    }
    return {name: channel, logs};
  }

  @ApiOperation({ summary: 'Get specific log for a channel and date' })
  @ApiParam({ name: 'channel', description: 'Channel name' })
  @ApiParam({ name: 'date', description: 'Log date' })
  @ApiResponse({ 
    status: 200, 
    description: 'Log entries for the specified channel and date',
    type: LogResponse 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Channel or log not found' 
  })
  @Get(':channel/:date')
  async getLog(@Param('channel') channel: string, @Param('date') date: string): Promise<LogResponse> {
    const messages = await this.logsService.getLog(channel, date);
    if (!messages || messages.length === 0) {
      throw new NotFoundException(`Log not found for channel ${channel} on date ${date}`);
    }
    return {channel, date, messages};
  }
}
