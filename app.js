const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: '1GMvONrIQ4TwrHyRYUwWnl3En6ZciWbDYlrfwB7NlO4M5oGw6Ky+txjJ68PyGI7mgTrtOEwTKlo0CUsoqnZyBA q+BdHTe++eGfpU8qqeC+kX7QwjuvfQe25MtMc2+IP6mY6ROVYCE9koICCQPVaoywdB04t89/1O/w1cDnyilFU='
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

app.post('/webhook', express.json(), async (req, res) => {

  console.log('🔥 webhook 有進來');

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
  console.log('機器人啟動');
});