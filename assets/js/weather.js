/** Class represents the weather at a given location */
class Weather {
  /** Constructor initializes necessary properties and calls precessWeatherData method
      @param {object} location - Contains location information at a lat & lng
   */
  constructor(location) {
    console.log(location)
    this.renderWeatherData = this.renderWeatherData.bind(this);
    this.obtainWeatherData = this.obtainWeatherData.bind(this);
    this.location = {
      lat: location.geometry.location.lat(),
      lng: location.geometry.location.lng()
    }
    this.locationName = location.address_components[0].long_name;
    this.dailyWeather = {};
    this.currentWeather = {}
    this.processWeatherData();
  }

  /** @method processWeatherData
      @param none
      Queries weather data form Dark Sky API
   */
  processWeatherData() {
    const weatherData = {
      method: 'GET',
      url: `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c8c585560e5f64a47e3b64cd50e74e26/${this.location.lat},${this.location.lng}`,
      success: this.obtainWeatherData,
      error: function(error) {
        console.log(error)
      }
    }
    $.ajax(weatherData);
  }

  /** @method obtainWeatherData
      @param {object} weather - Contains pertinent weather data
   */
  obtainWeatherData(weather) {
    this.dailyWeather = weather.daily;
    this.currentWeather = weather.currently;
    this.renderWeatherData();
  }

  /** @method renderWeatherData
      @param none
      Renders all weather data to the DOM
   */
  renderWeatherData() {
    const weatherSummary = this.dailyWeather.summary;
    const weatherNow = this.currentWeather.apparentTemperature;
    const weatherIcon = this.currentWeather.icon;
    const endLocation = this.locationName;

    const summaryDiv = $('<div>', {
      class: 'places__FilterWeather-Current',
    })

    const summarySpan = $('<span>', {
      class: 'indicatorScroll',
      text: weatherSummary
    })

    const currentWeatherDiv = $('<div>', {
      class: 'places__FilterWeather-Today',
      text: weatherNow
    })

    const logoDiv = $('<div>', {
      class: 'places__FilterWeather-Logo',
      text: weatherIcon
    })

    summaryDiv.append(summarySpan);
    $('.places__FilterWeather').append(summaryDiv, currentWeatherDiv, logoDiv);
  }
}
