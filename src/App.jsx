import React, { Component } from "react";
import axios from "axios";
import { Item } from "semantic-ui-react";
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

      debugger
     
      this.setState({ location: weatherInfo });
    });
  }

  render() {
    const { location, dailyTemp} = this.state
    let labels = []
    let dataItems = []
    let data
    if(dailyTemp) {
      dailyTemp.forEach(day => {       
        labels.push(new Date(day.dt * 1000).toLocaleDateString())
        dataItems.push(day.temp.day)
      })
      data = { labels: labels, datasets: [{ label: "Daily Temp", data: dataItems}]}
    }




    const temp = this.state.location.temp;
    const city = this.state.location.city;
    const humidity = this.state.location.humidity;
    const windspeed = this.state.location.windspeed;
    const weather = this.state.location.weather;

    return (
      <div>
        <h1 data-testid="header">Welcome to Weather App 3000</h1>
        <div data-cy="weather-display">
          <div data-cy="location">Location: {city} </div>
          <div data-cy="temp">Temperature: {temp}°C</div>
          <div data-cy="humidity">Humidity: {humidity}%</div>
          <div data-cy="windspeed">Windspeed: {windspeed}m/s </div>
          <div data-cy="weather"> Weather: {weather}</div>
          <Line data={data}/>
        </div>
      </div>
    );
  }
}

export default App;