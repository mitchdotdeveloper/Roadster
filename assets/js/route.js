class Route {
  constructor(startLocation, endLocation, tripCallback) {
    this.stops = [];
    this.stops.push(startLocation, endLocation);

    this.tripCallback = tripCallback;
  }

  onConfirm () {
    this.tripCallback(this);
    // OR
    this.tripCallback(this.stops);
  }

  render () {
    $('.main').empty();
    // $('.main').append( $('<div>').addClass('map__Container') );
    // $('.map__Container').append( $('<div>').attr('id', 'map') );
    $('body').append($('<div>').attr('id', 'map'));
    $('body').after('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAGcnHGaTjPgQDfwq2MdeCJx60EqC5ud0c&callback=showMap" async defer></script>');
  }
}

var map;
function showMap () {
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom: 7,
    center: chicago
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map);
}

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function (result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
}
