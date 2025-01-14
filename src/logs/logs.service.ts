import { Injectable } from '@nestjs/common';
import { LogsRepository } from './repositories/logs.repository';
import { ChannelResponse } from './dto/channel-response.dto';
import { Message } from './dto/messages.dto';

@Injectable()
export class LogsService {
  constructor(private logsRepository: LogsRepository) {}

  public async listChannels(): Promise<ChannelResponse> {
    const channelList = await this.logsRepository.listLogsDirectory();
    const encodedChannelList = channelList.map((c) => c.replace(/##/g, '++'));
    return {
      channelList: encodedChannelList,
      favourites: ['++aussies'],
    };
  }

  public async listChannelLogs(channel: string): Promise<string[]> {
    return await this.logsRepository.listChannelLogs(
      channel.replace(/\+\+/g, '##'),
    );
  }

  public async getLog(channel: string, date: string): Promise<Message[]> {
    const messages = await this.logsRepository.getLogFile(
      channel.replace(/\+\+/g, '##'),
      date,
    );
    return Promise.all(messages.map((message) => this.parseMessage(message)));
  }

  private async parseMessage(message: string): Promise<Message> {
    // Messages
    const chatMatch = message.match(
      /^\[(?<time>\d\d:\d\d:\d\d)\] <(?<user>@?[\S]*)> (?<message>.*$)/,
    );
    if (chatMatch?.groups) {
      const { time, user, message } = chatMatch.groups;
      return { time, user, message, type: 'message' as const };
    }

    // Joins
    const joinMatch = message.match(
      /^\[(?<time>\d\d:\d\d:\d\d)\] \*\*\* Joins: (?<user>\S+) \((?<details>[^)]+)\)/,
    );
    if (joinMatch?.groups) {
      const { time, user, details } = joinMatch.groups;
      return { time, user, details, type: 'join' as const };
    }

    // Parts
    const quitMatch = message.match(
      /^\[(?<time>\d\d:\d\d:\d\d)\] \*\*\* Quits: (?<user>\S+) \((?<details>[^)]+)\)(?: \((?<reason>[^)]+)\))?/,
    );
    if (quitMatch?.groups) {
      const { time, user, details, reason } = quitMatch.groups;
      return { time, user, details, reason, type: 'quit' as const };
    }

    // Nick changes
    const nickMatch = message.match(
      /^\[(?<time>\d\d:\d\d:\d\d)\] \*\*\* (?<oldNick>\S+) is now known as (?<newNick>\S+)/,
    );
    if (nickMatch?.groups) {
      const { time, oldNick, newNick } = nickMatch.groups;
      return { time, oldNick, newNick, type: 'nick' as const };
    }

    // Unmatched messages
    return null;
  }
}
