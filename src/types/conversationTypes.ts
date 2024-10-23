export type TMessageType = 'question' | 'answer';

export interface IQuestion {
  content: string;
  attachments: File[];
}

export interface IResource {
  title: string;
  link: string;
}

export interface IAnswer {
  content: string;
  resources: IResource[];
  options: {
    like: boolean;
    dislike: boolean;
    refresh: boolean;
  };
}

export interface IInteraction {
  type: TMessageType;
  content: IQuestion | IAnswer;
}

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
  resources?: IResource[];
}

export interface IConversation {
  conversation_id: string;
  messages: IChatMessage[];
}

export interface IConversationRequest {
  messages: IChatMessage[];
  containerName?: string;
  indexName?: string;
}