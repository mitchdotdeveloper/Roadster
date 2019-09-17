$(document).ready(init)

function init(){
  $('#searchBoxGo').on('click', startTrip);
}

function startTrip(event){
  event.preventDefault();
  const startLocation = $('#searchBoxStart').val();
  const endLocation = $('#searchBoxEnd').val();
  const trip = new Trip(startLocation, endLocation);
  trip.renderRoute();
}
