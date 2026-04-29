const express = require('express');
const line = require('@line/bot-sdk');

const app = express();
app.use(express.json());

const config = {
  channelAccessToken: '你的TOKEN',
  channelSecret: '你的SECRET'
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

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

app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('機器人啟動');
});