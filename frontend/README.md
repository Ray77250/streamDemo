# 前端应用

React流式数据展示界面，通过SSE接收后端推送的实时数据。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

应用将在 http://localhost:3000 启动

## 技术栈

- **React 18** - 前端框架
- **CSS3** - 样式和动画
- **EventSource API** - SSE连接
- **Fetch API** - HTTP请求

## 项目结构

```
src/
├── components/              # UI组件
│   ├── Step.js             # 步骤展示
│   ├── Think.js            # 思考过程
│   ├── Text.js             # 文本内容
│   ├── Search.js           # 搜索功能
│   └── Reply.js            # 回复组件
├── services/               # 业务逻辑
│   ├── sseService.js       # SSE连接管理
│   └── componentManager.js # 组件状态管理
└── App.js                  # 主应用
```

## 数据格式

接收的SSE数据格式：

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

## 配置

修改SSE端点：`src/services/sseService.js`
```javascript
this.eventSource = new EventSource('http://localhost:3001/events');
```
