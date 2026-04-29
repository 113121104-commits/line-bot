const axios = require('axios');

async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric&lang=zh_tw`;

    const res = await axios.get(url);
    const data = res.data;

    return `${city}
🌡️ 溫度：${data.main.temp}°C
🌤️ 天氣：${data.weather[0].description}`;

  } catch (err) {
    return '❌ 查不到這個城市';
  }
}

module.exports = { getWeather };