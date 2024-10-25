import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import supersub from 'remark-supersub';
import DOMPurify from 'dompurify';
import {
  XSSAllowTags,
  XSSAllowAttributes,
} from '../../constants/sanatizeAllowables';

const SANITIZE_ANSWER = true;

const AnswerContent = ({ content }: { content: string }) => (
  <div className="content">
    {content && (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, supersub]}
        children={
          SANITIZE_ANSWER
            ? DOMPurify.sanitize(content, {
                ALLOWED_TAGS: XSSAllowTags,
                ALLOWED_ATTR: XSSAllowAttributes,
              })
            : content
        }
      />
    )}
  </div>
);

export default AnswerContent;
