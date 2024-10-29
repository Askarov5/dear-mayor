import CaretDown from '../../assets/i-caret-down.svg?react';
import Link from '../../assets/i-link.svg?react';
import { useConversationContext } from '../../contexts/ConversationContext';
import { ICitation } from '../../types/conversationTypes';

const AnswerResources = ({
  resources,
  isResourcesVisible,
  toggleVisibility,
  isAnswerTypingComplete,
}: {
  resources: ICitation[];
  isResourcesVisible: boolean;
  toggleVisibility: () => void;
  isAnswerTypingComplete: boolean;
}) => {
  const { setSelectedResource } = useConversationContext();
  const isLessResources = resources.length <= 5;
  if (isLessResources) isResourcesVisible = true;

  const handleResourceClick = (resource: ICitation) => {
    setSelectedResource(resource);
  };

  return (
    <div
      className={`resources flex flex-col gap-2.5 transition-opacity duration-1000 ${isAnswerTypingComplete ? 'opacity-100 h-auto overflow-auto' : 'opacity-0 h-0 overflow-hidden'}`}
    >
      <div>
        {isLessResources ? (
          <p className="py-2 px-3 font-bold">
            {resources.length} resources found
          </p>
        ) : (
          <button
            className="flex gap-1 bg-interactive-secondary dark:bg-chat-dark-inverse dark:fill-default-txt-dark py-2 px-3 rounded-lg"
            onClick={toggleVisibility}
          >
            <span>{resources.length} resources found</span>
            <CaretDown />
          </button>
        )}
      </div>

      <ul
        className={`${isResourcesVisible ? 'h-auto overflow-auto' : 'h-0 overflow-hidden'} flex flex-col gap-0.5 justify-start transition-all`}
      >
        {resources.map((resource, index) => (
          <li key={index}>
            <button
              rel="noreferrer"
              className="group flex gap-2 p-1 items-center text-start hover:text-interactive-primary hover:fill-interactive-primary dark:fill-default-txt-dark"
              onClick={() => handleResourceClick(resource)}
            >
              <Link className="group-hover:fill-interactive-primary min-w-4" />
              <span className="group-hover:text-interactive-primary">
                {resource.reindex_id} - {resource.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnswerResources;
