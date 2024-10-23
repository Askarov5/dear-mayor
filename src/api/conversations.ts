import { IConversation } from '../types/conversationTypes';

const getAllConversations = async (containerName: string) => {
  try {
    const response = await fetch(
      `/api/history/list?containerName=${containerName}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching conversations: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

const getConversation = async (
  id: string,
  containerName: string,
): Promise<IConversation> => {
  try {
    const response = await fetch(`/api/history/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        containerName: containerName,
        conversation_id: id,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching conversation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

const postMessageFeedback = async (
  messageId: string,
  feedback: string,
  containerName: string,
) => {
  try {
    const response = await fetch(`/api//history/message_feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        containerName: containerName,
        message_id: messageId,
        message_feedback: feedback,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error posting feedback: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting feedback:', error);
    throw error;
  }
};

export { getAllConversations, getConversation, postMessageFeedback };
