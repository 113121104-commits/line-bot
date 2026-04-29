const express = require('express');
const line = require('@line/bot-sdk');

const app = express();
app.use(express.json());

// 🔑 LINE 設定（要換成真正 TOKEN）
const config = {
  channelAccessToken: '你的ChannelAccessToken',
  channelSecret: '你的ChannelSecret'
};

// ✔ v11 正確寫法
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

// webhook
app.post('/webhook', (req, res) => {
  Promise.all(req.body.events.map(event => {

    if (event.type === 'message' && event.message.type === 'text') {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: '你好，我是機器人 🤖'
          }
        ]
      });
    }

  }));

  res.sendStatus(200);
});

// health check
app.get('/', (req, res) => {
  res.send('Bot is running');
});

// Render port
app.listen(process.env.PORT || 3000, () => {
  console.log('機器人啟動');
});