# 后端服务

Node.js + Express SSE服务器，提供实时数据推送服务。

## 快速开始

```bash
# 安装依赖
npm install

# 启动服务器
npm start

# 开发模式（自动重启）
npm run dev
```

服务器将在 http://localhost:3001 启动

## 功能特性

- 实时数据推送 (Server-Sent Events)
- 多客户端连接支持
- 可控制推送速度
- CORS跨域支持
- 连接状态监控

## API端点

### SSE连接
- **GET** `/events` - 建立SSE连接

### 控制端点
- **POST** `/start-stream` - 开始推送数据
  ```json
  { "speed": 1000 }
  ```
- **POST** `/stop-stream` - 停止推送数据
- **POST** `/reset` - 重置数据

### 状态端点
- **GET** `/status` - 获取服务器状态

## 数据格式

推送的JSON数据格式：

```json
{
  "msg_id": "消息ID",
  "type": "step|think|text|search",
  "content": {
    "content": "内容文本",
    "title": "标题",
    "is_finished": false
  },
  "is_finished": false
}
```

## 技术栈

- **Node.js** - 服务器运行环境
- **Express.js** - Web框架
- **CORS** - 跨域资源共享
- **Server-Sent Events** - 实时数据推送
- **JSON** - 数据存储

## 配置

- **端口**: 3001
- **数据文件**: `data.json`
- **CORS**: 已启用

