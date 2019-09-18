/** Class representing the Google Map and Google Direction objects */
class Route {
  /** Constructor initializes and defines necessary properties for the
      Google Maps object & Google Directions object
      @param {object} locations - Contains autocomplete location object
      @param {callback} tripCallback - Used to pass array of location objects back to the Trip object
   */
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
    this.waypoints.unshift({ location: this.startLocation, });
    this.waypoints.push({ location: this.endLocation });
  }

  /** @method onConfirm
      @param none
      When the user has selected all locations - pass array of location objects to the Trips object
   */
  onConfirm () {
    this.tripCallback(this.waypoints , this.map );
  }

  /** @method createWaypoint
      @param {event} event - The 'plus' button that is clicked to add a waypoint
      Adds waypoint to property that contains all of the selected waypoints and renders new waypoint to the DOM
   */
  createWaypoint(event){
    let card = $(event.currentTarget).parent().parent();

    if (this.wayPointQueue !== null) {
      card.text(this.wayPointQueue.name);
      card.parent().attr('data-lat', this.wayPointQueue.geometry.location.lat());
      this.waypoints.splice(this.waypoints.length-1, 0, { location: this.wayPointQueue });
      this.wayPointQueue = null;
      this.directionsRenderer.setMap(this.map);
      this.calculateAndDisplayRoute();
    } else {
      card.parent().remove();
    }
  }

  /** @method autoComplete
      @param {object} element - Contains DOM object
      Creates autocomplete object
   */
  autoComplete(element){
    let autocomplete = new google.maps.places.Autocomplete(
      element, { types: ['geocode'] }
    );

    autocomplete.addListener('place_changed', () => {
       this.wayPointQueue = autocomplete.getPlace();
    });
  }

  /** @method createLocationCard
      @param {object} location - Contains information about givent location
      Create and append location card to the DOM
   */
  createLocationCard(location){
    let card = $('<div>').addClass('overlay__Card');
    let title = $('<div>').addClass('title');
    let form = null;
    if(location.hasOwnProperty('name')){
      title.text(location.name);
      card.attr('data-lat', location.geometry.location.lat());
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

  /** @method render
      @param none
      Display initial map and card overlay
   */
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
    cardContainer.sortable({
      stop: this.sortWaypoints,
    });
    this.createLocationCard(this.startLocation);
    this.createLocationCard(this.endLocation);
    this.initMap();
  }
  sortWaypoints(){
    // debugger;
    let cards = $('.card__Container > .overlay__Card');
    let newWaypoints = []
    for(let i = 0; i < cards.length; i++){
      for(let j = 0; j < this.waypoints.length; j++){
        if (this.waypoints[j].location.name === $(cards[i]).text()){
          let temp = this.waypoints[i];
          this.waypoints[i] = this.waypoints[j];
          this.waypoints[j] = temp;
          break;
        }
      }
    }
    this.directionsService = new google.maps.DirectionsService;
    this.directionsRenderer.setMap(this.map);
    this.calculateAndDisplayRoute();
  }

  /** @method initMap
      @param none
      Initializes Google Maps Map and Google Directions
   */
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

  /** @method calculateAndDisplayRoute
      @param none
      Calculates directions and displays route on the map
   */
  calculateAndDisplayRoute() {

    let latLngArr = [];
    for (let waypoint of this.waypoints){
      latLngArr.push(
        { location:
          { lat: waypoint.location.geometry.location.lat(),
            lng: waypoint.location.geometry.location.lng()}
          });
    }

    this.directionsService.route({
      origin: latLngArr.shift(),
      destination: latLngArr.pop(),
      waypoints: latLngArr,
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
