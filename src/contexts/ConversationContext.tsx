import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  IConversation,
  IInteraction,
  IQuestion,
} from '../types/conversationTypes';
import { getAllConversations, getConversation } from '../api/conversations';
import { IChatHistory } from '../types/conversationTypes';
import { useUser } from './UserContext';

type ConversationContextType = {
  messages: IInteraction[];
  setMessages: React.Dispatch<React.SetStateAction<IInteraction[]>>;
  addQuestion: (question: IQuestion) => void;
  editQuestion: (updatedContent: string, index: number) => void;

  conversations: IChatHistory[];
  setConversations: React.Dispatch<React.SetStateAction<IChatHistory[]>>;

  currentConversation: IConversation | null;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<IConversation | null>
  >;
  setCurrentConversationById: (conversationId: string) => void;
};

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined,
);

const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      'useConversationContext must be used within a ConversationProvider',
    );
  }
  return context;
};

interface ConversationProviderProps {
  children: React.ReactNode;
}

const ConversationProvider: React.FC<ConversationProviderProps> = ({
  children,
}) => {
  const initialMessages: IInteraction[] = [
    {
      type: 'question',
      content: {
        content: "I'm typing a question?",
        attachments: [],
      },
    },
    {
      type: 'answer',
      content: {
        content:
          "There was that time artists at Sequence opted to hand-Sharpie the lorem ipsum passage on a line of paper bags they designed for Chipotle—the result being a mixture of avant-garde, inside joke, and Sharpie-stained tables. Those with an eye for detail may have caught a tribute to the classic text in an episode of Mad Men (S6E1 around 1:18:55 for anyone that didn’t). And here is a lorem ipsum tattoo.Of course, we'd be remiss not to include the veritable cadre of lorem ipsum knock offs featuring:",
        resources: [
          {
            title: 'Resource title 1',
            link: 'https://www.google.com',
          },
          {
            title: 'Resource title 2',
            link: 'https://www.google.com',
          },
          {
            title: 'Resource title 1',
            link: 'https://www.google.com',
          },
          {
            title: 'Resource title 2',
            link: 'https://www.google.com',
          },
        ],
        options: {
          like: false,
          dislike: false,
          refresh: false,
        },
      },
    },
  ];

  const [messages, setMessages] = useState<IInteraction[]>(initialMessages);
  const [conversations, setConversations] = useState<IChatHistory[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<IConversation | null>(null);
  const { user } = useUser();

  useEffect(() => {
    console.log('Messages updated:', messages);

    const fetchAllConversations = async () => {
      try {
        const response = await getAllConversations(
          user?.containerName || 'sanfransisco',
        );
        setConversations(response);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchAllConversations();
  }, [user]);

  const addQuestion = (question: IQuestion) => {
    const newMessage: IInteraction = {
      type: 'question',
      content: question,
    };

    setMessages([...messages, newMessage]);
  };

  const editQuestion = (updatedContent: string, index: number) => {
    const existingMessage = messages[index];

    if (index >= 0 && updatedContent.trim() !== '') {
      // Update the content
      existingMessage.content.content = updatedContent;

      // Remove all after the question and add the updated question
      const updatedMessages = [...messages.slice(0, index), existingMessage];
      setMessages(updatedMessages);
    }
  };

  const setCurrentConversationById = async (conversationId: string) => {
    const conversation = await getConversation(
      conversationId,
      user?.containerName as string,
    );
    if (conversation) {
      setCurrentConversation(conversation);
      console.log('Current conversation:', conversation);
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        messages,
        addQuestion: addQuestion,
        editQuestion: editQuestion,
        setMessages,
        conversations,
        setConversations,
        currentConversation,
        setCurrentConversation,
        setCurrentConversationById,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export { ConversationProvider, useConversationContext };
