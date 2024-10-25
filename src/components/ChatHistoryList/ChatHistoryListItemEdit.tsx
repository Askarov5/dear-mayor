import { useEffect, useRef, useState } from 'react';

const ChatHistoryItemEdit = ({
  historyItemTitle,
  setNewTitle,
  setHistoryItemEditableID,
}: {
  historyItemTitle: string;
  setNewTitle: (title: string) => void;
  setHistoryItemEditableID: (id: string | null) => void;
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

  const handleBlur = () => {
    if (inputRef.current) {
      setNewTitle(inputValue);
      setHistoryItemEditableID(null);
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      setNewTitle(inputValue);
      setHistoryItemEditableID(null);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      className="w-full font-light text-base font-default outline-transparent py-2 border-b-2 border-b-interactive-primary dark:bg-interactive-tertiary dark:border-b-interactive-enabled dark:outline-none"
      onChange={handleInputChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

export default ChatHistoryItemEdit;
