const axios = require('axios');

exports.getWeather = async (city) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric&lang=zh_tw`;

    const res = await axios.get(url);

    return `${city}
🌡️ ${res.data.main.temp}°C
🌤️ ${res.data.weather[0].description}`;

  } catch {
    return '查不到天氣 ❌';
  }
};