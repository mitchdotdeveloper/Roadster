class Route {
  constructor(locations, tripCallback) {
    this.startLocation = locations.start;
    this.endLocation = locations.end;
    this.startLatLng = { lat: this.startLocation.geometry.location.lat(),
                         lng: this.startLocation.geometry.location.lng() }
    this.endLatLng = { lat: this.endLocation.geometry.location.lat(),
                       lng: this.endLocation.geometry.location.lng() };

    this.waypoints = [];
    this.map = null;
    this.tripCallback = tripCallback;
  }

  onConfirm () {
    this.waypoints.unshift( this.startLocation );
    this.waypoints.push( this.endLocation );
    this.tripCallback( this.waypoints , this.map );
  }
  createLocationCard(location){
    let card = $('<div>').addClass('overlay__Card');
    let title = $('<div>').addClass('title').text(location.name);
    card.append(title);
    return card
  }
  render () {
    $('.main').empty();
    let logo = $('<div>').addClass('logo').text('ROADSTER');
    let mapContainer = $('<div>').addClass('map__Container');
    let map = $('<div>').attr('id', 'map');
    let overlay = $('<div>').addClass('map__Overlay');
    let stopHeading = $('<div>').addClass('stops').text("Your Route:")
    let addCard = $('<div>').addClass('overlay__Card').addClass('empty').html('<i class="fa fa-plus"></i>');
    overlay.append(
        stopHeading,
        this.createLocationCard(this.startLocation),
        this.createLocationCard(this.endLocation),
        addCard);
    mapContainer.append(overlay, map);
    $('.main').append(logo, mapContainer);
    this.initMap();
  }

  initMap() {
    let directionsRenderer = new google.maps.DirectionsRenderer;
    let directionsService = new google.maps.DirectionsService;
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: this.startLatLng,
      disableDefaultUI: true,
      styles: mapStyles
    });

    directionsRenderer.setMap(this.map);
    this.calculateAndDisplayRoute(directionsService, directionsRenderer);
  }

  calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService.route({
      origin: this.startLatLng,
      destination: this.endLatLng,
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
