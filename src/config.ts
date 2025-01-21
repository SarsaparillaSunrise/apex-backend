import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  logDirectory: process.env.LOG_DIRECTORY || './logs/',
}));
