import React, { useState, useEffect, useRef } from 'react';
import './Think.css';
import Search from './Search';

const Think = ({ data, isFinished, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const processedMsgIdsRef = useRef(new Set());

  useEffect(() => {
    if (data && data.content && data.msg_id) {
      const content = data.content.content || '';
      const type = data.content.type;
      
      // 如果遇到search类型，记录并保存search数据
      if (type === 'search') {
        setHasSearch(true);
        setSearchData(data.content);
      }
      // 处理search类型的content内容
      if (type === 'search' && content && !processedMsgIdsRef.current.has(data.msg_id)) {
        processedMsgIdsRef.current.add(data.msg_id);
        // 将search内容传递给Search组件进行追加
        setSearchData(prev => ({
          ...prev,
          content: (prev?.content || '') + content
        }));
      }
      // 检查是否已经处理过这个消息
      if (content && !isTyping && type !== 'search' && !processedMsgIdsRef.current.has(data.msg_id)) {
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
    
    // 模拟思考延迟
    setTimeout(() => {
      setIsTyping(false);
    }, 100);
  };

  const getTitle = () => {
    if (data?.content?.type === 'search') {
      return '搜索中...';
    }
    return data?.content?.title || '深度思考中...';
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
