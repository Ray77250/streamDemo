import React, { useState, useEffect, useRef } from 'react';
import './Step.css';

const Step = ({ data, isFinished, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const processedContentRef = useRef('');

  useEffect(() => {
    if (data && data.content) {
      const text = data.content.content || '';
      if (text && text !== processedContentRef.current && !isTyping) {
        processedContentRef.current = text;
        typeText(text);
      }
    }
  }, [data, isTyping]);

  useEffect(() => {
    if (isFinished && data?.content?.is_finished) {
      if (onComplete) {
        onComplete();
      }
    }
  }, [isFinished, data, onComplete]);

  const typeText = (text) => {
    setIsTyping(true);
    setDisplayText('');
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 50); 
  };

  return (
    <div className={`step-container ${isFinished ? 'finished' : ''}`}>
      <div className="step-header">
        <div className="step-title">步骤</div>
      </div>
      <div className="step-content">
        <div className="step-text">
          {displayText}
          {isTyping && <span className="cursor">|</span>}
        </div>
      </div>
    </div>
  );
};

export default Step;
