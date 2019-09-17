class Trip{
  constructor(locations){
    this.waypoints = [];
    this.map = null;
    this.startLocation = locations.start;
    this.endLocation = locations.end;

    this.routeCallback = this.routeCallback.bind(this);
    this.placesCallback = this.placesCallback.bind(this);

    this.route = new Route(locations, this.routeCallback);
  }
  routeCallback(waypoints, map){
    this.waypoints = waypoints;
    this.map = map;
    this.places = new Place(this.map, this.waypoints[this.waypoints.length-1])
    this.renderPlaces();
  }
  renderRoute(){
    this.route.render();
  }

  placesCallback() {

  }
  renderPlaces() {
    this.places.fetchNearbyPlaces();
  }
}
