import React, { useState, useEffect, useCallback } from 'react';
import Step from './components/Step';
import Think from './components/Think';
import Text from './components/Text';
import sseService from './services/sseService';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState('-');
  const [speed, setSpeed] = useState(1000);
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
    
    if (data.type === 'step') {
      setComponents(prev => {
        const newComponents = [...prev];
        
        // 找到最后一个（最新的）未完成的step组件
        let activeStepIndex = -1;
        for (let i = newComponents.length - 1; i >= 0; i--) {
          if (newComponents[i].type === 'step' && !newComponents[i].isFinished) {
            activeStepIndex = i;
            break;
          }
        }
        
        if (activeStepIndex >= 0) {
          // 更新当前活跃的step组件
          newComponents[activeStepIndex] = {
            ...newComponents[activeStepIndex],
            data: data,
            isFinished: data.content?.is_finished || false
          };
        } else {
          // 没有活跃的step组件，创建新的
          newComponents.push({
            id: `${data.msg_id}_${Date.now()}`, // 生成唯一ID
            type: 'step',
            data: data,
            isFinished: data.content?.is_finished || false
          });
        }
        return newComponents;
      });
    } else if (data.type === 'think') {
      setComponents(prev => {
        const newComponents = [...prev];
        
        // 找到最后一个（最新的）未完成的think组件
        let activeThinkIndex = -1;
        for (let i = newComponents.length - 1; i >= 0; i--) {
          if (newComponents[i].type === 'think' && !newComponents[i].isFinished) {
            activeThinkIndex = i;
            break;
          }
        }
        
        if (activeThinkIndex >= 0) {
          // 更新当前活跃的think组件
          newComponents[activeThinkIndex] = {
            ...newComponents[activeThinkIndex],
            data: data,
            isFinished: data.content?.is_finished || false
          };
        } else {
          // 没有活跃的think组件，创建新的
          newComponents.push({
            id: `${data.msg_id}_${Date.now()}`, // 生成唯一ID
            type: 'think',
            data: data,
            isFinished: data.content?.is_finished || false
          });
        }
        return newComponents;
      });
    } else if (data.type === 'text') {
      setComponents(prev => {
        const newComponents = [...prev];
        
        // 找到最后一个（最新的）未完成的text组件
        let activeTextIndex = -1;
        for (let i = newComponents.length - 1; i >= 0; i--) {
          if (newComponents[i].type === 'text' && !newComponents[i].isFinished) {
            activeTextIndex = i;
            break;
          }
        }
        
        if (activeTextIndex >= 0) {
          // 更新当前活跃的text组件
          newComponents[activeTextIndex] = {
            ...newComponents[activeTextIndex],
            data: data,
            isFinished: data.content?.is_finished || false
          };
        } else {
          // 没有活跃的text组件，创建新的
          newComponents.push({
            id: `${data.msg_id}_${Date.now()}`, // 生成唯一ID
            type: 'text',
            data: data,
            isFinished: data.content?.is_finished || false
          });
        }
        return newComponents;
      });
    }
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
      await sseService.startStream(speed);
      setIsStreaming(true);
    } catch (error) {
      console.error('开始推送失败:', error);
      alert('开始推送失败: ' + error.message);
    }
  }, [isConnected, speed]);


  // 组件完成回调
  const handleComponentComplete = useCallback((componentId) => {
    console.log(`组件 ${componentId} 完成`);
  }, []);

  // 清空内容
  const clearContent = useCallback(() => {
    setComponents([]);
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

  // 渲染组件
  const renderComponent = (component) => {
    const commonProps = {
      data: component.data,
      isFinished: component.isFinished,
      onComplete: () => handleComponentComplete(component.id)
    };

    switch (component.type) {
      case 'step':
        return <Step key={component.id} {...commonProps} />;
      case 'think':
        return <Think key={component.id} {...commonProps} />;
      case 'text':
        return <Text key={component.id} {...commonProps} />;
      default:
        return null;
    }
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

          <div className="speed-control">
            <label>推送速度:</label>
            <select 
              value={speed} 
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              disabled={isStreaming}
            >
              <option value={500}>快速 (500ms)</option>
              <option value={1000}>正常 (1s)</option>
              <option value={2000}>慢速 (2s)</option>
              <option value={3000}>很慢 (3s)</option>
            </select>
          </div>
        </div>

        <div className="content-area">
          {components.length === 0 ? (
            <div className="empty-state">
              <p>等待数据...</p>
              <p>请先连接SSE，然后开始推送数据</p>
            </div>
          ) : (
            <div className="components-container">
              {components.map(renderComponent)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
