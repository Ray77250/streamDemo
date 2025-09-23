import React, { useState, useEffect } from 'react';
import './Text.css';

const Text = ({ data, isFinished, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [processedMsgIds, setProcessedMsgIds] = useState(new Set());

  useEffect(() => {
    if (data && data.content && data.msg_id) {
      const content = data.content.content || '';
      
      // 检查是否已经处理过这个消息
      if (content && !isTyping && !processedMsgIds.has(data.msg_id)) {
        setProcessedMsgIds(prev => new Set([...prev, data.msg_id]));
        typeText(content);
      }
    }
  }, [data, isTyping, processedMsgIds]);

  useEffect(() => {
    if (isFinished && data?.content?.is_finished) {
      setShowComplete(true);
      setIsTyping(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [isFinished, data, onComplete]);

  const typeText = (text) => {
    setIsTyping(true);
    setDisplayText(prev => prev + text); // 追加文本而不是替换
    
    // 模拟打字延迟
    setTimeout(() => {
      setIsTyping(false);
    }, 80);
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
