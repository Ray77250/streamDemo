## 项目架构

```
streaming/
├── backend/                 # 后端服务
│   ├── server.js           # Express服务器 + SSE
│   ├── data.json           # 流式数据源
│   └── package.json        # Node.js依赖
└── frontend/               # React前端
    ├── src/
    │   ├── App.js          # 主应用
    │   ├── components/     # UI组件
    │   │   ├── Step.js     # 步骤展示
    │   │   ├── Think.js    # 思考过程
    │   │   ├── Text.js     # 文本内容
    │   │   ├── Search.js   # 搜索功能
    │   │   └── Reply.js    # 回复组件
    │   └── services/       # 业务逻辑
    │       ├── sseService.js      # SSE连接
    │       └── componentManager.js # 组件管理
    └── package.json        # React依赖
```

## 快速开始

### 1. 启动后端服务器

```bash
cd backend
npm install
node server.js
```

服务器将在 `http://localhost:3001` 启动

### 2. 启动前端应用

```bash
cd frontend
npm install
npm start
```

前端应用将在 `http://localhost:3000` 启动

## API端点

### SSE连接
- **GET** `/events` - 建立SSE连接

### 控制端点
- **POST** `/start-stream` - 开始推送数据
  ```json
  {
    "speed": 100  // 推送间隔（毫秒）
  }
  ```

- **POST** `/stop-stream` - 停止推送数据
- **POST** `/reset` - 重置数据

### 状态端点
- **GET** `/status` - 获取服务器状态

## 数据格式

服务器推送的JSON数据格式：

```json
{
  "msg_id": "765881551455182850",
  "content": {
    "content": "找到50篇资料作为参考",
    "is_finished": false
  },
  "is_finished": false,
  "finish_reason": "",
  "type": "step"
}
```

## 使用示例

### 前端JavaScript集成

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

## 技术栈

- **后端**: Node.js, Express.js, Server-Sent Events
- **前端**: React 18, CSS3, JavaScript ES6+
- **数据存储**: JSON文件
- **开发工具**: npm, React Scripts
