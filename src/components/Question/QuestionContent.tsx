import IconButton from '../IconButton/IconButton';
import IPen from '../../assets/i-pen.svg?react';

const QuestionContent = ({
  content,
  onEdit,
}: {
  content: string;
  onEdit: () => void;
}) => (
  <div className="flex justify-end items-center gap-4 group-hover:flex group">
    <div className="hidden group-hover:flex">
      <IconButton
        icon={<IPen className="w-6 h-6" />}
        tooltip={{ content: 'Edit message' }}
        onClick={onEdit}
      />
    </div>
    <div className="md:min-w-[292px] md:max-w-[720px] rounded-3xl bg-default-bg-secondary dark:bg-chat-dark-inverse py-3 px-6">
      {content}
    </div>
  </div>
);

export default QuestionContent;
