import { useEffect, useRef, useState } from 'react';

const ChatHistoryItemEdit = ({
  historyItemTitle,
  setNewTitle,
}: {
  historyItemTitle: string;
  setNewTitle: (title: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(historyItemTitle);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      setInputValue(target.value);
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      setNewTitle(inputValue);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      className="w-full font-light text-base font-default outline-transparent py-2 border-b-2 border-b-interactive-primary dark:bg-interactive-tertiary dark:border-b-interactive-enabled dark:outline-none"
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default ChatHistoryItemEdit;
