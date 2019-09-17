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
    $('body').append( $('<div>').attr('id', 'map') );
    $('body').after('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAGcnHGaTjPgQDfwq2MdeCJx60EqC5ud0c&callback=showMap" async defer></script>');
  }
}

var map;
function showMap () {

  // <style>
  //   #map {
  //     height: 100%;
  // }
  //     html, body {
  //     height: 100%;
  //   margin: 0;
  //   padding: 0;
  // }
  // </style>

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });
}
