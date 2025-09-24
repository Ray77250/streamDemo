## 项目架构

```
streaming/
├── backend/                 # 后端SSE服务器
│   ├── server.js           # 主服务器文件
│   ├── data.json           # 数据存储文件
│   ├── package.json        # 依赖管理
│   └── README.md           # 后端说明文档
└── frontend/               # React前端应用
    ├── src/                # 源代码目录
    │   ├── App.js          # 主应用组件（简化后）
    │   ├── components/     # React组件
    │   │   ├── Step.js     # 步骤组件
    │   │   ├── Think.js    # 思考组件
    │   │   ├── Text.js     # 文本组件
    │   │   └── Search.js   # 搜索组件
    │   └── services/       # 服务层
    │       ├── sseService.js      # SSE连接服务
    │       └── componentManager.js # 组件管理器
    ├── package.json        # 前端依赖
    └── public/             # 静态资源
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
