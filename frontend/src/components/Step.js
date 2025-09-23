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
    setDisplayText(prev => prev + text); // 追加文本而不是替换
    
    // 模拟回复延迟
    setTimeout(() => {
      setIsTyping(false);
    }, 120);
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
