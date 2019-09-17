class Trip{
  constructor(startLocation, endLocation){
    this.waypoints = [];
    this.startLocation = startLocation;
    this.endLocation = endLocation
    this.route = new Route(this.startLocation, this.endLocation, this.routeCallback);
  }
  routeCallback(waypoints){
    //
  }
  renderRoute(){
    this.route.render();
  }

}
