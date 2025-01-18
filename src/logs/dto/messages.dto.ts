type BaseUserMessage = {
  time: string;
  user: string;
};

type MessageMessage = BaseUserMessage & {
  message: string;
  type: 'message';
};

type JoinMessage = BaseUserMessage & {
  details: string;
  type: 'join';
};

type QuitMessage = BaseUserMessage & {
  details: string;
  reason?: string;
  type: 'quit';
};

type NickMessage = {
  time: string;
  oldNick: string;
  newNick: string;
  type: 'nick';
};

type ActionMessage = {
  time: string;
  user: string;
  action: string;
  type: 'action';
}

export type Message = MessageMessage | JoinMessage | QuitMessage | NickMessage | ActionMessage | null;
