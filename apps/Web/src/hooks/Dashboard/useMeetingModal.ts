import { useState } from "react";

export const useMeetingModal = (onCloseCallback?: () => void) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);

  const closeModal = async () => {
    setIsOpen(false);
    // Small delay to ensure backend has processed the meeting
    await new Promise(resolve => setTimeout(resolve, 500));
    if (onCloseCallback) {
      await onCloseCallback();
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
  };
};