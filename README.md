# 实时流式数据推送项目

这是一个基于Server-Sent Events (SSE) 的实时数据推送项目，包含后端服务器和前端演示页面。

## 项目结构

```
streaming/
├── backend/                 # 后端SSE服务器
│   ├── server.js           # 主服务器文件
│   ├── data.json           # 数据存储文件
│   ├── package.json        # 依赖管理
│   └── README.md           # 后端说明文档
└── frontend/               # React前端应用
    ├── src/                # 源代码目录
    │   ├── App.js          # 主应用组件
    │   ├── components/     # React组件
    │   │   ├── Step.js     # 步骤组件
    │   │   ├── Think.js    # 思考组件
    │   │   ├── Text.js     # 文本组件
    │   │   └── Search.js   # 搜索组件
    │   └── services/       # 服务层
    │       └── sseService.js # SSE服务
    ├── package.json        # 前端依赖
    └── public/             # 静态资源
```

## 功能特性

### 后端 (SSE服务器)
- ✅ 实时数据推送 (Server-Sent Events)
- ✅ 基于JSON文件的数据存储
- ✅ 支持多个客户端同时连接
- ✅ 可控制推送速度
- ✅ 连接状态监控
- ✅ 优雅关闭处理
- ✅ CORS支持

### 前端 (React应用)
- ✅ 现代化的React界面
- ✅ 实时数据展示组件
- ✅ SSE连接管理
- ✅ 数据推送控制
- ✅ 多种消息类型支持 (step, think, text, search)
- ✅ 打字机动画效果
- ✅ 响应式设计

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
    "speed": 1000  // 推送间隔（毫秒）
  }
  ```

- **POST** `/stop-stream` - 停止推送数据
- **POST** `/reset` - 重置数据

### 状态端点
- **GET** `/status` - 获取服务器状态
- **GET** `/health` - 健康检查

## 数据格式

服务器推送的JSON数据格式：

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

## 开发说明

### 修改数据
编辑 `backend/data.json` 文件来修改推送的数据内容。

### 自定义推送逻辑
修改 `backend/server.js` 中的 `pushDataToClients` 函数来自定义推送逻辑。

### 添加新的消息类型
1. 在 `data.json` 中添加新的消息格式
2. 在 `App.js` 的 `handleNewMessage` 函数中添加新的类型处理
3. 创建对应的React组件（如需要）

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

## 项目状态

✅ 后端SSE服务器 - 完成  
✅ JSON数据存储 - 完成  
✅ React前端应用 - 完成  
✅ 数据推送功能 - 完成  
✅ 连接管理 - 完成  
✅ 错误处理 - 完成  
✅ 代码优化 - 完成  

项目已完全可用，代码已优化，可以开始使用和进一步开发！
