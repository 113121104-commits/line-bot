require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');

const ai = require('./services/ai');
const weather = require('./services/weather');
const time = require('./services/time');

const app = express();

/* LINE client（穩定版） */
const client = new line.Client({
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET
});

/* webhook */
app.post('/webhook', express.json(), async (req, res) => {

  console.log('🔥 webhook 有進來');

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
      reply = `我不懂：${msg}`;
    }

    try {
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: reply }]
      });
    } catch (err) {
      console.error('❌ reply error:', err);
    }

  }));

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Bot running 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot started 🚀');
});