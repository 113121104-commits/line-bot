require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');

const ai = require('./services/ai');
const weather = require('./services/weather');
const time = require('./services/time');

const app = express();

/* 🔥 ① 放這裡（LINE config） */
const config = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET
};

/* 🔥 ② Client（新版） */
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_TOKEN
});

/* 🔥 ③ webhook（這裡最重要） */
app.post('/webhook', line.middleware(config), async (req, res) => {

  const events = req.body.events || [];

  await Promise.all(events.map(async (event) => {

    if (event.type !== 'message') return;
    if (event.message.type !== 'text') return;

    const msg = event.message.text.trim();
    let reply = '';

    if (msg === '時間') {
      reply = time.getTime();
    }

    else if (msg.startsWith('天氣')) {
      const city = msg.replace('天氣', '').trim() || 'Hualien';
      reply = await weather.getWeather(city);
    }

    else if (msg.startsWith('AI')) {
      const question = msg.replace('AI', '').trim();
      reply = await ai.askAI(question);
    }

    else if (msg.includes('你好')) {
      reply = '你好 👋 我是LINE機器人';
    }

    else {
      reply = `講人話：${msg}`;
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
  res.send('Bot running 🚀');
});

/* 啟動 */
app.listen(process.env.PORT || 3000, () => {
  console.log('Bot started 🚀');
});