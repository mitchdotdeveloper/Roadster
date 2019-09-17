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
    this.onConfirm = this.onConfirm.bind(this);

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
    const logo = $('<div>').addClass('logo').text('ROADSTER');
    const mapContainer = $('<div>').addClass('map__Container');
    const map = $('<div>').attr('id', 'map');
    const overlay = $('<div>').addClass('map__Overlay');

    const stopHeading = $('<div>')
                            .addClass('stops')
                            .text("Your Route:");

    const addCard = $('<div>')
                        .addClass('overlay__Card empty')
                        .html('<i class="fa fa-plus"></i>');

    const cardContainer = $('<div>')
                              .addClass('card__Container');

    const confirmButton = $('<div>')
                              .addClass('overlay__Card confirm')
                              .text('Confirm')
                              .on('click', this.onConfirm);
    cardContainer.append(
      this.createLocationCard(this.startLocation),
      this.createLocationCard(this.endLocation),
      addCard);
    overlay.append(
        stopHeading,
        cardContainer,
        confirmButton
        );

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
