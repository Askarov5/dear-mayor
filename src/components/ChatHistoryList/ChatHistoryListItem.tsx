import IconButton from '../IconButton/IconButton';
import IconList from '../IconList/IconList';
import { ListItemWithIcon } from '../../types/common';
import IconOptions from '../../assets/i-icon-options.svg?react';
import Delete from '../../assets/i-delete.svg?react';
import Pen from '../../assets/i-pen.svg?react';
import ShareIcon from '../../assets/i-share.svg?react';
import ChatHistoryItemEdit from './ChatHistoryListItemEdit';
import { useConversationContext } from '../../contexts/ConversationContext';
import { useEffect, useState } from 'react';
import { ReactTyped } from 'react-typed';

const ChatHistoryItem = ({
  index,
  i,
  historyItem,
  openIndex,
  toggleDropdown,
  historyItemEditableID,
  setHistoryItemEditableID,
  dropdownRef,
}: {
  index: number;
  i: number;
  historyItem: { id: string; title: string };
  openIndex: string;
  toggleDropdown: (index: string) => void;
  historyItemEditableID: string | null;
  setHistoryItemEditableID: (id: string | null) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}) => {
  const { setCurrentConversationById, renameConversation, deleteConversation } =
    useConversationContext();
  const [newTitle, setNewTitle] = useState(historyItem.title);
  const itemIndex = `${index}-${i}`;

  const listItems: ListItemWithIcon[] = [
    {
      icon: <ShareIcon />,
      label: 'Share',
      action: () => {},
    },
    {
      icon: <Pen />,
      label: 'Edit Name',
      action: () => {
        setHistoryItemEditableID(historyItem.id);
        toggleDropdown('');
      },
    },
    {
      icon: <Delete />,
      label: 'Delete',
      action: () => {
        deleteConversation(historyItem.id);
        toggleDropdown('');
      },
    },
  ];

  useEffect(() => {
    async function renameConv() {
      try {
        if (historyItem.title !== newTitle) {
          await renameConversation(historyItem.id, newTitle);
        }
      } catch (error) {
        console.error('Error renaming conversation:', error);
      } finally {
        setHistoryItemEditableID(null);
      }
    }

    renameConv();
  }, [newTitle]);

  return (
    <li
      className={`flex items-center rounded-lg py-3 px-3 group cursor-pointer transition-all duration-300 ${historyItemEditableID !== historyItem.id ? 'hover:bg-interactive-secondary dark:hover:bg-interactive-tertiary' : ''} ${openIndex === itemIndex && historyItemEditableID !== historyItem.id ? 'bg-interactive-secondary dark:bg-interactive-tertiary' : ''}`}
      onClick={() => setCurrentConversationById(historyItem.id)}
    >
      {historyItemEditableID === historyItem.id ? (
        <ChatHistoryItemEdit
          historyItemTitle={historyItem.title}
          setNewTitle={setNewTitle}
        />
      ) : (
        <span className="font-light text-base font-default w-9/12 truncate ...">
          <ReactTyped
            strings={[historyItem.title]}
            typeSpeed={1}
            backSpeed={1050}
            loop={false}
            showCursor={false}
            onComplete={(self: { stop: () => void }) => {
              self.stop();
            }}
          />
        </span>
      )}
      <div className="relative">
        <div
          className={`grid m-0 group-hover:block  transition-all duration-300 ${openIndex === itemIndex ? '' : 'hidden'}`}
        >
          {historyItemEditableID !== historyItem.id && (
            <div className="px-2 h-6 flex items-center">
              <IconButton
                icon={<IconOptions />}
                onClick={() => toggleDropdown(itemIndex)}
              />
            </div>
          )}
        </div>
        {openIndex === itemIndex && (
          <div className="absolute bottom-11 right-32" ref={dropdownRef}>
            <IconList listItems={listItems} />
          </div>
        )}
      </div>
    </li>
  );
};

export default ChatHistoryItem;
