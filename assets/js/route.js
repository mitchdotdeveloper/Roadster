class Route {
  constructor(startLocation, endLocation, tripCallback) {
    this.startLocation = startLocation;
    this.endLocation = endLocation;
    this.waypoints = [];
    this.waypoints.push(startLocation, endLocation);
    this.map = null;

    this.tripCallback = tripCallback;
  }

  onConfirm () {
    this.waypoints.unshift( this.startLocation );
    this.waypoints.push( this.endLocation );
    this.tripCallback( this.stops );
  }

  render () {
    $('.main').empty();
    // $('.main').append( $('<div>').addClass('map__Container') );
    // $('.map__Container').append( $('<div>').attr('id', 'map') );
    $('body').append($('<div>').attr('id', 'map'));
    this.initMap();
  }

  initMap() {
    let directionsRenderer = new google.maps.DirectionsRenderer;
    let directionsService = new google.maps.DirectionsService;

    if (!this.startLocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.startLocation = {'lat': pos.coords.latitude, 'long': pos.coords.longitude}
          this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: { lat: this.startLocation.lat, lng: this.startLocation.long }
          });
          directionsRenderer.setMap(this.map);
          this.calculateAndDisplayRoute(directionsService, directionsRenderer);
        },
        err => console.warn(`ERROR (${err.code}): ${err.message}`),
        {enableHighAccuracy: true} );
    } else {
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: this.startLocation.lat, lng: this.startLocation.long }
      });

      directionsRenderer.setMap(this.map);
      this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    }
  }

  calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService.route({
      origin: typeof this.startLocation === 'string' ? this.startLocation : {lat: this.startLocation.lat, lng: this.startLocation.long},
      destination: this.endLocation || 'LearningFuze',
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status == 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
}
