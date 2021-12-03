import express from "express";
import bodyParser from "body-parser";
import got from "got";
import { config } from "dotenv";

config();
const apiKey = `${process.env.API_KEY}`;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.render("index", { weather: null, error: null });
});

app.post('/', async function (req, res) {

  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  (async () => {
    try {
      const response = await got(url);
      const weather = JSON.parse(response.body);

      if (weather.main == undefined) {
        res.render('index', { weather: null, error: 'Error, please try again' });
      } else {
        let place = `${weather.name}, ${weather.sys.country}`,
          weatherTimezone = `${new Date(weather.dt * 1000 - weather.timezone * 1000)}`,
          weatherTemp: number = +`${weather.main.temp}`,
          weatherPressure = `${weather.main.pressure}`,
          weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          weatherDescription = `${weather.weather[0].description}`,
          humidity = `${weather.main.humidity}`,
          clouds = `${weather.clouds.all}`,
          visibility = `${weather.visibility}`,
          main = `${weather.weather[0].main}`,
          weatherFahrenheit: number = (weatherTemp * 9) / 5 + 32;

        res.render("index", {
          weather: weather,
          place: place,
          temp: weatherTemp,
          pressure: weatherPressure,
          icon: weatherIcon,
          description: weatherDescription,
          timezone: weatherTimezone,
          humidity: humidity,
          fahrenheit: weatherFahrenheit,
          clouds: clouds,
          visibility: visibility,
          main: main,
          error: null,
        });
      }
    } catch (error) {
      res.render('index', { weather: null, error: 'Error, please try again' });
      console.log(error.response.body);
    }
  })();
});

app.listen(4000, () => {
  console.log(`server running on port 4000`);
});