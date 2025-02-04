import { ApiProperty } from '@nestjs/swagger';

export class ChannelResponse {
  @ApiProperty({ 
    description: 'Channel name',
    example: '++aussies'
  })
  name: string;

  @ApiProperty({ 
    description: 'List of available log dates',
    type: [String],
    example: ['2024-01-01', '2024-01-02']
  })
  logs: string[];
}
