import React from 'react';
import Step from '../components/Step';
import Think from '../components/Think';
import Text from '../components/Text';
import Reply from '../components/Reply';

class ComponentManager {
  constructor() {
    this.components = [];
    this.listeners = [];
  }

  // 添加监听器
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // 通知所有监听器
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.components));
  }

  // 处理新消息
  handleNewMessage(data) {
    const componentType = data.type;
    
    if (!['step', 'think', 'text', 'reply'].includes(componentType)) {
      return;
    }

    // 找到最后一个未完成的同类型组件
    let activeIndex = -1;
    for (let i = this.components.length - 1; i >= 0; i--) {
      if (this.components[i].type === componentType && !this.components[i].isFinished) {
        activeIndex = i;
        break;
      }
    }

    if (activeIndex >= 0) {
      // 更新现有组件
      this.components[activeIndex] = {
        ...this.components[activeIndex],
        data: data,
        isFinished: data.content?.is_finished || false
      };
    } else {
      // 创建新组件
      this.components.push({
        id: `${data.msg_id}_${Date.now()}`,
        type: componentType,
        data: data,
        isFinished: data.content?.is_finished || false
      });
    }

    this.notifyListeners();
  }

  // 清空所有组件
  clearComponents() {
    this.components = [];
    this.notifyListeners();
  }

  // 渲染组件
  renderComponent(component) {
    const commonProps = {
      data: component.data,
      isFinished: component.isFinished,
      onComplete: () => this.handleComponentComplete(component.id)
    };

    switch (component.type) {
      case 'step':
        return React.createElement(Step, { key: component.id, ...commonProps });
      case 'think':
        return React.createElement(Think, { key: component.id, ...commonProps });
      case 'text':
        return React.createElement(Text, { key: component.id, ...commonProps });
      case 'reply':
        return React.createElement(Reply, { key: component.id, ...commonProps });
      default:
        return null;
    }
  }

  // 处理组件完成
  handleComponentComplete(componentId) {
    console.log(`组件 ${componentId} 完成`);
  }

  // 获取所有组件
  getComponents() {
    return this.components;
  }
}

// 创建单例实例
const componentManager = new ComponentManager();

export default componentManager;
