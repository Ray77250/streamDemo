import React, { useState, useEffect, useRef } from 'react';
import './Search.css';

const Search = ({ data, isFinished }) => {
  const { title, content } = data || {};
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const processedContentRef = useRef('');

  useEffect(() => {
    if (content) {
      // 检查是否是新的内容（不是重复的）
      if (content !== processedContentRef.current) {
        processedContentRef.current = content;
        typeText(content);
      }
    }
  }, [content]);

  const typeText = (text) => {
    setIsTyping(true);
    setDisplayText(prev => prev + text); // 追加文本而不是替换
    
    // 模拟打字延迟
    setTimeout(() => {
      setIsTyping(false);
    }, 100);
  };
  
  return (
    <div className={`search-inline ${isFinished ? 'finished' : ''}`}>
      <div className="search-header">
        <div className="search-title">{title || '搜索中...'}</div>
      </div>
      <div className="search-content">
        <div className="search-text">
          {displayText || '正在搜索相关文档...'}
          {isTyping && <span className="cursor">|</span>}
        </div>
      </div>
    </div>
  );
};

export default Search;
