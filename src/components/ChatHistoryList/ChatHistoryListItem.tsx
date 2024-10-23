import IconButton from '../IconButton/IconButton';
import IconList from '../IconList/IconList';
import { ListItemWithIcon } from '../../types/common';
import IconOptions from '../../assets/i-icon-options.svg?react';
import Delete from '../../assets/i-delete.svg?react';
import Pen from '../../assets/i-pen.svg?react';
import ShareIcon from '../../assets/i-share.svg?react';

const listItems: ListItemWithIcon[] = [
  {
    icon: <ShareIcon />,
    label: 'Share',
    action: () => {},
  },
  {
    icon: <Pen />,
    label: 'Edit Name',
    action: () => {},
  },
  {
    icon: <Delete />,
    label: 'Delete',
    action: () => {},
  },
];

const ChatHistoryItem = ({
  index,
  i,
  historyItem,
  openIndex,
  toggleDropdown,
  dropdownRef,
  setCurrentConversationById,
}: {
  index: number;
  i: number;
  historyItem: { id: string; title: string };
  openIndex: string;
  toggleDropdown: (index: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  setCurrentConversationById: (id: string) => void;
}) => {
  const itemIndex = `${index}-${i}`;

  return (
    <li
      className={`flex items-center rounded-lg py-3 px-3 group cursor-pointer hover:bg-interactive-secondary dark:hover:bg-interactive-tertiary ${openIndex === itemIndex ? 'bg-interactive-secondary dark:bg-interactive-tertiary' : ''}`}
      onClick={() => setCurrentConversationById(historyItem.id)}
    >
      <span className="font-light text-base font-default w-9/12 truncate ...">
        {historyItem.title}
      </span>
      <div className="relative" ref={dropdownRef}>
        <div
          className={`grid m-0 group-hover:block ${openIndex === itemIndex ? '' : 'hidden'}`}
        >
          <div className="px-2 h-6 flex items-center">
            <IconButton
              icon={<IconOptions />}
              onClick={() => toggleDropdown(itemIndex)}
            />
          </div>
        </div>
        {openIndex === itemIndex && (
          <div className="absolute bottom-11 right-32">
            <IconList listItems={listItems} />
          </div>
        )}
      </div>
    </li>
  );
};

export default ChatHistoryItem;
