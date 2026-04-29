const express = require('express');
const line = require('@line/bot-sdk');

const app = express();
app.use(express.json());

// 🔑 LINE 設定
const config = {
  channelAccessToken: '2009928969',
  channelSecret: '3802ab5e60a04f27174f68eb94f08a89'
};

const client = new line.Client(config);

// webhook
app.post('/webhook', (req, res) => {
  Promise.all(req.body.events.map(event => {
    if (event.type === 'message' && event.message.type === 'text') {
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: '你好，我是機器人 🤖'
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
