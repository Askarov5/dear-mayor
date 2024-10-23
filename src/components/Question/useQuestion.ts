import { useState } from 'react';
import { useConversationContext } from '../../contexts/ConversationContext';

const useQuestion = (initialContent: string) => {
  const { editQuestion: editMessage } = useConversationContext();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(initialContent);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get the message ID
    const messageId = parseInt(
      (e.target as HTMLInputElement).getAttribute('data-message-id') as string,
    );
    // Edit the message[s]
    editMessage(inputValue, messageId);

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(initialContent);
  };

  return {
    isEditing,
    inputValue,
    handleEdit,
    handleInputChange,
    handleFormSubmit,
    handleCancel,
  };
};

export default useQuestion;
