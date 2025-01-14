import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class LogsRepository {
  private readonly log_directory = './logs';

  async listLogsDirectory(): Promise<string[]> {
    try {
      return await fs.readdir(this.log_directory);
    } catch (error) {
      console.error('Error reading directory:', error);
      return [];
    }
  }
}
