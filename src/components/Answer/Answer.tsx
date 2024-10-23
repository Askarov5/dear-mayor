import React, { useEffect, useState } from 'react';
import LaunchChatAva from '../../assets/launch-chat-avatar.svg?react';
import {
  Feedback,
  IChatMessage,
  IResource,
} from '../../types/conversationTypes';
import useResourceVisibility from './useResourceVisibility';
import AnswerContent from './AnswerContent';
import AnswerResources from './AnswerResources';
import AnswerActions from './AnswerActions';
import { postMessageFeedback } from '../../api/conversations';
import { useUser } from '../../contexts/UserContext';

const Answer = ({ answer }: { answer: IChatMessage }) => {
  const { isResourcesVisible, toggleVisibility } = useResourceVisibility();
  const [feedback, setFeedback] = useState<Feedback>(
    answer.feedback as Feedback,
  );

  const { user } = useUser();

  const updateFeedback = (type: Feedback) => {
    // Update the feedback state
    setFeedback(type);
  };

  useEffect(() => {
    // Send feedback to the backend
    postMessageFeedback(
      answer.id as string,
      feedback,
      user?.containerName as string,
    );
    console.log('Feedback sent:', feedback);
  }, [feedback]);

  return (
    <div className="flex gap-4 min-w-[292px] max-w-[720px] rounded-3xl bg-transparent p-2 md:py-3 md:px-6">
      <div className="fill-black">
        <LaunchChatAva />
      </div>
      <div className="flex flex-col gap-2">
        <AnswerContent content={answer.content as string} />
        {answer.resources && (
          <AnswerResources
            resources={answer.resources as IResource[]}
            isResourcesVisible={isResourcesVisible}
            toggleVisibility={toggleVisibility}
          />
        )}
        <AnswerActions feedback={feedback} updateFeedback={updateFeedback} />
      </div>
    </div>
  );
};

export default Answer;
