import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class LogsRepository {
  private readonly log_directory = './logs/';

  async listLogsDirectory(): Promise<string[]> {
    try {
      return await fs.readdir(this.log_directory);
    } catch (error) {
      console.error('Error reading log directory:', error);
      return [];
    }
  }

  async listChannelLogs(channel: string): Promise<string[]> {
    try {
      return await fs.readdir(`${this.log_directory}${channel}`);
    } catch (error) {
      console.error('Error reading channel directory:', error);
      return [];
    }
  }

  async getLogFile(channel: string, date: string): Promise<string[]> {
    try {
      const messages = await fs.readFile(`${this.log_directory}${channel}/${date}.log`, 'utf-8');
      return messages.split('\n')
    } catch (error) {
      console.error('Error reading log file:', error);
      return [];
    }
  }
}
