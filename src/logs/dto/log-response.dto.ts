import {Message} from "./messages.dto";

export type LogResponse = {
  channel: string;
  date: string;
  messages: Message[];
}
