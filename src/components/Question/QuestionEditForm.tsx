import React from 'react';
import Button from '../Button/Button';

const QuestionEditForm = ({
  inputValue,
  messageId,
  onInputChange,
  onSubmit,
  onCancel,
}: {
  inputValue: string;
  messageId: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) => (
  <div className="min-w-full rounded-3xl bg-default-bg-secondary dark:bg-chat-dark-inverse py-3 px-6">
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
      data-message-id={messageId}
    >
      <input
        type="text"
        value={inputValue}
        onChange={onInputChange}
        className="p-2 rounded-md bg-transparent outline-none"
      />
      <div className="flex justify-end items-center gap-3">
        <Button
          type="secondary"
          onClick={onCancel}
          text="Cancel"
          purpose="reset"
          size="small"
        />
        <Button type="primary" text="Send" purpose="submit" size="small" />
      </div>
    </form>
  </div>
);

export default QuestionEditForm;
