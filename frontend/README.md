## 安装和运行

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 启动开发服务器
```bash
npm start
```

应用将在 http://localhost:3000 启动

### 3. 确保后端服务运行
确保后端SSE服务在 http://localhost:3001 运行

## 技术栈

- **React 18**: 前端框架
- **CSS3**: 样式和动画
- **EventSource API**: SSE连接
- **Fetch API**: HTTP请求

## 项目结构

```
src/
├── components/              # React组件
│   ├── Step.js             # 步骤组件
│   ├── Step.css            # 步骤组件样式
│   ├── Think.js            # 思考组件
│   ├── Think.css           # 思考组件样式
│   ├── Text.js             # 文本组件
│   ├── Text.css            # 文本组件样式
│   ├── Search.js           # 搜索组件
│   └── Search.css          # 搜索组件样式
├── services/               # 服务层
│   ├── sseService.js       # SSE连接服务
│   └── componentManager.js # 组件管理器
├── App.js                  # 主应用组件（简化后）
├── App.css                 # 主应用样式
├── index.js                # 入口文件
└── index.css               # 全局样式
```
## 数据格式

应用接收的数据格式如下：

```json
{
  "msg_id": "消息ID",
  "type": "step|think|text",
  "content": {
    "content": "内容文本",
    "title": "标题",
    "is_finished": false
  },
  "is_finished": false
}
```

## 自定义配置

### 修改SSE端点
在 `src/services/sseService.js` 中修改：
```javascript
this.eventSource = new EventSource('http://localhost:3001/events');
```
