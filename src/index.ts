import express from "express";
import bodyParser from "body-parser";
import got from "got";
import { config } from "dotenv";

config();
var apiKey = `${process.env.API_KEY}`;
var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.render("index", { weather: null, error: null });
});

app.post('/', async function (req, res) {

  var city = req.body.city;
  var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  (async () => {
    try {
      var response = await got(url);
      var weather = JSON.parse(response.body);

      if (!weather.main) {
        res.render('index', { weather: null, error: 'Error, please try again' });
      }

      var weatherTemp = Math.trunc(+`${weather.main.temp}`),
        weatherFahrenheit = Math.trunc((weatherTemp * 9) / 5 + 32);

      res.render("index", {
        alexDesc: (weatherFahrenheit > 50 ? 'Perfect weather' : 'Too cold'),
        weather: weather,
        place: `${weather.name}, ${weather.sys.country}`,
        temp: Math.trunc(+`${weather.main.temp}`),
        pressure: `${weather.main.pressure}`,
        icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
        description: capitalize(`${weather.weather[0].description}`),
        timezone: `${new Date(weather.dt * 1000 - weather.timezone * 1000)}`,
        humidity: `${weather.main.humidity}`,
        fahrenheit: Math.trunc((weatherTemp * 9) / 5 + 32),
        clouds: `${weather.clouds.all}`,
        visibility: `${weather.visibility}`,
        main: `${weather.weather[0].main}`,
        error: null,
      });
    } catch (error) {
      res.render('index', { weather: null, error: 'Error, please try again' });
      console.log(error.response.body);
    }
  })();
});

app.listen(4000, () => {
  console.log(`server running on port 4000`);
});

function capitalize(text: string) {
  var words = text.split(' ');
  var capitalizedWords = [];
  words.forEach(word => {
    capitalizedWords.push(word[0].toUpperCase() + word.slice(1, word.length));
  });
  return capitalizedWords.join(' ');
}