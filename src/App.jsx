import axios from 'axios'
import React, { Component } from 'react'

export class App extends Component {
  state = {
    geolocation: {}
  }
  
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(async position => {
      
      let { latitude, longitude } = position.coords
      let locationResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=62ec85f74ac844b6a9b671b840175735`)
      let weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=c1d9dbe5c0dfaac680ddbc9e7a19e3341`)
      debugger
    })
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}

export default App
