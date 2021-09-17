import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

const App = () => {

  const [location, setLocation] = useState({});
  const [graph, setGraph] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  let labels = [];
  let dataItems = [];
  let data;

  const fetchData = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let { latitude, longitude } = position.coords;
      const cageKey = "62ec85f74ac844b6a9b671b840175735";
      const weatherKey = "c1d9dbe5c0dfaac680ddbc9e7a19e334";

      const locationResponse = await axios({
        method: "GET",
        url: `https://api.opencagedata.com/geocode/v1/json`,
        params: { key: cageKey, q: `${latitude}+${longitude}` },
      });
      const weatherResponse = await axios({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/onecall`,
        params: {
          appid: weatherKey,
          lat: `${latitude}`,
          lon: `${longitude}`,
          units: "metric",
        },
      });

      let weatherInfo = {
        city: locationResponse.data.results[0].components.postal_city,
        temp: weatherResponse.data.current.temp,
        humidity: weatherResponse.data.current.humidity,
        windspeed: weatherResponse.data.current.wind_speed,
        weather: weatherResponse.data.current.weather[0].main,
      };

      setLocation(weatherInfo);

      if (weatherResponse.data.daily) {
        let dailyTemp = weatherResponse.data.daily;
        dailyTemp.forEach((day) => {
          labels.push(new Date(day.dt * 1000).toLocaleDateString());
          dataItems.push(day.temp.day);
        });
        data = {
          labels: labels,
          datasets: [
            {
              label: "Daily Temperature °C",
              data: dataItems,
              borderColor: "rgba(0, 128, 128, 0.6)",
              tension: 0.1,
            },
          ],
        };

        setGraph(data);
      }
    });
  };

  
  return (
    <div>
      <div data-testid="header" class="ui huge center aligned header teal">
        Welcome to Weather App 3000
      </div>
      <div class="ui grid">
        <div class="four wide column">
          <div data-cy="weather-display">
            <div class="ui relaxed divided list">
              <div class="item">
                <i class></i>
                <div class="content">
                  <a class="header"></a>
                  <div class="description"></div>
                </div>
              </div>
              <div class="item">
                <i class="large world middle aligned icon green"></i>
                <div class="content">
                  <a class="header">Location</a>
                  <div data-cy="location">{location.city}</div>
                </div>
              </div>
              <div class="item">
                <i class="large fire middle aligned icon red"></i>
                <div class="content">
                  <a class="header">Temperature</a>
                  <div data-cy="temp">{location.temp}°C</div>
                </div>
              </div>
              <div class="item">
                <i class="large angle double right middle aligned icon"></i>
                <div class="content">
                  <a class="header">Windspeed</a>
                  <div data-cy="windspeed">{location.windspeed}m/s</div>
                </div>
              </div>

              <div class="item">
                <i class="large tint middle aligned icon blue"></i>
                <div class="content">
                  <a class="header">Humidity</a>
                  <div data-cy="humidity">{location.humidity}%</div>
                </div>
              </div>
              <div class="item">
                <i class="large cloud middle aligned icon grey"></i>
                <div class="content">
                  <a class="header">Weather</a>
                  <div data-cy="weather">{location.weather}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="twelve wide column">
          <Line data={graph} />
        </div>
      </div>
    </div>
  );
};

export default App;