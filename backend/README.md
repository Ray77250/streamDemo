# SSE后端服务器

这是一个基于Node.js和Express的Server-Sent Events (SSE) 后端服务器，用于实时推送数据到前端客户端。

## 功能特性

- ✅ 实时数据推送 (Server-Sent Events)
- ✅ 基于JSON文件的数据存储
- ✅ 支持多个客户端同时连接
- ✅ 可控制推送速度
- ✅ 连接状态监控
- ✅ 优雅关闭处理

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
- **GET** `/health` - 健康检查

## 数据格式

服务器会推送以下格式的JSON数据：

```json
{
  "msg_id": "765881551455182850",
  "content": {
    "text": "找到50篇资料作为参考",
    "is_finished": false
  },
  "is_finished": false,
  "finish_reason": "",
  "type": "step"
}
```

### 消息类型

- **step**: 步骤信息
- **think**: 思考过程
- **text**: 文本内容

## 前端集成示例

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

## 开发说明

### 修改数据

编辑 `data.json` 文件来修改推送的数据内容。

### 添加新的消息类型

1. 在 `data.json` 中添加新的消息格式
2. 在前端处理新的消息类型

### 自定义推送逻辑

修改 `server.js` 中的 `pushDataToClients` 函数来自定义推送逻辑。

## 故障排除

### 连接失败
- 检查服务器是否正在运行
- 确认端口3001未被占用
- 检查防火墙设置

### 数据不推送
- 确认已调用 `/start-stream` 端点
- 检查 `data.json` 文件格式是否正确
- 查看服务器控制台日志

### 客户端断开
- 检查网络连接
- 确认浏览器支持SSE
- 查看浏览器控制台错误信息

## 技术栈

- Node.js
- Express.js
- CORS中间件
- Server-Sent Events (SSE)
- JSON数据存储
