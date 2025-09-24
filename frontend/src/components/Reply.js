import React, { useState, useEffect, useRef } from 'react';
import './Reply.css';

const Reply = ({ data, isFinished, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const lastProcessedMsgIdRef = useRef('');

  useEffect(() => {
    if (data && data.content && data.msg_id) {
      const content = data.content.content || '';
      
      // 只有当消息ID不同时才处理，避免重复处理同一消息
      if (content && !isTyping && lastProcessedMsgIdRef.current !== data.msg_id) {
        lastProcessedMsgIdRef.current = data.msg_id;
        typeText(content);
      }
    }
  }, [data, isTyping]);

  useEffect(() => {
    if (isFinished && data?.content?.is_finished) {
      setIsTyping(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [isFinished, data, onComplete]);

  const typeText = (text) => {
    setIsTyping(true);
    setDisplayText(prev => prev + text); 
    
    setIsTyping(false);
  };

  return (
    <div className={`reply-container ${isFinished ? 'finished' : ''}`}>
      <div className="reply-content">
        {displayText && (
          <div className="reply-text">
            {displayText}
            {isTyping && <span className="cursor">|</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reply;
