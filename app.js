require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');

const app = express();

/* ================= LINE ================= */
const config = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET
};

const client = new line.Client(config);

/* ================= webhook ================= */
app.post('/webhook', express.json(), async (req, res) => {

  const events = req.body.events || [];

  await Promise.all(events.map(async (event) => {

    if (event.type !== 'message') return;
    if (event.message.type !== 'text') return;

    const msg = event.message.text.trim();
    let reply = '';

    /* ================= 指令系統 ================= */
    
    // 🕒 時間
    if (msg === '時間') {
      reply = `現在時間：${new Date().toLocaleString('zh-TW')}`;
    }

    // 📍 幫助
    else if (msg === '幫助') {
      reply =
`指令列表：
時間 👉 顯示時間
天氣 台北 👉 查天氣
AI 你好 👉 ChatGPT 回答`;
    }

    /* ================= 天氣 ================= */
    else if (msg.startsWith('天氣')) {
      try {
        const city = msg.replace('天氣', '').trim() || 'Hualien';

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric&lang=zh_tw`;

        const resWeather = await axios.get(url);

        reply =
`${city}
🌡️ 溫度：${resWeather.data.main.temp}°C
🌤️ 天氣：${resWeather.data.weather[0].description}`;
      } catch (err) {
        reply = '❌ 查不到這個城市天氣';
      }
    }

    /* ================= AI ChatGPT ================= */
    else if (msg.startsWith('AI')) {
      try {
        const question = msg.replace('AI', '').trim();

        const ai = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: '你是LINE機器人，回答要簡短' },
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
        reply = '❌ AI 目前無法使用';
      }
    }

    /* ================= 關鍵字系統 ================= */
    else if (msg.includes('你好')) {
      reply = '你好 👋 我是你的LINE機器人';
    }
    else if (msg.includes('誰')) {
      reply = '我是AI機器人 🤖';
    }

    /* ================= 預設 ================= */
    else {
      reply = `我不懂「${msg}」，輸入「幫助」查看指令`;
    }

    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: reply }]
    });
  }));

  res.sendStatus(200);
});

/* ================= 測試頁 ================= */
app.get('/', (req, res) => {
  res.send('LINE Bot Running 🚀');
});

/* ================= 啟動 ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot running 🚀');
});