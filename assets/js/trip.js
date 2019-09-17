class Trip{
  constructor(locations){
    this.waypoints = [];
    this.startLocation = locations.start;
    this.endLocation = locations.end;
    this.route = new Route(locations, this.routeCallback);
  }
  routeCallback(waypoints){
    console.log(waypoints);
  }
  renderRoute(){
    this.route.render();
  }

}
