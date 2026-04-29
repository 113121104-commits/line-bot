require('dotenv').config();

const express = require('express');
const { messagingApi } = require('@line/bot-sdk');

const ai = require('./services/ai');
const weather = require('./services/weather');
const time = require('./services/time');

const app = express();

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_TOKEN
});

app.post('/webhook', express.json(), async (req, res) => {
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

app.get('/', (req, res) => {
  res.send('Bot running 🚀');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Bot started 🚀');
});