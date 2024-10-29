import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import supersub from 'remark-supersub';
import DOMPurify from 'dompurify';
import { ReactTyped } from 'react-typed';
import {
  XSSAllowTags,
  XSSAllowAttributes,
} from '../../constants/sanatizeAllowables';
import style from './markdown-styles.module.css';

const SANITIZE_ANSWER = true;

const AnswerContent = ({
  content,
  isAnswerTypingComplete,
  setIsAnswerTypingComplete,
}: {
  content: string;
  isAnswerTypingComplete: boolean;
  setIsAnswerTypingComplete: (isComplete: boolean) => void;
}) => {
  const sanitizedContent = SANITIZE_ANSWER
    ? DOMPurify.sanitize(content, {
        ALLOWED_TAGS: XSSAllowTags,
        ALLOWED_ATTR: XSSAllowAttributes,
      })
    : content;

  return (
    <div className="content">
      {!isAnswerTypingComplete ? (
        <ReactTyped
          strings={[sanitizedContent]}
          typeSpeed={1}
          backSpeed={1050}
          loop={false}
          showCursor={false}
          onComplete={() => setIsAnswerTypingComplete(true)}
        />
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, supersub]}
          className={style.markdown}
          children={sanitizedContent}
        />
      )}
    </div>
  );
};

export default AnswerContent;
