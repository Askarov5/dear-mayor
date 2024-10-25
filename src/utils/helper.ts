import { v4 as uuid } from 'uuid';
import { IChatMessage, ICitation } from '../types/conversationTypes';
import parseJson from 'parse-json';

// returns the name of the month for the given date
export function getMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'long' });
}

export function getUniqueId(): string {
  return uuid();
}

export function addIdDateToMessages(messages: IChatMessage[]): IChatMessage[] {
  return messages.map((message) => {
    if (!message.id) {
      message.id = getUniqueId();
    }
    if (!message.date) {
      message.date = new Date().toISOString();
    }
    return message;
  });
}
export function getCitationsFromChatMessage(
  message: IChatMessage,
): ICitation[] {
  if (!message || !message.content) {
    return [];
  }
  let citations: ICitation[] = [];

  if (message.role === 'tool') {
    const citationObject = parseJson(message.content as string);
    citations = citationObject?.citations as unknown as ICitation[];
  }

  return citations;
}
