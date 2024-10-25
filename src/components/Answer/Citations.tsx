import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import supersub from 'remark-supersub';
import DOMPurify from 'dompurify';
import {
  XSSAllowTags,
  XSSAllowAttributes,
} from '../../constants/sanatizeAllowables';
import { ICitation } from '../../types/conversationTypes';
import { useState } from 'react';

const SANITIZE_ANSWER = true;

const Citations = ({ citationsList }: { citationsList: ICitation[] }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    citationsList &&
    citationsList.length > 0 && (
      <div className="citations flex flex-col gap-4 bg-chat-default">
        {citationsList.map((citation, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex flex-col gap-1 px-2 py-1 bg-slate-100 rounded-lg">
                <h3>
                  <button
                    className="font-bold hover:text-interactive-primary text-start w-full "
                    onClick={() => toggleAccordion(index)}
                  >
                    {citation.reindex_id}: {citation.title}
                    <div className="font-light text-xs">
                      Source: {citation.filepath}
                    </div>
                  </button>
                </h3>
              </div>
              {isExpanded && (
                <div className="content text-sm px-2">
                  {citation.content && (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, supersub]}
                      children={
                        SANITIZE_ANSWER
                          ? DOMPurify.sanitize(citation.content, {
                              ALLOWED_TAGS: XSSAllowTags,
                              ALLOWED_ATTR: XSSAllowAttributes,
                            })
                          : citation.content
                      }
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )
  );
};

export default Citations;
