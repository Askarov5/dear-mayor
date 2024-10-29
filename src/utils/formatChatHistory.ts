import { IChatHistory } from '../types/conversationTypes';
import { getMonthName } from './helper';

type TChatHistoryItem = {
  id: string;
  title: string;
};

type FormattedChatHistory = {
  month: string;
  history: TChatHistoryItem[];
}[];

const formatChatHistory = (
  conversations: IChatHistory[],
): FormattedChatHistory => {
  conversations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const historyMap = conversations.reduce((map, conversation) => {
    const month = getMonthName(new Date(conversation.createdAt));
    if (!map.has(month)) {
      map.set(month, []);
    }
    map.get(month)?.push({
      id: conversation.id,
      title: conversation.title,
    });
    return map;
  }, new Map<string, TChatHistoryItem[]>());

  return Array.from(historyMap, ([month, history]) => ({
    month,
    history,
  }));
};

export default formatChatHistory;
