import { Injectable } from '@nestjs/common';
import { LogsRepository } from './repositories/logs.repository';
import { ChannelResponse } from './dto/channel-response.dto';

@Injectable()
export class LogsService {
  constructor(private logsRepository: LogsRepository) {}
  async listChannels(): Promise<ChannelResponse> {
    const channelList = await this.logsRepository.listLogsDirectory()
    const encodedChannelList = channelList.map((c) => c.replace(/##/g, '++'));
    return {
      channelList: encodedChannelList,
      favourites: ['++aussies'],
    };
  }
}
