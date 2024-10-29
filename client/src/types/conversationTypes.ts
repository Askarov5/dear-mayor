export interface IChatHistory {
  createdAt: string;
  id: string;
  title: string;
  type: string;
  updatedAt: string;
  user_id: string;
  _attachments: string;
  _etag: string;
  _rid: string;
  _self: string;
  _ts: number;
}

export enum Feedback {
  Neutral = 'neutral',
  Positive = 'positive',
  Negative = 'negative',
  MissingCitation = 'missing_citation',
  WrongCitation = 'wrong_citation',
  OutOfScope = 'out_of_scope',
  InaccurateOrIrrelevant = 'inaccurate_or_irrelevant',
  OtherUnhelpful = 'other_unhelpful',
  HateSpeech = 'hate_speech',
  Violent = 'violent',
  Sexual = 'sexual',
  Manipulative = 'manipulative',
  OtherHarmful = 'other_harmlful',
}

export interface IChatMessage {
  id: string;
  role: string;
  content:
    | string
    | [
        { type: string; text: string },
        { type: string; image_url: { url: string } },
      ];
  end_turn?: boolean;
  date: string;
  feedback?: Feedback;
  context?: string;
}

export interface IConversation {
  conversation_id: string;
  messages: IChatMessage[];
  containerName?: string;
  indexName?: string;
}

export interface IConversationRequest {
  messages: IChatMessage[];
  containerName?: string;
  indexName?: string;
}

export enum ChatCompletionType {
  ChatCompletion = 'chat.completion',
  ChatCompletionChunk = 'chat.completion.chunk',
}

export interface IChatResponseChoice {
  messages: IChatMessage[];
}

export interface IChatResponse {
  id: string;
  model: string;
  created: number;
  object: ChatCompletionType;
  choices: IChatResponseChoice[];
  history_metadata: {
    conversation_id: string;
    title: string;
    date: string;
  };
  error?: unknown;
}

export type ExecResults = {
  intent: string;
  search_query: string | null;
  search_result: string | null;
  code_generated: string | null;
};

export interface IAskResponse {
  answer: string | [];
  citations: ICitation[];
  generated_chart: string | null;
  error?: string;
  message_id?: string;
  feedback?: Feedback;
  exec_results?: ExecResults[];
}

export interface ICitation {
  part_index?: number;
  content: string;
  id: string;
  title: string | null;
  filepath: string | null;
  url: string | null;
  metadata: string | null;
  chunk_id: string | null;
  reindex_id: string | null;
}
