import React from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import rehypeRaw from 'rehype-raw';
import {
  XSSAllowTags,
  XSSAllowAttributes,
} from '../../constants/sanatizeAllowables';
import { ICitation } from '../../types/conversationTypes';
import IconButton from '../IconButton/IconButton';
import CloseIcon from '../../assets/i-close.svg?react';

interface SidebarProps {
  citation: ICitation | null;
  onClose: () => void;
}

const SidebarCitation: React.FC<SidebarProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  return (
    <div className="sidebar w-1/3 bg-chat-default shadow-lg p-4 gap-4 pb-14 overflow-y-auto self-end h-full dark:bg-chat-dark dark:fill-default-txt-dark dark:text-default-txt-dark">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold font-impact">Citations</h2>
        <IconButton
          icon={<CloseIcon />}
          tooltip={{ content: 'Close citations', place: 'bottom' }}
          onClick={onClose}
        ></IconButton>
      </div>

      <div className="content text-sm text-wrap h-[calc(100%-60px)] overflow-y-auto">
        {citation.content && (
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            children={DOMPurify.sanitize(citation.content, {
              ALLOWED_TAGS: XSSAllowTags,
              ALLOWED_ATTR: XSSAllowAttributes,
            })}
          />
        )}
      </div>
    </div>
  );
};

export default SidebarCitation;
