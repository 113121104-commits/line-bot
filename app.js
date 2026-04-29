require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');

const app = express();

/* ================= LINE ================= */
const config = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET,
};

const client = new line.Client(config);

/* ================= Webhook ================= */
app.post('/webhook', line.middleware(config), async (req, res) => {
  const events = req.body.events;

  await Promise.all(events.map(async (event) => {
    if (event.type !== 'message') return;
    if (event.message.type !== 'text') return;

    const msg = event.message.text.trim();
    let reply = '';

    /* ===== 時間 ===== */
    if (msg === '時間') {
      reply = `現在時間：${new Date().toLocaleString('zh-TW')}`;
    }

    /* ===== 自動回覆 ===== */
    else if (msg === '你好') {
      reply = '哈囉 👋 我是機器人';
    }

    /* ===== 預設 ===== */
    else {
      reply = `你說：${msg}`;
    }

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: reply,
    });
  }));

  res.sendStatus(200);
});

/* ================= 首頁 ================= */
app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

/* ================= 啟動 ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('機器人啟動 🚀');
});