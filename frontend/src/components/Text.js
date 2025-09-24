import React, { useState, useEffect, useRef } from 'react';
import './Text.css';

const Text = ({ data, isFinished, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const processedMsgIdsRef = useRef(new Set());

  useEffect(() => {
    if (data && data.content && data.msg_id) {
      const content = data.content.content || '';
      
      // 检查是否已经处理过这个消息
      if (content && !isTyping && !processedMsgIdsRef.current.has(data.msg_id)) {
        processedMsgIdsRef.current.add(data.msg_id);
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
    setDisplayText(prev => prev + text); // 追加文本而不是替换
    
    // 立即完成，无延迟
    setIsTyping(false);
  };

  return (
    <div className={`text-container ${isFinished ? 'finished' : ''}`}>
      <div className="text-header">
        <div className="text-title">文本输出</div>
      </div>
      <div className="text-content">
        <div className="text-output">
          {displayText}
          {isTyping && <span className="cursor">|</span>}
        </div>
      </div>
    </div>
  );
};

export default Text;
