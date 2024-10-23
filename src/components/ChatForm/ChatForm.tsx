import React, { useState } from 'react';
import { useConversationContext } from '../../contexts/ConversationContext';
import { IQuestion } from '../../types/conversationTypes';
import PaperClip from '../../assets/i-paper-clip.svg?react';
import ArrowUpIcon from '../../assets/i-arrow-up.svg?react';
import { Tooltip } from 'react-tooltip';

const ChatForm: React.FC = () => {
  const { addQuestion } = useConversationContext();
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [question, setQuestion] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (question === '') return;

    // Add new message
    const newQuestion: IQuestion = {
      content: question,
      attachments: selectedFile ? [selectedFile] : [],
    };
    addQuestion(newQuestion);
    // Reset form
    setQuestion('');
    setIsInputEmpty(true);
  };

  return (
    <div className="flex flex-col gap-1 pb-2 w-[90%] md:w-[80%] md:max-w-[720px] justify-self-center">
      <form
        className="flex font-default bg-chat-dark dark:bg-chat-dark-inverse rounded-full items-center justify-between justify-self-center p-1 pl-2 gap-3 min-w-full"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="file-upload"
          className="fill-chat-default"
          data-tooltip-id="file-upload_tt"
          data-tooltip-content="Attach file"
          data-tooltip-offset={15}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <PaperClip />
          <Tooltip id="file-upload_tt" place="top" className="bg-chat-dark" />
        </label>

        <input
          type="text"
          placeholder="Message Dear Mayor"
          className="w-full bg-inherit p-1 font-default font-light outline-none placeholder:text-secondary-inverse-txt text-chat-default"
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            setIsInputEmpty(e.target.value === '');
          }}
        />

        <button
          type="submit"
          disabled={isInputEmpty}
          className="p-2 rounded-full bg-secondary-txt enabled:bg-interactive-enabled enabled:fill-chat-dark disabled:fill-interactive-disabled disabled:bg-secondary-txt"
        >
          <ArrowUpIcon />
        </button>
      </form>
      <p className="text-center text-sm text-secondary-txt">
        Dear Mayor can make mistakes. Check important info.
      </p>
    </div>
  );
};

export default ChatForm;
