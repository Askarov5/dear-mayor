/// <reference types="vite-plugin-svgr/client" />
import DearMayorLogo from '../../assets/dear-mayor-logo_big.svg?react';
import Answer from '../Answer/Answer';
import Question from '../Question/Question';
import { useConversationContext } from '../../contexts/ConversationContext';
//import Citations from '../Answer/Citations';

const Conversation = () => {
  const { currentConversation } = useConversationContext();
  const messages = currentConversation?.messages || [];

  return (
    <div className="h-[calc(100dvh-150px)] max-h-full w-full overflow-y-auto md:h-[calc(100dvh-175px)]">
      {messages.length === 0 && (
        <div className="flex flex-col justify-center items-center gap-2.5 w-full h-[calc(100%-20px)] md:h-[calc(100%-50px)]">
          <DearMayorLogo className="w-[300px] md:w-full fill-default-txt dark:fill-default-txt-dark" />
          <p className="font-bold text-xl">What Can I help you with?</p>
        </div>
      )}

      <div className="flex flex-col w-full pt-5 md:pt-12 px-5 lg:px-32 gap-5 md:gap-11">
        {messages.map((message, index) => {
          switch (message.role) {
            case 'user':
              return (
                <Question
                  key={index}
                  question={message}
                  messageId={message.id}
                />
              );
            case 'assistant': {
              // Check if previous of next message is 'tool' and get that message
              const prevMessage = messages[index - 1];
              const nextMessage = messages[index + 1];
              const citationMessage =
                prevMessage?.role === 'tool' ? prevMessage : nextMessage;

              return (
                <Answer
                  key={index}
                  answer={message}
                  citations={citationMessage}
                />
              );
            }
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default Conversation;
