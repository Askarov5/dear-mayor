import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  IChatResponse,
  IConversation,
  IConversationRequest,
} from '../types/conversationTypes';
import {
  getAllConversations,
  getConversation,
  historyDelete,
  historyGenerate,
  historyRename,
  historyUpdate,
} from '../api/conversations';
import { IChatHistory, IChatMessage } from '../types/conversationTypes';
import { useUser } from './UserContext';
import { addIdDateToMessages } from '../utils/helper';

type ConversationContextType = {
  addMessage: (question: IChatMessage) => void;
  editMessage: (updatedContent: string, messageId: string) => void;

  conversations: IChatHistory[];
  setConversations: React.Dispatch<React.SetStateAction<IChatHistory[]>>;
  renameConversation: (conversationId: string, title: string) => void;
  deleteConversation: (conversationId: string) => void;

  currentConversation: IConversation | IConversationRequest | null;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<IConversation | IConversationRequest | null>
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
  const [conversations, setConversations] = useState<IChatHistory[]>([]);
  const [currentConversation, setCurrentConversation] = useState<
    IConversation | IConversationRequest | null
  >(null);
  const [amountOfConversations, setAmountOfConversations] = useState<number>(0);
  const { user } = useUser();

  useEffect(() => {
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
  }, [user, amountOfConversations]);

  useEffect(() => {
    // Fetch the AI response and save it to the current conversation
    const getAnswer = async () => {
      if (!currentConversation) return;

      // Check if the last message is from the user
      const lastMessage =
        currentConversation.messages[currentConversation.messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        // Add the message to the backend
        const resp = await historyGenerate(
          currentConversation,
          new AbortController().signal,
        );

        if (resp.ok) {
          const respBody: IChatResponse = await resp.json();

          const updatedAiMessages = addIdDateToMessages(
            respBody.choices[0].messages,
          );
          const updatedMessages = [
            ...currentConversation.messages,
            ...updatedAiMessages,
          ];
          const updatedConversation = {
            ...currentConversation,
            conversation_id: respBody.history_metadata.conversation_id,
            messages: updatedMessages,
          };
          setCurrentConversation(updatedConversation);

          await historyUpdate(updatedConversation);
          console.log(currentConversation);
        }
      }
    };

    getAnswer();
  }, [currentConversation]);

  // handle adding a new question to backend
  const addMessage = async (question: IChatMessage) => {
    if (!currentConversation) {
      // Add the question to the current conversation with temp ID for quick UI update
      setCurrentConversation({
        messages: [question],
        containerName: user?.containerName,
        indexName: user?.containerName,
      });
      // new conversation started
      setAmountOfConversations(amountOfConversations + 1);
    } else {
      // Add the question to the current conversation
      const existingMessages = currentConversation?.messages || [];
      const messages = [...existingMessages, question];

      if (currentConversation) {
        setCurrentConversation({ ...currentConversation, messages });
      }
    }
  };

  const editMessage = (updatedContent: string, messageId: string) => {
    const existingMessageIndex = currentConversation?.messages.findIndex(
      (m) => m.id == messageId,
    );
    const existingMessage =
      currentConversation?.messages[existingMessageIndex as number];

    if (updatedContent.trim() !== '' && existingMessage) {
      // Update the content
      existingMessage.content = updatedContent;

      // Remove all after the question and add the updated question
      const messages = [
        ...currentConversation.messages.slice(0, existingMessageIndex),
        existingMessage,
      ];
      if (currentConversation) {
        setCurrentConversation({ ...currentConversation, messages });
      }

      // Update the message in the backend
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

  const renameConversation = async (conversationId: string, title: string) => {
    try {
      const response = await historyRename(
        conversationId,
        title,
        user?.containerName as string,
      );
      if (response.ok) {
        console.log('Successfully renamed conversation:', conversationId);

        // update ui state
        const conv = conversations.find(
          (conversation) => conversation.id === conversationId,
        );
        if (conv) {
          conv.title = title;
          setConversations([...conversations]);
        }
      }
    } catch (error) {
      console.error('Error renaming conversation:', error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const deleteConv = conversations.find(
        (conversation) => conversation.id === conversationId,
      );

      // delete from backend
      const response = await historyDelete(
        conversationId,
        user?.containerName as string,
      );
      if (response.ok) {
        console.log('Successfully deleted conversation:', conversationId);

        // update ui state
        const index = conversations.indexOf(deleteConv as IChatHistory);
        if (index > -1) {
          conversations.splice(index, 1);
          setConversations([...conversations]);
        }

        // update current conversation if it is the one being deleted
        if (
          currentConversation &&
          'conversation_id' in currentConversation &&
          currentConversation.conversation_id === conversationId
        ) {
          setCurrentConversation(null);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        addMessage,
        editMessage,
        conversations,
        setConversations,
        renameConversation,
        deleteConversation,
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
