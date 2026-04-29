const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: '你的TOKEN',
  channelSecret: '你的SECRET'
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

// 🔥 LINE middleware（關鍵）
app.post('/webhook', express.json(), async (req, res) => {

  console.log('🔥 webhook 有進來');

  const events = req.body.events || [];

  await Promise.all(events.map(async (event) => {

    if (!event || event.type !== 'message') return;
    if (!event.message || event.message.type !== 'text') return;

    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: 'text',
          text: '你好，我是機器人 🤖'
        }
      ]
    });
  }));

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('機器人啟動');
});