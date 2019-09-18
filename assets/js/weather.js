class Weather {
  constructor(locationArray) {
    this.locationArray = locationArray;
    console.log(this.locationArray);
    this.renderWeatherData = this.renderWeatherData.bind(this);
    this.obtainWeatherData = this.obtainWeatherData.bind(this);
    this.location = [];
    this.currentIndex = 1;
    this.dailyWeather = {};
    this.currentWeather = {}
    this.processWeatherData();
  }
  processWeatherData() {
    console.log(this.locationArray);
    let locationLat = this.locationArray[this.currentIndex].geometry.location.lat();
    let locationLng = this.locationArray[this.currentIndex].geometry.location.lng();
    const weatherData = {
      method: 'GET',
      url: `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c8c585560e5f64a47e3b64cd50e74e26/${locationLat},${locationLng}`,
      success: (weather)=>{
        this.dailyWeather = weather.daily;
        this.currentWeather = weather.currently;
        this.renderWeatherData();
        this.currentIndex++;
        if(this.locationArray[this.currentIndex]){
          this.processWeatherData();
        }
      },
      error: function (error) {
        console.log(error)
      }
    }
    $.ajax(weatherData);
  }
  obtainWeatherData(weather) {
    this.renderWeatherData();
  }
  renderWeatherData() {
    console.log(this.dailyWeather);
    console.log(this.currentWeather);
    const weatherSummary = this.dailyWeather.summary;
    const weatherNow = this.currentWeather.apparentTemperature;
    const weatherIcon = this.currentWeather.icon;
    let weatherLogo = null;
    const locationName = this.locationArray[this.currentIndex].address_components[0].long_name;

    // const summaryDiv = $('<div>', {
    //   class: 'places__FilterWeather-Current',
    // })

    // const summarySpan = $('<span>', {
    //   class: 'indicatorScroll',
    //   text: weatherSummary
    // })

    // const currentWeatherDiv = $('<div>', {
    //   class: 'places__FilterWeather-Today',
    //   text: weatherNow
    // })

    // const logoDiv = $('<div>', {
    //   class: 'places__FilterWeather-Logo',
    //   text: weatherIcon
    // })

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
    $(`#places__Accordion-Name${this.currentIndex}`).text(locationName).append(weatherLogo);
    $(`#places__Accordion-Weather${this.currentIndex}`).text(`Current Weather: ${weatherNow} &#8457;`);
    // summaryDiv.append(summarySpan);
    // $('.places__FilterWeather').append(summaryDiv, currentWeatherDiv, logoDiv);
  }
}
