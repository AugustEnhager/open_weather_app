import React, { Component } from "react";
import axios from "axios";
import { Item, Header, List } from "semantic-ui-react";
import { Line } from "react-chartjs-2";

export class App extends Component {
  state = {
    location: {},
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let { latitude, longitude } = position.coords;
      const cageKey = "62ec85f74ac844b6a9b671b840175735";
      const weatherKey = "c1d9dbe5c0dfaac680ddbc9e7a19e334";
      const locationResponse = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${cageKey}`
      );
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherKey}`
      );
      this.setState({ dailyTemp: weatherResponse.data.daily });

      // const locationResponse = await axios({
      //   method: "GET",
      //   url: `https://api.opencagedata.com/geocode/v1/json`,
      //   params: { key: cageKey, q: `${latitude}+${longitude}` },
      // });
      // const weatherResponse = await axios.get({
      //   method: "GET",
      //   url: 'https://api.openweathermap.org/data/2.5/onecall?units=metric',
      //   params: { appid: weatherKey, lat: `${latitude}`, long: `${longitude}`}
      // });

      const weatherInfo = {
        city: locationResponse.data.results[0].components.postal_city,
        temp: weatherResponse.data.current.temp,
        humidity: weatherResponse.data.current.humidity,
        windspeed: weatherResponse.data.current.wind_speed,
        weather: weatherResponse.data.current.weather[0].main,
      };

      debugger;

      this.setState({ location: weatherInfo });
    });
  }

  render() {
    const { location, dailyTemp } = this.state;
    let labels = [];
    let dataItems = [];
    let data;
    if (dailyTemp) {
      dailyTemp.forEach((day) => {
        labels.push(new Date(day.dt * 1000).toLocaleDateString());
        dataItems.push(day.temp.day);
      });
      data = {
        labels: labels,
        datasets: [{ label: "Daily Temp", data: dataItems }],
      };
    }

    const temp = this.state.location.temp;
    const city = this.state.location.city;
    const humidity = this.state.location.humidity;
    const windspeed = this.state.location.windspeed;
    const weather = this.state.location.weather;

    return (
      <div>
        <Header data-testid="header">Welcome to Weather App 3000</Header>
        <div data-cy="weather-display">
          <div class="ui relaxed divided list">
            <div class="item">
              <i class="large world middle aligned icon"></i>
              <div class="content">
                <a class="header">Location</a>
                <div class="description">{city}</div>
              </div>
            </div>
            <div class="item">
              <i class="large fire middle aligned icon"></i>
              <div class="content">
                <a class="header">Temperature</a>
                <div class="description">{temp}°C</div>
              </div>
            </div>
            <div class="item">
              <i class="large angle double right middle aligned icon"></i>
              <div class="content">
                <a class="header">Windspeed</a>
                <div class="description">{windspeed}m/s</div>
              </div>
            </div>
          
            <div class="item">
              <i class="large tint middle aligned icon"></i>
              <div class="content">
                <a class="header">Humidity</a>
                <div class="description">{humidity}</div>
              </div>
            </div>
            <div class="item">
              <i class="large cloud middle aligned icon"></i>
              <div class="content">
                <a class="header">Weather</a>
                <div class="description">{weather}</div>
              </div>
            </div>
          </div>

          <Line data={data} />
        </div>
      </div>
    );
  }
}

export default App;
