import {
  IConversation,
  IConversationRequest,
} from '../types/conversationTypes';
import { getFullUrl } from '../utils/api';

const token = import.meta.env.VITE_AUTH_TOKEN;

// get all conversations
const getAllConversations = async (containerName: string) => {
  try {
    const response = await fetch(getFullUrl(`/history/list?containerName=${containerName}`),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
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

// get conversation by id
const getConversation = async (
  id: string,
  containerName: string,
): Promise<IConversation> => {
  try {
    const response = await fetch(getFullUrl(`/history/read`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
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

// generate messages from model
export const historyGenerate = async (
  options: IConversationRequest,
  abortSignal: AbortSignal,
  convId?: string,
): Promise<Response> => {
  let body;
  if (convId) {
    body = JSON.stringify({
      conversation_id: convId,
      messages: options.messages,
      containerName: options.containerName,
      indexName: options.indexName,
    });
  } else {
    body = JSON.stringify(options);
  }
  const response = await fetch(getFullUrl(`/history/generate`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    },
    body: body,
    signal: abortSignal,
  })
    .then((res) => {
      return res;
    })
    .catch((_err) => {
      console.error('There was an issue fetching your data.');
      console.error(_err);
      return new Response();
    });
  return response;
};

// update messages on database
export const historyUpdate = async (conversation: IConversation): Promise<Response> => {
  const response = await fetch(getFullUrl(`/history/update`), {
    method: 'POST',
    body: JSON.stringify(conversation),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin':'*'
    },
  })
    .then(async (res) => {
      console.log('sucessfully updated database');
      return res;
    })
    .catch((_err) => {
      console.error('There was an issue fetching your data.');
      console.error(_err);
      const errRes: Response = {
        ...new Response(),
        ok: false,
        status: 500,
      };
      return errRes;
    });
  return response;
};

const updateMessageFeedback = async (
  messageId: string,
  feedback: string,
  containerName: string,
) => {
  try {
    const response = await fetch(getFullUrl(`/history/message_feedback`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        containerName: containerName,
        message_id: messageId,
        message_feedback: feedback,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error posting feedback: ${response.statusText} \n ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting feedback:', error);
    throw error;
  }
};

export { getAllConversations, getConversation, updateMessageFeedback as postMessageFeedback };
