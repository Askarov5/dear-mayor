/// <reference types="vite-plugin-svgr/client" />
import DearMayorLogo from '../../assets/dear-mayor-logo_big.svg?react';
import Answer from '../Answer/Answer';
import Question from '../Question/Question';
import { useConversationContext } from '../../contexts/ConversationContext';

const Conversation = () => {
  const { currentConversation } = useConversationContext();
  const messages = currentConversation?.messages || [];

  return (
    <div className="h-[calc(100dvh-150px)] max-h-full w-full overflow-y-auto md:h-[calc(100dvh-175px)]">
      {messages.length === 0 && (
        <div className="flex flex-col justify-center items-center gap-2.5 w-full h-[calc(100%-20px)] md:h-[calc(100%-50px)]">
          <DearMayorLogo className="fill-default-txt dark:fill-default-txt-dark" />
          <p className="font-bold text-xl">
            This chat bot lorem ipsum introduction text.
          </p>
        </div>
      )}

      <div className="flex flex-col w-full pt-5 md:pt-12 px-5 lg:px-32 gap-5 md:gap-11">
        {messages.map((message, index) => {
          return message.role === 'user' ? (
            <Question key={index} question={message} messageId={message.id} />
          ) : (
            <Answer key={index} answer={message} />
          );
        })}
      </div>
    </div>
  );
};

export default Conversation;
