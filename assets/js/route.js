class Route {
  constructor(locations, tripCallback) {
    this.startLocation = locations.start;
    this.endLocation = locations.end;
    this.startLatLng = { lat: this.startLocation.geometry.location.lat(),
                         lng: this.startLocation.geometry.location.lng() }
    this.endLatLng = { lat: this.endLocation.geometry.location.lat(),
                       lng: this.endLocation.geometry.location.lng() };

    this.waypoints = [];
    this.wayPointQueue = null;
    this.map = null;
    this.tripCallback = tripCallback;
    this.onConfirm = this.onConfirm.bind(this);
    this.createWaypoint = this.createWaypoint.bind(this)
    this.createLocationCard = this.createLocationCard.bind(this);
    this.sortWaypoints = this.sortWaypoints.bind(this);
    this.directionsRenderer = null;
    this.directionsService = null;

  }

  onConfirm () {
    this.tripCallback(this.waypoints , this.map );
  }

  createWaypoint(event){
    let card = $(event.currentTarget).parent().parent();

    if (this.wayPointQueue !== null) {
      let latLng = {
        lat: this.wayPointQueue.geometry.location.lat(),
        lng: this.wayPointQueue.geometry.location.lng(),
      }
      card.text(this.wayPointQueue.name);
      this.wayPointQueue = null;
      this.waypoints.push({ location: latLng });

      this.directionsRenderer.setMap(this.map);
      this.calculateAndDisplayRoute();
    } else {
      card.parent().remove();
    }
  }

  autoComplete(element){
    let autocomplete = new google.maps.places.Autocomplete(
      element, { types: ['geocode'] }
    );

    autocomplete.addListener('place_changed', () => {
       this.wayPointQueue = autocomplete.getPlace();
    });
  }
  createLocationCard(location){
    let card = $('<div>').addClass('overlay__Card');
    let title = $('<div>').addClass('title');
    let form = null;
    if(location.hasOwnProperty('name')){
      title.text(location.name);
    }
    else{
      form = document.createElement('input');
      form.setAttribute('type', 'text');
      title.append(
        $('<form>')
        .append($('<button>')
          .attr('type', 'submit')
          .html('<i class="fas fa-plus-circle fa-2x"></i>')
          .on('click', this.createWaypoint))
        .append($(form)
        ));
      this.autoComplete(form);
    }
    card.append(title);

    if($('.overlay__Card').length > 3){
      card
        .insertBefore('.card__Container > .overlay__Card:nth-last-child(1)')
        .on('submit', event => {
          event.preventDefault();
          $(event.currentTarget).text();
        });

    }
    else{
      card.appendTo('.card__Container');
    }

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
                        .addClass('overlay__Card add__Button')
                        .html('<i class="fa fa-plus"></i>')
                        .on('click', this.createLocationCard);

    const cardContainer = $('<div>')
                              .addClass('card__Container');

    const confirmButton = $('<div>')
                              .addClass('overlay__Card confirm')
                              .text('Confirm')
                              .on('click', this.onConfirm);

    overlay.append(
        stopHeading,
        cardContainer,
        addCard,
        confirmButton
        );

    mapContainer.append(overlay, map);
    $('.main').append(logo, mapContainer);
    // cardContainer.append(addCard);
    cardContainer.sortable({
      stop: this.sortWaypoints,
    });
    this.createLocationCard(this.startLocation);
    this.createLocationCard(this.endLocation);
    this.initMap();
  }
  sortWaypoints(){
    this.waypoints.unshift({ location: this.startLatLng });
    this.waypoints.push({ location: this.endLatLng });
    let cards = $('.card__Container > .overlay__Card');
    for(let i = 0; i < cards.length; i++){
      // swap
      if(this.waypoints[i].geometry.location.lat() === cards[i].attr('data-lat') ){
        //
      }
    }
  }
  initMap() {
    this.directionsRenderer = new google.maps.DirectionsRenderer;
    this.directionsService = new google.maps.DirectionsService;
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: this.startLatLng,
      disableDefaultUI: true,
      styles: mapStyles
    });

    this.directionsRenderer.setMap(this.map);
    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.startLatLng,
      destination: this.endLatLng,
      waypoints: this.waypoints,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status == 'OK') {
        this.directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
}
