require('dotenv').config();

const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const axios = require('axios');

const app = express();

/* ================= LINE 設定 ================= */
const config = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET
};

const client = new Client(config);

/* ================= webhook ================= */
app.post('/webhook', middleware(config), async (req, res) => {
  try {
    const events = req.body.events || [];

    for (const event of events) {

      if (event.type !== 'message') continue;
      if (event.message.type !== 'text') continue;

      const msg = event.message.text.trim();
      let reply = '我看不懂你的指令 🤖';

      /* ================= 時間 ================= */
      if (msg === '時間') {
        reply = `現在時間：${new Date().toLocaleString('zh-TW')}`;
      }

      /* ================= 天氣 ================= */
      else if (msg.startsWith('天氣')) {
        try {
          const city = msg.replace('天氣', '').trim() || 'Hualien';

          const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric&lang=zh_tw`;

          const resWeather = await axios.get(url);
          const data = resWeather.data;

          reply = `🌤️ ${city}
溫度：${data.main.temp}°C
天氣：${data.weather[0].description}`;
        } catch (err) {
          reply = '查詢天氣失敗 ❌';
        }
      }

      /* ================= AI ChatGPT ================= */
      else if (msg.startsWith('AI ')) {
        try {
          const question = msg.replace('AI ', '');

          const aiRes = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: '你是LINE機器人，回答要簡短清楚' },
                { role: 'user', content: question }
              ]
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_KEY}`
              }
            }
          );

          reply = aiRes.data.choices[0].message.content;
        } catch (err) {
          reply = 'AI 暫時無法使用 ❌';
        }
      }

      /* ================= 預設回覆 ================= */
      else {
        reply = `你說：${msg}`;
      }

      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: reply }]
      });
    }

    res.sendStatus(200);

  } catch (err) {
    console.error('Webhook error:', err);
    res.sendStatus(200);
  }
});

/* ================= 首頁測試 ================= */
app.get('/', (req, res) => {
  res.send('LINE Bot is running 🚀');
});

/* ================= 啟動 ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('機器人啟動 🚀');
});