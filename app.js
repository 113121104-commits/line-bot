const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: 'nULLzPONY/G+cg3qes3CBxsCexq6atnrCAX8I9YcgMR6snDRDGpw8cCx4um3jhysgTrtOEwTKlo0CUsoqnZyBA q+BdHTe++eGfpU8qqeC+n9Rdil+EMU8Wbta1lAezzlCUYxzBpu3EzZmE1bIvsctQdB04t89/1O/w1cDnyilFU=',
  channelSecret: '3802ab5e60a04f27174f68eb94f08a89'
};

const client = new line.Client(config);

app.post('/webhook', express.json(), async (req, res) => {

  console.log('🔥 webhook 有進來');

  const events = req.body.events || [];

  for (const event of events) {

    if (event.type !== 'message') continue;
    if (event.message.type !== 'text') continue;

    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: '你好，我是機器人 🤖'
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