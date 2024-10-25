import CaretDown from '../../assets/i-caret-down.svg?react';
import Link from '../../assets/i-link.svg?react';
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
  const isLessResources = resources.length <= 5;
  if (isLessResources) isResourcesVisible = true;

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
            <a
              href={resource.url as string}
              target="_blank"
              rel="noreferrer"
              className="group flex gap-2 p-1 items-center hover:text-interactive-primary hover:fill-interactive-primary dark:fill-default-txt-dark"
            >
              <Link className="group-hover:fill-interactive-primary min-w-4" />
              <span className="group-hover:text-interactive-primary">
                {resource.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnswerResources;
