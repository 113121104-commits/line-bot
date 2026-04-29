require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');

const ai = require('./services/ai');
const weather = require('./services/weather');
const time = require('./services/time');

const app = express();

/* LINE 設定 */
const config = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET
};

const client = new line.Client(config);

/* Webhook */
app.post('/webhook', express.json(), async (req, res) => {

  const events = req.body.events || [];

  await Promise.all(events.map(async (event) => {

    if (event.type !== 'message') return;
    if (event.message.type !== 'text') return;

    const msg = event.message.text.trim();
    let reply = '';

    /* 時間 */
    if (msg === '時間') {
      reply = time.getTime();
    }

    /* 天氣 */
    else if (msg.startsWith('天氣')) {
      const city = msg.replace('天氣', '').trim() || 'Hualien';
      reply = await weather.getWeather(city);
    }

    /* AI */
    else if (msg.startsWith('AI')) {
      const question = msg.replace('AI', '').trim();
      reply = await ai.askAI(question);
    }

    /* 關鍵字 */
    else if (msg.includes('你好')) {
      reply = '你好 👋 我是LINE機器人';
    }

    else if (msg.includes('誰')) {
      reply = '我是AI機器人 🤖';
    }

    /* 預設 */
    else {
      reply = `我不懂：${msg}`;
    }

    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: reply }]
    });

  }));

  res.sendStatus(200);
});

/* 測試頁 */
app.get('/', (req, res) => {
  res.send('LINE Bot Running 🚀');
});

/* 啟動 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot running 🚀');
});