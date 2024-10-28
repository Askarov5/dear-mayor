import React from 'react';
import ThumbsDown from '../../assets/i-thumbs-down.svg?react';
import ThumbUp from '../../assets/i-thumbs-up.svg?react';
// import Refresh from '../../assets/i-refresh.svg?react';
import IconButton from '../IconButton/IconButton';
import { Feedback } from '../../types/conversationTypes';

interface AnswerActionsProps {
  feedback: Feedback;
  updateFeedback: (type: Feedback) => void;
}

const AnswerActions: React.FC<AnswerActionsProps> = ({
  feedback,
  updateFeedback,
}) => {
  const handleFeedback = (type: Feedback) => {
    updateFeedback(type);
  };

  return (
    <div className="flex gap-3">
      <IconButton
        icon={<ThumbUp />}
        tooltip={{ content: 'Like', place: 'bottom' }}
        isActive={feedback == Feedback.Positive}
        onClick={() => {
          handleFeedback(Feedback.Positive);
        }}
      />
      <IconButton
        icon={<ThumbsDown />}
        tooltip={{ content: 'Dislike', place: 'bottom' }}
        isActive={feedback == Feedback.Negative}
        onClick={() => {
          handleFeedback(Feedback.Negative);
        }}
      />
      {/*<IconButton
        icon={<Refresh />}
        tooltip={{ content: 'Try again', place: 'bottom' }}
        onClick={() => {}}
      />*/}
    </div>
  );
};

export default AnswerActions;
