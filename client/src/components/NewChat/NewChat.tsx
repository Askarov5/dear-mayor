import { useConversationContext } from '../../contexts/ConversationContext';
import Button from '../Button/Button';
import CommentIcon from '../../assets/i-comment.svg?react';

const NewChat = () => {
  const { setCurrentConversation } = useConversationContext();

  const startNewChat = () => {
    setCurrentConversation(null);
  };

  return (
    <Button text="New Chat" type="primary" size="medium" onClick={startNewChat}>
      <CommentIcon />
    </Button>
  );
};

export default NewChat;
