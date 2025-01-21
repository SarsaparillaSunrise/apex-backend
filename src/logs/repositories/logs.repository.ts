import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';

@Injectable()
export class LogsRepository {
  private readonly logDirectory: string;

  constructor(private configService: ConfigService) {
    this.logDirectory = this.getLogDirectory();
  }

  private getLogDirectory(): string {
    return (
      this.configService.get<string>('app.logDirectory') ||
      '/default/log/directory'
    );
  }

  async listLogsDirectory(): Promise<string[]> {
    try {
      return await fs.readdir(this.logDirectory);
    } catch (error) {
      console.error('Error reading log directory:', error);
      return [];
    }
  }

  async listChannelLogs(channel: string): Promise<string[]> {
    try {
      return await fs.readdir(`${this.logDirectory}${channel}`);
    } catch (error) {
      console.error('Error reading channel directory:', error);
      return [];
    }
  }

  async getLogFile(channel: string, date: string): Promise<string[]> {
    try {
      const messages = await fs.readFile(
        `${this.logDirectory}${channel}/${date}.log`,
        'utf-8',
      );
      return messages.split('\n');
    } catch (error) {
      console.error('Error reading log file:', error);
      return [];
    }
  }
}
