import React, { useState, useEffect, useRef, memo } from 'react';
import './Think.css';
import Search from './Search';

const Think = ({ data, isFinished, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [shouldAutoCollapse, setShouldAutoCollapse] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // 标记组件是否已锁定，不再响应外部更新
  const lastProcessedMsgIdRef = useRef('');
  const collapseStateRef = useRef(false); // 用于持久化展开/收缩状态

  // 同步ref和state，确保状态持久化
  useEffect(() => {
    setIsCollapsed(collapseStateRef.current);
  }, []);

  useEffect(() => {
    // 如果组件已锁定，不再处理新数据
    if (isLocked) {
      return;
    }

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
  }, [data, isTyping, isLocked]);

  useEffect(() => {
    if (isFinished && data?.content?.is_finished) {
      setIsTyping(false);
      setShouldAutoCollapse(true);
      setIsLocked(true); // 锁定组件，不再响应外部更新
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
        collapseStateRef.current = true; // 同时更新ref
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
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    collapseStateRef.current = newCollapsedState; // 同时更新ref以持久化状态
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

// 使用React.memo优化渲染，自定义比较函数
const MemoizedThink = memo(Think, (prevProps, nextProps) => {
  // 如果组件已完成，则不需要重新渲染
  if (prevProps.isFinished && nextProps.isFinished) {
    return true; // 返回true表示props相同，不需要重新渲染
  }
  
  // 如果msg_id相同且都是完成状态，不需要重新渲染
  if (prevProps.data?.msg_id === nextProps.data?.msg_id && 
      prevProps.isFinished && nextProps.isFinished) {
    return true;
  }
  
  // 其他情况需要重新渲染
  return false;
});

export default MemoizedThink;
