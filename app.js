require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

app.post('/webhook', express.json(), async (req, res) => {
  const events = req.body.events || [];

  for (const event of events) {
    if (event.type !== 'message') continue;
    if (event.message.type !== 'text') continue;

    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: 'text',
          text: '你好，我是機器人 🤖'
        }
      ]
    });
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('機器人啟動 🚀');
});