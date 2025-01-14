import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { LogsRepository } from './repositories/logs.repository';

// Create a mock class that implements the same interface as LogsRepository
class LogsRepositoryMock {
  listLogsDirectory = jest.fn();
  listChannelLogs = jest.fn();
  getLogFile = jest.fn();
}

describe('LogsService', () => {
  let service: LogsService;
  let repository: LogsRepositoryMock;

  beforeEach(async () => {
    repository = new LogsRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: LogsRepository,
          useValue: repository,
        },
      ],
    }).compile();
    service = module.get<LogsService>(LogsService);
  });

  describe('Channel Listing', () => {
    test('returns encoded channel names when listing multiple channels', async () => {
      repository.listLogsDirectory.mockResolvedValue(['##channel1', '##test']);
      const result = await service.listChannels();

      expect(result.channelList).toHaveLength(2);
      expect(result.channelList).toEqual(['++channel1', '++test']);
    });

    test('includes default favorites in channel listing', async () => {
      repository.listLogsDirectory.mockResolvedValue(['##channel1']);
      const result = await service.listChannels();

      expect(result.favourites).toEqual(['++aussies']);
    });

    test('returns empty list with defaults when no channels exist', async () => {
      repository.listLogsDirectory.mockResolvedValue([]);
      const result = await service.listChannels();

      expect(result.channelList).toEqual([]);
      expect(result.favourites).toEqual(['++aussies']);
    });
  });

  describe('Channel Logs', () => {
    test('returns log files for channel with existing logs', async () => {
      const expectedLogs = ['2023-01-01.log', '2023-01-02.log'];
      repository.listChannelLogs.mockResolvedValue(expectedLogs);

      const result = await service.listChannelLogs('++channel');

      expect(result).toEqual(expectedLogs);
    });

    test('returns empty array for channel without logs', async () => {
      repository.listChannelLogs.mockResolvedValue([]);

      const result = await service.listChannelLogs('++channel');

      expect(result).toEqual([]);
    });
  });

  describe('Log Message Parsing', () => {
    describe('Chat Messages', () => {
      test('extracts time user and content from chat messages', async () => {
        repository.getLogFile.mockResolvedValue([
          '[12:34:56] <user1> Hello world',
        ]);

        const result = await service.getLog('++channel', '2023-01-01');

        expect(result).toEqual([
          {
            time: '12:34:56',
            user: 'user1',
            message: 'Hello world',
            type: 'message',
          },
        ]);
      });
    });

    describe('Join Events', () => {
      test('extracts user and details from join events', async () => {
        repository.getLogFile.mockResolvedValue([
          '[12:34:56] *** Joins: user1 (user@host.com)',
        ]);

        const result = await service.getLog('++channel', '2023-01-01');

        expect(result).toEqual([
          {
            time: '12:34:56',
            user: 'user1',
            details: 'user@host.com',
            type: 'join',
          },
        ]);
      });
    });

    describe('Quit Events', () => {
      test('includes reason when parsing quit event with reason', async () => {
        repository.getLogFile.mockResolvedValue([
          '[12:34:56] *** Quits: user1 (user@host.com) (Quit: Leaving)',
        ]);

        const result = await service.getLog('++channel', '2023-01-01');

        expect(result).toEqual([
          {
            time: '12:34:56',
            user: 'user1',
            details: 'user@host.com',
            reason: 'Quit: Leaving',
            type: 'quit',
          },
        ]);
      });

      test('omits reason when parsing quit event without reason', async () => {
        repository.getLogFile.mockResolvedValue([
          '[12:34:56] *** Quits: user1 (user@host.com)',
        ]);

        const result = await service.getLog('++channel', '2023-01-01');

        expect(result).toEqual([
          {
            time: '12:34:56',
            user: 'user1',
            details: 'user@host.com',
            type: 'quit',
          },
        ]);
      });
    });

    describe('Nickname Changes', () => {
      test('extracts old and new names from nickname changes', async () => {
        repository.getLogFile.mockResolvedValue([
          '[12:34:56] *** oldNick is now known as newNick',
        ]);

        const result = await service.getLog('++channel', '2023-01-01');

        expect(result).toEqual([
          {
            time: '12:34:56',
            oldNick: 'oldNick',
            newNick: 'newNick',
            type: 'nick',
          },
        ]);
      });
    });

    test('handles multiple message types correctly', async () => {
      repository.getLogFile.mockResolvedValue([
        '[12:34:56] <user1> Hello world',
        '[12:35:00] *** Joins: user2 (user@host.com)',
        '[12:36:00] *** user2 is now known as user2_new',
      ]);

      const result = await service.getLog('++channel', '2023-01-01');

      expect(result).toEqual([
        {
          time: '12:34:56',
          user: 'user1',
          message: 'Hello world',
          type: 'message',
        },
        {
          time: '12:35:00',
          user: 'user2',
          details: 'user@host.com',
          type: 'join',
        },
        {
          time: '12:36:00',
          oldNick: 'user2',
          newNick: 'user2_new',
          type: 'nick',
        },
      ]);
    });

    describe('Error Handling', () => {
      test('returns null when parsing unknown message format', async () => {
        repository.getLogFile.mockResolvedValue([
          '[12:34:56] *** Unknown format message',
        ]);

        const result = await service.getLog('++channel', '2023-01-01');

        expect(result).toEqual([null]);
      });
    });
  });
});
