import React, { useState, useEffect } from 'react';
import './OnboardingPrompt.css';

const OnboardingPrompt = ({ targetRef }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Optionally, you can hide the prompt after a certain amount of time or action
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="onboarding-prompt" style={getPromptPosition(targetRef)}>
      <div className="prompt-arrow"></div>
      <div className="prompt-content">
        Click here
      </div>
    </div>
  );
};

const getPromptPosition = (targetRef) => {
  if (!targetRef?.current) return { top: '0px', left: '0px' };
  const rect = targetRef.current.getBoundingClientRect();
  return {
    top: `${rect.top + window.scrollY - 50}px`,  // Adjust vertical positioning
    left: `${rect.left + window.scrollX + rect.width / 2}px` // Adjust horizontal positioning
  };
};

export default OnboardingPrompt;
