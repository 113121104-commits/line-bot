const axios = require('axios');

async function askAI(question) {
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: '你是LINE機器人，回答要簡短' },
          { role: 'user', content: question }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_KEY}`
        }
      }
    );

    return res.data.choices[0].message.content;

  } catch (err) {
    return '❌ AI 目前無法使用';
  }
}

module.exports = { askAI };