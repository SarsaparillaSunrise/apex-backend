import { Injectable } from '@nestjs/common';
import { LogsRepository } from './repositories/logs.repository';
import { ChannelListResponse } from './dto/channel-list-response.dto';
import { Message } from './dto/messages.dto';

@Injectable()
export class LogsService {
  constructor(private logsRepository: LogsRepository) {}

  public async listChannels(): Promise<ChannelListResponse> {
    const channelList = await this.logsRepository.listLogsDirectory();
    const encodedChannelList = channelList.map((c) => this.encodeChannelName(c));
    return {
      channels: encodedChannelList,
      favourites: ['++aussies'],
    };
  }

  public async listChannelLogs(channel: string): Promise<string[]> {
    return await this.logsRepository.listChannelLogs(
      this.decodeChannelName(channel)
    );
  }

  public async getLog(channel: string, date: string): Promise<Message[]> {
    const messages = await this.logsRepository.getLogFile(
      this.decodeChannelName(channel),
      `${date}.log`,
    );
    return (
      await Promise.all(messages.map((message) => this.parseMessage(message)))
    ).filter(Boolean); // filter nulls
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

    // Actions
    const actionMatch = message.match(
      /^\[(?<time>\d\d:\d\d:\d\d)\] \* (?<user>\S+) (?<action>.+)$/,
    );
    if (actionMatch?.groups) {
      const { time, user, action } = actionMatch.groups;
      return { time, user, action, type: 'action' as const };
    }

    // Unmatched messages
    return null;
  }

  private encodeChannelName = (channel: string): string => {
    const hashCount = (channel.match(/^#+/) || [''])[0].length
    return '+'.repeat(hashCount) + channel.slice(hashCount)
  }

  private decodeChannelName = (channel: string): string => {
    const hashCount = (channel.match(/^\++/) || [''])[0].length
    return '#'.repeat(hashCount) + channel.slice(hashCount)
  }
}
