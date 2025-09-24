class SSEService {
  constructor() {
    this.eventSource = null;
    this.listeners = new Set();
    this.isConnected = false;
    this.messageCount = 0;
  }

  connect() {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource('http://localhost:3001/events');
    
    this.eventSource.onopen = () => {
      console.log('SSE连接已建立');
      this.isConnected = true;
      this.notifyListeners('connected', { message: '连接已建立' });
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageCount++;
        this.notifyListeners('message', data);
      } catch (error) {
        console.error('解析SSE消息失败:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE连接错误:', error);
      this.isConnected = false;
      this.notifyListeners('error', { error: '连接错误' });
    };
  }


  async startStream() {
    if (!this.isConnected) {
      throw new Error('请先连接SSE');
    }

    try {
      const response = await fetch('http://localhost:3001/start-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      console.log('开始推送:', data);
      return data;
    } catch (error) {
      console.error('开始推送失败:', error);
      throw error;
    }
  }


  async getStatus() {
    try {
      const response = await fetch('http://localhost:3001/status');
      return await response.json();
    } catch (error) {
      console.error('获取状态失败:', error);
      throw error;
    }
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(eventType, data) {
    this.listeners.forEach(callback => {
      try {
        callback(eventType, data);
      } catch (error) {
        console.error('通知监听器失败:', error);
      }
    });
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  getMessageCount() {
    return this.messageCount;
  }
}

// 创建单例实例
const sseService = new SSEService();
export default sseService;
