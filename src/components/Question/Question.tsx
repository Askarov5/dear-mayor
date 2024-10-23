import useQuestion from './useQuestion';
import QuestionContent from './QuestionContent';
import QuestionEditForm from './QuestionEditForm';
import { IChatMessage } from '../../types/conversationTypes';

const Question = ({
  question,
  messageId,
}: {
  question: IChatMessage;
  messageId: string;
}) => {
  const {
    isEditing,
    inputValue,
    handleEdit,
    handleInputChange,
    handleFormSubmit,
    handleCancel,
  } = useQuestion(question.content as string);

  return (
    <div className="flex justify-end items-center gap-4 group-hover:flex group p-2 md:py-3 md:px-6">
      {isEditing ? (
        <QuestionEditForm
          inputValue={inputValue}
          messageId={messageId}
          onInputChange={handleInputChange}
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Form submitted');
            handleFormSubmit(e);
          }}
          onCancel={handleCancel}
        />
      ) : (
        <QuestionContent
          content={question.content as string}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default Question;
