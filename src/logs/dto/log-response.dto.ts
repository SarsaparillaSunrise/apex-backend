import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Message, MessageMessage, JoinMessage, QuitMessage, NickMessage, ActionMessage } from './messages.dto';

export class LogResponse {
  @ApiProperty({ 
    description: 'Channel name',
    example: '++aussies'
  })
  channel: string;

  @ApiProperty({ 
    description: 'Log date',
    example: '2024-01-01'
  })
  date: string;

  @ApiProperty({ 
    description: 'Array of messages',
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(MessageMessage) },
      { $ref: getSchemaPath(JoinMessage) },
      { $ref: getSchemaPath(QuitMessage) },
      { $ref: getSchemaPath(NickMessage) },
      { $ref: getSchemaPath(ActionMessage) }
    ]
  })
  messages: Message[];
}
