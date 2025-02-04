# IRC Log Reader API

A NestJS-based API for reading and serving IRC log files.

## Description

This service provides REST endpoints to:
- List available IRC channels
- View logs for specific channels and dates
- Access message history with support for various IRC message types

## Setup

```bash
# Install dependencies
pnpm install

# Configure
Set LOG_DIRECTORY in your environment or .env file

# Development
pnpm run start:dev

# Production
pnpm run start:prod
```

## API Endpoints

- `GET /logs` - List all available channels
- `GET /logs/:channel` - Get available log files
- `GET /logs/:channel/:date` - Get log file for date
