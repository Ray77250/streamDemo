import React, { useState, useEffect, useCallback } from 'react';
import sseService from './services/sseService';
import componentManager from './services/componentManager';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState('-');
  const [components, setComponents] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // 处理SSE消息
  const handleSSEMessage = useCallback((eventType, data) => {
    switch (eventType) {
      case 'connected':
        setIsConnected(true);
        break;
      case 'error':
        console.error('SSE错误:', data);
        break;
      case 'message':
        handleNewMessage(data);
        break;
      case 'complete':
        setIsStreaming(false);
        break;
      default:
        break;
    }
    setLastUpdate(new Date().toLocaleTimeString());
  }, []);

  // 处理新消息
  const handleNewMessage = useCallback((data) => {
    setMessageCount(prev => prev + 1);
    componentManager.handleNewMessage(data);
  }, []);

  // 连接SSE
  const connect = useCallback(() => {
    sseService.connect();
  }, []);


  // 开始推送
  const startStream = useCallback(async () => {
    if (!isConnected) {
      alert('请先连接SSE');
      return;
    }
    
    try {
      await sseService.startStream();
      setIsStreaming(true);
    } catch (error) {
      console.error('开始推送失败:', error);
      alert('开始推送失败: ' + error.message);
    }
  }, [isConnected]);


  // 清空内容
  const clearContent = useCallback(() => {
    componentManager.clearComponents();
    setMessageCount(0);
    setLastUpdate('-');
    setIsStreaming(false);
    console.log('前端内容已清空');
  }, []);

  // 注册SSE监听器
  useEffect(() => {
    const unsubscribe = sseService.addListener(handleSSEMessage);
    return unsubscribe;
  }, [handleSSEMessage]);

  // 注册组件管理器监听器
  useEffect(() => {
    const unsubscribe = componentManager.addListener(setComponents);
    return unsubscribe;
  }, []);

  // 渲染组件
  const renderComponent = (component) => {
    return componentManager.renderComponent(component);
  };

  return (
    <div className="App">
      <div className="container">

        <div className={`status ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
          {isConnected ? '已连接' : '未连接'}
        </div>

        <div className="stats">
          <div className="stat-item">
            <strong>接收消息:</strong> {messageCount}
          </div>
          <div className="stat-item">
            <strong>最后更新:</strong> {lastUpdate}
          </div>
        </div>

        <div className="controls">
          <button 
            className="btn btn-primary" 
            onClick={connect}
            disabled={isConnected}
          >
            连接SSE
          </button>
          <button 
            className="btn btn-success" 
            onClick={startStream}
            disabled={!isConnected || isStreaming}
          >
            开始推送
          </button>
          <button 
            className="btn btn-warning" 
            onClick={clearContent}
            disabled={components.length === 0}
          >
            清空内容
          </button>

        </div>

        <div className="content-area">
          {components.length === 0 ? (
            <div className="empty-state">
              <p>等待数据...</p>
              <p>请先连接SSE，然后开始推送数据</p>
            </div>
          ) : (
            <div className="main-layout">
              <div className="left-panel">
                <div className="left-components">
                  {components
                    .filter(comp => comp.type !== 'text')
                    .map(renderComponent)}
                </div>
              </div>
              <div className="right-panel">
                <div className="right-components">
                  {components
                    .filter(comp => comp.type === 'text')
                    .map(renderComponent)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
