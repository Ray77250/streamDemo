const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// 存储活跃的SSE连接
const clients = new Set();

// 读取JSON数据
function loadData() {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('读取数据文件失败:', error);
    return [];
  }
}

// SSE端点
app.get('/events', (req, res) => {
  // 设置SSE响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // 将客户端添加到连接列表
  clients.add(res);

  // 发送初始连接确认
  res.write('data: {"type": "connected", "message": "连接已建立"}\n\n');

  // 客户端断开连接时清理
  req.on('close', () => {
    clients.delete(res);
    console.log('客户端断开连接，当前连接数:', clients.size);
  });

  console.log('新客户端连接，当前连接数:', clients.size);
});

// 开始推送数据的端点
app.post('/start-stream', (req, res) => {
  const speed = 1; // 固定为10ms，飞速推送
  
  console.log(`开始推送数据，速度: ${speed}ms`);
  
  // 异步推送数据
  pushDataToClients(speed);
  
  res.json({ 
    success: true, 
    message: '开始推送数据',
    speed: speed 
  });
});


// 推送数据到所有客户端
function pushDataToClients(speed = 1) {
  const data = loadData();
  let currentIndex = 0;

  const interval = setInterval(() => {
    if (currentIndex >= data.length) {
      // 数据推送完成
      broadcastToClients({ 
        type: 'complete', 
        message: '数据推送完成',
        total: data.length 
      });
      clearInterval(interval);
      return;
    }

    const message = data[currentIndex];
    broadcastToClients(message);
    currentIndex++;
  }, speed);
}

// 广播消息到所有客户端
function broadcastToClients(message) {
  const data = `data: ${JSON.stringify(message)}\n\n`;
  
  clients.forEach(client => {
    try {
      client.write(data);
    } catch (error) {
      console.error('发送消息失败:', error);
      clients.delete(client);
    }
  });
}

// 获取当前连接数的端点
app.get('/status', (req, res) => {
  res.json({
    connectedClients: clients.size,
    dataCount: loadData().length,
    status: 'running'
  });
})


// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 SSE服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 SSE端点: http://localhost:${PORT}/events`);
  console.log(`🎮 控制端点:`);
  console.log(`   POST http://localhost:${PORT}/start-stream - 开始推送`);
  console.log(`   GET  http://localhost:${PORT}/status - 查看状态`);
});

// 关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  process.exit(0);
});
