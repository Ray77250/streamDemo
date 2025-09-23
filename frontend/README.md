# React SSE 流式数据展示应用

这是一个基于React的前端应用，用于接收后端SSE（Server-Sent Events）数据流并实现打印机效果展示。

## 功能特性

- 🚀 **实时数据接收**: 通过SSE连接接收后端推送的数据
- 🖨️ **打印机效果**: 三个组件（Step、Think、Text）支持逐字显示效果
- 🎨 **美观界面**: 现代化的UI设计，支持响应式布局
- ⚡ **实时控制**: 支持开始/停止推送、调整速度、重置数据等操作
- 📊 **状态监控**: 实时显示连接状态、消息数量等统计信息

## 组件说明

### Step 组件
- 用于显示步骤信息
- 支持逐字打字效果
- 完成后显示勾选标记
- 绿色主题配色

### Think 组件
- 用于显示思考过程
- 支持追加文本显示
- 显示思考状态和完成状态
- 紫色主题配色

### Text 组件
- 用于显示文本输出
- 支持逐字追加显示
- 等宽字体显示
- 橙色主题配色

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

## 使用方法

1. **连接SSE**: 点击"连接SSE"按钮建立与后端的连接
2. **开始推送**: 点击"开始推送"按钮开始接收数据流
3. **调整速度**: 使用下拉菜单选择推送速度（500ms-3000ms）
4. **停止推送**: 点击"停止推送"按钮停止数据接收
5. **重置数据**: 点击"重置数据"按钮清空所有组件
6. **断开连接**: 点击"断开连接"按钮关闭SSE连接

## 技术栈

- **React 18**: 前端框架
- **CSS3**: 样式和动画
- **EventSource API**: SSE连接
- **Fetch API**: HTTP请求

## 项目结构

```
src/
├── components/          # React组件
│   ├── Step.js         # 步骤组件
│   ├── Step.css        # 步骤组件样式
│   ├── Think.js        # 思考组件
│   ├── Think.css       # 思考组件样式
│   ├── Text.js         # 文本组件
│   └── Text.css        # 文本组件样式
├── services/           # 服务层
│   └── sseService.js   # SSE服务
├── App.js              # 主应用组件
├── App.css             # 主应用样式
├── index.js            # 入口文件
└── index.css           # 全局样式
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

### 调整打字速度
在各个组件的CSS文件中修改动画时间：
```css
const typeInterval = setInterval(() => {
  // 修改这里的延迟时间（毫秒）
}, 50);
```

### 修改组件样式
编辑对应的CSS文件来自定义组件外观。

## 故障排除

1. **连接失败**: 确保后端服务正在运行
2. **数据不显示**: 检查浏览器控制台是否有错误
3. **样式问题**: 确保所有CSS文件正确导入
4. **性能问题**: 调整推送速度或减少数据量

## 许可证

MIT License
