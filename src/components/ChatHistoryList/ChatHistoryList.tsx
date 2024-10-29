import { useEffect, useMemo, useRef, useState } from 'react';
import formatChatHistory from '../../utils/formatChatHistory';
import { useConversationContext } from '../../contexts/ConversationContext';
import ChatHistoryItem from './ChatHistoryListItem';

const ChatHistoryList = () => {
  // handle dropdown
  const [openIndex, setOpenIndex] = useState('');
  const [historyItemEditableID, setHistoryItemEditableID] = useState<
    string | null
  >(null);

  const toggleDropdown = (index: string) => {
    setOpenIndex(openIndex === index ? '' : index);
  };

  // handle click outside - close dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenIndex('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // reformat data for chat history
  const { conversations } = useConversationContext();
  const chatHistory = useMemo(
    () => formatChatHistory(conversations),
    [conversations],
  );

  return (
    <ul className="pt-2 h-[calc(100vh-150px)] overflow-y-auto overflow-x-hidden">
      {chatHistory.map((item, index) => (
        <li key={index}>
          <span className="text-sm font-bold font-impact">{item.month}</span>
          <ul className="py-4 w-[260px]">
            {item.history.map((historyItem, i) => (
              <ChatHistoryItem
                key={i}
                index={index}
                i={i}
                historyItem={historyItem}
                openIndex={openIndex}
                toggleDropdown={toggleDropdown}
                historyItemEditableID={historyItemEditableID}
                setHistoryItemEditableID={setHistoryItemEditableID}
                dropdownRef={dropdownRef}
              />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default ChatHistoryList;
