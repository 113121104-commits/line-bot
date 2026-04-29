const express = require("express");
const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("收到訊息", req.body);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Bot 啟動");
});