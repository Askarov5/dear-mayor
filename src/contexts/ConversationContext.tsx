import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  IChatResponse,
  ICitation,
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
  renameConversation: (conversationId: string, title: string, token:string) => void;
  deleteConversation: (conversationId: string, token:string) => void;

  currentConversation: IConversation | IConversationRequest | null;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<IConversation | IConversationRequest | null>
  >;
  setCurrentConversationById: (conversationId: string,token:string) => void;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  selectedResource: ICitation | null;
  setSelectedResource: React.Dispatch<React.SetStateAction<ICitation | null>>;
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
  const { user ,authToken } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ICitation | null>(
    null,
  );

  useEffect(() => {
    const fetchAllConversations = async () => {
      if(authToken) {
        try {
          const response = await getAllConversations(
            user?.containerName || 'sanfransisco',
            authToken,
          );
          setConversations(response);
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      }
      
    };

    fetchAllConversations();
  }, [user, amountOfConversations,authToken]);

  useEffect(() => {
    // Fetch the AI response and save it to the current conversation
    const getAnswer = async () => {
      if (!currentConversation) return;

      // Check if the last message is from the user
      const lastMessage =
        currentConversation.messages[currentConversation.messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        try {
          setIsLoading(true);

          if (authToken) {
            // Add the message to the backend
            const resp = await historyGenerate(
              currentConversation,
              new AbortController().signal,
              authToken
            );
            if (resp.ok) {
              const respBody: IChatResponse = await resp.json();
              // new conversation started
              if (currentConversation.messages.length === 1)
                setAmountOfConversations(amountOfConversations + 1);

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

              setIsLoading(false);

              await historyUpdate(updatedConversation, authToken);
              console.log(currentConversation);
            }
          }
        } catch (error) {
          console.error('Error generating response:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getAnswer();
  }, [currentConversation, amountOfConversations, authToken]);
  // handle adding a new question to backend
  const addMessage = async (question: IChatMessage) => {
    if (!currentConversation) {
      // Add the question to the current conversation with temp ID for quick UI update
      setCurrentConversation({
        messages: [question],
        containerName: user?.containerName,
        indexName: user?.indexName,
      });
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
    }
  };

  const setCurrentConversationById = async (conversationId: string,token:string) => {
    const conversation = await getConversation(
      conversationId,
      user?.containerName as string,
      user?.indexName as string,
      token
    );

    // backend bug  - not adding indexName to the conversation
    if (!('indexName' in conversation)) {
      conversation.indexName = user?.indexName;
    }

    // update ui state
    if (conversation) {
      setCurrentConversation(conversation);
      console.log('Current conversation:', conversation);
    }
  };

  const renameConversation = async (conversationId: string, title: string,token:string) => {
    try {
      const response = await historyRename(
        conversationId,
        title,
        user?.containerName as string,
        token
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

  const deleteConversation = async (conversationId: string,token:string) => {
    try {
      const deleteConv = conversations.find(
        (conversation) => conversation.id === conversationId,
      );

      // delete from backend
      const response = await historyDelete(
        conversationId,
        user?.containerName as string,
        token
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
       

        isLoading,
        setIsLoading,

        selectedResource,
        setSelectedResource,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export { ConversationProvider, useConversationContext };
