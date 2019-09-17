class Weather {
  constructor(location) {
    this.location = {
      lat: location.lat,
      lng: location.lng
    }
    this.dailyWeather = {};
    this.currentWeather = {}
    this.processWeatherData();
  }
  processWeatherData() {
    const weatherData = {
      method: 'GET',
      url: `https://api.darksky.net/forecast/c8c585560e5f64a47e3b64cd50e74e26/${this.location.lat},${this.location.lng}`,
      success: function(weather) {
        this.dailyWeather = weather.daily;
        this.currentWeather = weather.currently;
      },
      error: function(error) {
        console.log(error)
      }
    }
    $.ajax(weatherData);
  }
  renderWeatherData() {
    
  }
}
