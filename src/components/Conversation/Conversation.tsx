/// <reference types="vite-plugin-svgr/client" />
import DearMayorLogo from '../../assets/dear-mayor-logo_big.svg?react';
import LaunchChatAva from '../../assets/launch-chat-avatar.svg?react';
import Answer from '../Answer/Answer';
import Question from '../Question/Question';
import { useConversationContext } from '../../contexts/ConversationContext';
import { ReactTyped } from 'react-typed';
import { useEffect } from 'react';
import SidebarCitation from '../Answer/SidebarCitation';
import ChatForm from '../ChatForm/ChatForm';
//import Citations from '../Answer/Citations';

const Conversation = () => {
  const { currentConversation, isLoading, setIsLoading } =
    useConversationContext();
  const messages = currentConversation?.messages || [];
  const { selectedResource, setSelectedResource } = useConversationContext();

  const placeholderSentences = [
    'What Can I help you with?',
    'How can I assist you today?',
    'What questions do you have for me?',
    'Need help with something specific?',
    'What would you like to know?',
    'How can I make your day better?',
    'What information are you looking for?',
    'Is there anything you need assistance with?',
    'What can I do for you today?',
    'Feel free to ask me anything!',
    'How can I help you achieve your goals?',
  ];

  useEffect(() => {
    // Check if the last message is from the user and there is no answer yet
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }
  }, [messages]);

  // sidebar
  const handleCloseResourceSidebar = () => {
    setSelectedResource(null);
  };

  return (
    <div
      className={`flex h-[calc(100dvh-80px)] max-h-full w-full justify-center`}
    >
      <div className="flex flex-col pt-5 md:pt-12 px-5 w-full">
        <div className="flex flex-col w-full h-full self-center overflow-y-auto lg:px-32">
          {messages.length === 0 && (
            <div className="flex flex-col justify-center items-center gap-2.5 w-full h-[calc(100%-20px)] md:h-[calc(100%-50px)]">
              <DearMayorLogo className="w-[300px] md:w-full fill-default-txt dark:fill-default-txt-dark" />
              <p className="font-bold text-xl">
                {
                  <ReactTyped
                    strings={placeholderSentences}
                    typeSpeed={40}
                    backSpeed={80}
                    backDelay={2000}
                    loop
                  />
                }
              </p>
            </div>
          )}

          <div className="flex flex-col w-full gap-5 md:gap-11 md:max-w-[720px] lg:max-w-[1024px] self-center">
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

            {isLoading && (
              <div className="flex gap-4 min-w-[292px] max-w-[720px] rounded-3xl bg-transparent p-2 md:py-3 md:px-6">
                <div className="fill-black">
                  <LaunchChatAva />
                </div>
                <div className="flex flex-col gap-2">
                  <ReactTyped
                    strings={['Generating answer...']}
                    typeSpeed={40}
                    backSpeed={80}
                    backDelay={2000}
                    loop
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <ChatForm />
      </div>

      {selectedResource && (
        <SidebarCitation
          citation={selectedResource}
          onClose={handleCloseResourceSidebar}
        />
      )}
    </div>
  );
};

export default Conversation;
