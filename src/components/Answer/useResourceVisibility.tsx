import { useState } from 'react';

const useResourceVisibility = () => {
  const [isResourcesVisible, setIsResourcesVisible] = useState(false);

  const toggleVisibility = () => {
    setIsResourcesVisible(!isResourcesVisible);
  };

  return {
    isResourcesVisible,
    toggleVisibility,
  };
};

export default useResourceVisibility;
