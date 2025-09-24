## 功能特性

- 实时数据推送 (Server-Sent Events)
- 基于JSON文件的数据存储
- 支持多个客户端同时连接
- 可控制推送速度
- 连接状态监控
- 优雅关闭处理
- CORS支持
- 错误处理和重连机制

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 启动服务器

```bash
npm start
```

或者使用开发模式（自动重启）：

```bash
npm run dev
```

### 3. 访问测试页面

打开浏览器访问：`http://localhost:3001/test-sse.html`

## API端点

### SSE连接
- **GET** `/events` - 建立SSE连接

### 控制端点
- **POST** `/start-stream` - 开始推送数据
  ```json
  {
    "speed": 1000  // 推送间隔（毫秒）
  }
  ```

- **POST** `/stop-stream` - 停止推送数据

- **POST** `/reset` - 重置数据

### 状态端点
- **GET** `/status` - 获取服务器状态

## 数据格式

服务器会推送以下格式的JSON数据：

```json
{
  "msg_id": "765881551455182850",
  "content": {
    "content": "找到50篇资料作为参考",
    "title": "搜索资料",
    "is_finished": false
  },
  "is_finished": false,
  "finish_reason": "",
  "type": "step"
}
```

### 消息类型

- **step**: 步骤信息 - 用于显示执行步骤
- **think**: 思考过程 - 用于显示AI思考过程
- **text**: 文本内容 - 用于显示最终输出
- **search**: 搜索信息 - 用于显示搜索过程（嵌套在think中）

## 前端集成示例

### 基础SSE连接
```javascript
// 建立SSE连接
const eventSource = new EventSource('http://localhost:3001/events');

// 监听消息
eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('收到数据:', data);
};

// 开始推送
fetch('http://localhost:3001/start-stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ speed: 1000 })
});

// 关闭连接
eventSource.close();
```

## 配置

- **端口**: 3001 (可在server.js中修改)
- **数据文件**: `data.json`
- **CORS**: 已启用，支持跨域请求

## 技术栈

- **Node.js**: 服务器运行环境
- **Express.js**: Web框架
- **CORS中间件**: 跨域资源共享
- **Server-Sent Events (SSE)**: 实时数据推送
- **JSON数据存储**: 轻量级数据存储

