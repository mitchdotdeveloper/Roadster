/** Class representing the trip as a whole throughout the application */
class Trip{
  /** Constructor creates necessary properties and creates/renders Route object
      @param {object} locations - Contains start and end locations
   */
  constructor(locations){
    this.waypoints = [];
    this.map = null;
    this.startLocation = locations.start;
    this.endLocation = locations.end;

    this.routeCallback = this.routeCallback.bind(this);
    this.placesCallback = this.placesCallback.bind(this);

    this.route = new Route(locations, this.routeCallback);
    this.renderRoute();
  }

  /** @method routeCallback
      @param {array} waypoints - Contains waypoint objects
      @param {object} map - Google Maps Map object
      Creates Places & Weather objects and renders places
   */
  routeCallback(waypoints, map){
    this.waypoints = waypoints;
    this.map = map;
    this.places = new Place(this.map, this.waypoints[this.waypoints.length-1], this.placesCallback);
    this.weather = new Weather(this.waypoints[this.waypoints.length-1]);
    this.renderPlaces();
  }

  /** @method renderRoute
      @param none
      Calls render method on route object
   */
  renderRoute(){
    this.route.render();
  }

  /** @method placesCallback
      @param none
   */
  placesCallback() {

  }

  /** @method renderPlaces
      @param none
      Calls fetchNearbyPlaces & renderPlacesPage methods on places object
   */
  renderPlaces() {
    this.places.fetchNearbyPlaces();
    this.places.renderPlacesPage();
  }
  // renderWeather() {
  //   this.weather.processWeatherData();
  // }
}
