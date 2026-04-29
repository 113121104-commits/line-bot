require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');

const app = express();

/* LINE CONFIG */
const config = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET
};

/* ✅ 正確 SDK 初始化 */
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

/* WEBHOOK */
app.post('/webhook', express.json(), async (req, res) => {

  const events = req.body.events || [];

  await Promise.all(events.map(async (event) => {

    if (event.type !== 'message') return;
    if (event.message.type !== 'text') return;

    const msg = event.message.text.trim();
    let reply = '';

    /* 時間 */
    if (msg === '時間') {
      reply = `現在時間：${new Date().toLocaleString('zh-TW')}`;
    }

    /* 幫助 */
    else if (msg === '幫助') {
      reply = `時間 / 天氣 城市 / AI 問題`;
    }

    /* 天氣 */
    else if (msg.startsWith('天氣')) {
      try {
        const city = msg.replace('天氣', '').trim() || 'Hualien';

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric&lang=zh_tw`;

        const resWeather = await axios.get(url);

        reply = `${city}
🌡️ ${resWeather.data.main.temp}°C
🌤️ ${resWeather.data.weather[0].description}`;
      } catch (err) {
        reply = '查不到天氣 ❌';
      }
    }

    /* AI */
    else if (msg.startsWith('AI')) {
      try {
        const question = msg.replace('AI', '').trim();

        const ai = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: '你是LINE助手' },
              { role: 'user', content: question }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_KEY}`
            }
          }
        );

        reply = ai.data.choices[0].message.content;
      } catch (err) {
        reply = 'AI錯誤 ❌';
      }
    }

    /* 預設 */
    else {
      reply = `你說：${msg}`;
    }

    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: reply }]
    });

  }));

  res.sendStatus(200);
});

/* HOME */
app.get('/', (req, res) => {
  res.send('LINE Bot Running 🚀');
});

/* START */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot running 🚀');
});