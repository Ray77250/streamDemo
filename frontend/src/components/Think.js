import React, { useState, useEffect } from 'react';
import './Think.css';
import Search from './Search';

const Think = ({ data, isFinished, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [hasSearch, setHasSearch] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [processedMsgIds, setProcessedMsgIds] = useState(new Set());

  useEffect(() => {
    if (data && data.content && data.msg_id) {
      const content = data.content.content || '';
      const title = data.content.title || '';
      const type = data.content.type;
      
      if (title && title !== currentTitle) {
        setCurrentTitle(title);
      }
      
      // 如果遇到search类型，记录并保存search数据
      if (type === 'search') {
        setHasSearch(true);
        setSearchData(data.content);
      }
      // 检查是否已经处理过这个消息
      if (content && !isTyping && type !== 'search' && !processedMsgIds.has(data.msg_id)) {
        setProcessedMsgIds(prev => new Set([...prev, data.msg_id]));
        typeText(content);
      }
    }
  }, [data, isTyping, currentTitle, processedMsgIds]);

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
    
    // 模拟思考延迟
    setTimeout(() => {
      setIsTyping(false);
    }, 100);
  };

  const getTitle = () => {
    if (data?.content?.type === 'search') {
      return '搜索中...';
    }
    if (data?.content?.title) {
      return data.content.title;
    }
    return '思考中...';
  };

  return (
    <div className={`think-container ${isFinished ? 'finished' : ''}`}>
      <div className="think-header">
        <div className="think-title">{getTitle()}</div>
      </div>
      <div className="think-content">
        {hasSearch && searchData && (
          <div className="think-search-section">
            <Search data={searchData} isFinished={isFinished} />
          </div>
        )}
      
        {displayText && (
          <div className="think-text">
            {displayText}
            {isTyping && <span className="cursor">|</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Think;
