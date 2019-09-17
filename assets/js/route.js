class Route {
  constructor(locations, tripCallback) {
    this.startLocation = locations.start;
    this.endLocation = locations.end;

    this.startLatLng = {
      lat: this.startLocation.geometry.location.lat(),
      lng: this.startLocation.geometry.location.lng(),
    }

    this.endLatLng = {
      lat: this.endLocation.geometry.location.lat(),
      lng: this.endLocation.geometry.location.lng(),
    }

    this.waypoints = [];
    this.waypoints.push(this.startLatLng, this.endLatLng);
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
    let mapContainer = $('<div>').addClass('map__Container');
    let map = $('<div>').attr('id', 'map');
    let overlay = $('<div>').addClass('map__Overlay');
    let startLocation = $('<div>').addClass('overlay__Card');
    let endLocation = $('<div>').addClass('overlay__Card');
    mapContainer.append(overlay, map);
    $('.main').append(mapContainer);
    this.initMap();
  }

  initMap() {
    let directionsRenderer = new google.maps.DirectionsRenderer;
    let directionsService = new google.maps.DirectionsService;

    if (!this.startLatLng) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.startLatLng = {'lat': pos.coords.latitude, 'lng': pos.coords.longitude}
          this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: this.startLatLng,
            disableDefaultUI: true,
            style: mapStyles
          });
          directionsRenderer.setMap(this.map);
          this.calculateAndDisplayRoute(directionsService, directionsRenderer);
        },
        err => console.warn(`ERROR (${err.code}): ${err.message}`),
        {enableHighAccuracy: true} );
    } else {
      console.log(this.startLatLng)
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: this.startLatLng,
        disableDefaultUI: true,
        styles: mapStyles
      });

      directionsRenderer.setMap(this.map);
      this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    }
  }

  calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService.route({
      origin: this.startLatLng,
      destination: this.endLatLng || 'LearningFuze',
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
