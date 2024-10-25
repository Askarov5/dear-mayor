import { ReactNode } from 'react';
import { ICitation } from './conversationTypes';

export type TToolTip = {
  content: string;
  place?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
};

export type ListItemWithIcon = {
  icon: ReactNode;
  label: string;
  action: () => void;
};

export interface IParsedAnswer {
  citations: ICitation[];
  markdownFormatText: string;
  generated_chart: string | null;
}
