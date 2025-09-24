import React, { useState, useEffect, useRef } from 'react';
import './Think.css';
import Search from './Search';

const Think = ({ data, isFinished, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [shouldAutoCollapse, setShouldAutoCollapse] = useState(false);
  const lastProcessedMsgIdRef = useRef('');

  useEffect(() => {
    if (data && data.content && data.msg_id) {
      const content = data.content.content || '';
      const type = data.content.type;
      
      // 只有当消息ID不同时才处理，避免重复处理同一消息
      if (lastProcessedMsgIdRef.current !== data.msg_id) {
        lastProcessedMsgIdRef.current = data.msg_id;
        
        // 如果遇到search类型，记录并保存search数据
        if (type === 'search') {
          setHasSearch(true);
          setSearchData(data.content);
        }
        
        // 处理search类型的content内容
        if (type === 'search' && content) {
          // 将search内容传递给Search组件进行追加
          setSearchData(prev => ({
            ...prev,
            content: (prev?.content || '') + content
          }));
        }
        
        // 处理非search类型的消息
        if (content && !isTyping && type !== 'search') {
          typeText(content);
        }
      }
    }
  }, [data, isTyping]);

  useEffect(() => {
    if (isFinished && data?.content?.is_finished) {
      setIsTyping(false);
      setShouldAutoCollapse(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [isFinished, data, onComplete]);

  // 思考完成后自动折叠
  useEffect(() => {
    if (shouldAutoCollapse) {
      const timer = setTimeout(() => {
        setIsCollapsed(true);
        setShouldAutoCollapse(false);
      }, 1000); // 1秒后自动折叠
      return () => clearTimeout(timer);
    }
  }, [shouldAutoCollapse]);

  const typeText = (text) => {
    setIsTyping(true);
    setDisplayText(prev => prev + text); // 追加文本而不是替换
    
    // 立即完成，无延迟
    setIsTyping(false);
  };

  const getTitle = () => {
    if (data?.content?.type === 'search') {
      return '搜索中...';
    }
    return data?.content?.title || '深度思考中...';
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`think-container ${isFinished ? 'finished' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="think-header">
        <div className="think-title">{getTitle()}</div>
        <button 
          className="think-toggle-btn"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? '展开' : '折叠'}
          data-symbol={isCollapsed ? '▶' : '▼'}
        >
        </button>
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
