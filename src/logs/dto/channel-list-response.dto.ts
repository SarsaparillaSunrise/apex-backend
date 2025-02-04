import { ApiProperty } from '@nestjs/swagger';

export class ChannelListResponse {
  @ApiProperty({ 
    description: 'List of available channels',
    type: [String],
    example: ['++aussies', '++javascript', '++python']
  })
  channels: string[];

  @ApiProperty({ 
    description: 'List of favorite channels',
    type: [String],
    example: ['++aussies']
  })
  favourites: string[];
}
