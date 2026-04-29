const express = require('express');
const app = express();

app.use(express.json());

// webhook
app.post('/webhook', (req, res) => {
    console.log('收到訊息:', req.body);

    // 固定回覆（先只做 log）
    res.send('OK');
});

app.get('/', (req, res) => {
    res.send('Bot is running');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('機器人啟動');
});
