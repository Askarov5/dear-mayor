import { useEffect, useState } from 'react';
import LaunchChatAva from '../../assets/launch-chat-avatar.svg?react';
import {
  Feedback,
  IChatMessage,
  ICitation,
} from '../../types/conversationTypes';
import useResourceVisibility from './useResourceVisibility';
import AnswerContent from './AnswerContent';
//import AnswerResources from './AnswerResources';
import AnswerActions from './AnswerActions';
import { postMessageFeedback } from '../../api/conversations';
import { useUser } from '../../contexts/UserContext';
import { parseAnswer } from './AnswerParser';
import { getCitationsFromChatMessage } from '../../utils/helper';
// import Citations from './Citations';
import AnswerResources from './AnswerResources';

const Answer = ({
  answer,
  citations,
}: {
  answer: IChatMessage;
  citations: IChatMessage;
}) => {
  const { isResourcesVisible, toggleVisibility } = useResourceVisibility();
  const [feedback, setFeedback] = useState<Feedback>(
    answer.feedback as Feedback,
  );
  const [isAnswerTypingComplete, setIsAnswerTypingComplete] = useState(false);

  const { user } = useUser();

  const updateFeedback = (type: Feedback) => {
    // Update the feedback state
    setFeedback(type);
  };

  useEffect(() => {
    // Send feedback to the backend
    const sendFeedback = async () => {
      if (feedback) {
        await postMessageFeedback(
          answer.id as string,
          feedback,
          user?.containerName as string,
        );
      }
    };

    sendFeedback();
  }, [feedback]);

  // Parse the answer
  let parsedAnswer;
  try {
    const askResp = {
      answer: answer.content as string,
      citations: getCitationsFromChatMessage(citations),
      generated_chart: null,
    };
    parsedAnswer = parseAnswer(askResp);
  } catch (error) {
    console.error('Error parsing answer:', error);
  }

  return (
    <div className="flex gap-4 min-w-[292px] max-w-[720px] rounded-3xl bg-transparent p-2 md:py-3 md:px-6">
      <div className="fill-black">
        <LaunchChatAva />
      </div>
      <div className="flex flex-col gap-2">
        <AnswerContent
          content={parsedAnswer?.markdownFormatText as string}
          isAnswerTypingComplete={isAnswerTypingComplete}
          setIsAnswerTypingComplete={() => setIsAnswerTypingComplete(true)}
        />

        {parsedAnswer?.citations && parsedAnswer.citations.length > 0 && (
          <AnswerResources
            resources={parsedAnswer?.citations as ICitation[]}
            isResourcesVisible={isResourcesVisible}
            toggleVisibility={toggleVisibility}
            isAnswerTypingComplete={isAnswerTypingComplete}
          />
        )}

        {/* <Citations  citationsList={parsedAnswer?.citations as ICitation[]}/> */}
        <AnswerActions feedback={feedback} updateFeedback={updateFeedback} />
      </div>
    </div>
  );
};

export default Answer;
