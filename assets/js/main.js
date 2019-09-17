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

function initAutocomplete(element){
  let autocomplete = new google.maps.places.Autocomplete(
   element, {types: ['geocode']}
  );

  autocomplete.setFields(['address_component']);

  autocomplete.addListener('place_changed', ()=>{
    console.log('place_changed');
  });
}

function autocompleteLoad(){
  initAutocomplete(document.querySelector('#searchBoxStart'));
  initAutocomplete(document.querySelector('#searchBoxEnd'));
}
