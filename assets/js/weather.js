/** Class represents the weather at a given location */
/** Constructor initializes necessary properties and calls precessWeatherData method
      @param {Array} location - Contains location information from all the stops to final destination
   */
class Weather {
  constructor(locationArray) {
    this.renderWeatherData = this.renderWeatherData.bind(this);

    this.locationArray = locationArray;
    console.log(this.locationArray);
    this.currentIndex = 1;
    this.dailyWeather = {};
    this.currentWeather = {}
    this.processWeatherData();
  }

  /** @method processWeatherData
      @param none
      Queries weather data form Dark Sky API
   */
  processWeatherData() {
    let locationLat = this.locationArray[this.currentIndex].location.geometry.location.lat();
    let locationLng = this.locationArray[this.currentIndex].location.geometry.location.lng();

    const weatherData = {
      method: 'GET',
      url: `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c8c585560e5f64a47e3b64cd50e74e26/${locationLat},${locationLng}`,
      success: (weather) => {
        const locationName = this.locationArray[this.currentIndex].location.formatted_address.split(',')[0];
        $(`#places__Accordion-Weather${this.currentIndex}`).before(locationName);
        this.dailyWeather = weather.daily;
        this.currentWeather = weather.currently;
        this.renderWeatherData();
        this.currentIndex++;
        if (this.locationArray[this.currentIndex]) {
          this.processWeatherData();
        }
      },
      error: function (error) {
        alert(error);
      }
    }
    $.ajax(weatherData);

  }
  /** @method renderWeatherData
      @param none
      Renders all weather data to the DOM
   */
  renderWeatherData() {
    const weatherNow = this.currentWeather.apparentTemperature;
    const weatherIcon = this.currentWeather.icon;
    const summary = this.dailyWeather.summary;

    let weatherForecastDiv = $('<div>', {
      class: 'places__ListWeather'
    })

    let weatherLogo = null;

    switch (weatherIcon) {
      case 'clear-day':
        weatherLogo = $('<i>').addClass('wi wi-day-sunny weatherIcon');
        break;
      case 'clear-night':
        weatherLogo = $('<i>').addClass('wi wi-night-clear weatherIcon');
        break;
      case 'rain':
        weatherLogo = $('<i>').addClass('wi wi-raindrop weatherIcon');
        break;
      case 'snow':
        weatherLogo = $('<i>').addClass('wi wi-snow weatherIcon');
        break;
      case 'sleet':
        weatherLogo = $('<i>').addClass('wi wi-sleet weatherIcon');
        break;
      case 'wind':
        weatherLogo = $('<i>').addClass('wi wi-windy weatherIcon');
        break;
      case 'fog':
        weatherLogo = $('<i>').addClass('wi wi-fog weatherIcon');
        break;
      case 'cloud':
        weatherLogo = $('<i>').addClass('wi wi-cloudy weatherIcon');
        break;
      case 'partly-cloudy-day':
        weatherLogo = $('<i>').addClass('wi wi-day-cloudy weatherIcon');
        break;
      case 'partly-cloudy-night':
        weatherLogo = $('<i>').addClass('wi wi-night-partly-cloudy weatherIcon');
        break;
      default:
        weatherLogo = $('<i>').addClass('wi wi-na weatherIcon');
        break;
    }
    $(`#places__AccordionContainer${this.currentIndex}`).prepend(weatherForecastDiv);
    weatherForecastDiv.text(summary);
    $(`#places__Accordion-Name${this.currentIndex}`).append(weatherLogo);
    $(`#places__Accordion-Weather${this.currentIndex}`).text(`Current Weather: ${weatherNow}`).append('\u2109');
  }
}
