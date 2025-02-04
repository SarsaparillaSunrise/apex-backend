import { ApiProperty } from '@nestjs/swagger';

class BaseUserMessage {
  @ApiProperty({ description: 'Timestamp of the message' })
  time: string;

  @ApiProperty({ description: 'Username' })
  user: string;
}

export class MessageMessage extends BaseUserMessage {
  @ApiProperty({ description: 'Message content' })
  message: string;

  @ApiProperty({ enum: ['message'] })
  type: 'message';
}

export class JoinMessage extends BaseUserMessage {
  @ApiProperty({ description: 'Join details' })
  details: string;

  @ApiProperty({ enum: ['join'] })
  type: 'join';
}

export class QuitMessage extends BaseUserMessage {
  @ApiProperty({ description: 'Quit details' })
  details: string;

  @ApiProperty({ description: 'Quit reason', required: false })
  reason?: string;

  @ApiProperty({ enum: ['quit'] })
  type: 'quit';
}

export class NickMessage {
  @ApiProperty({ description: 'Timestamp of the nick change' })
  time: string;

  @ApiProperty({ description: 'Previous nickname' })
  oldNick: string;

  @ApiProperty({ description: 'New nickname' })
  newNick: string;

  @ApiProperty({ enum: ['nick'] })
  type: 'nick';
}

export class ActionMessage {
  @ApiProperty({ description: 'Timestamp of the action' })
  time: string;

  @ApiProperty({ description: 'Username' })
  user: string;

  @ApiProperty({ description: 'Action description' })
  action: string;

  @ApiProperty({ enum: ['action'] })
  type: 'action';
}

export type Message = MessageMessage | JoinMessage | QuitMessage | NickMessage | ActionMessage | null;
