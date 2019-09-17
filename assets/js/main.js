$(document).ready(init)

const state = {};

function init(){
  $('#searchBoxGo').on('click', startTrip);
}

function startTrip(event){
  event.preventDefault();
  const trip = new Trip(state);
  trip.renderRoute();
}

function initAutocomplete(element){
  let autocomplete = new google.maps.places.Autocomplete(
   element, {types: ['geocode']}
  );

  // autocomplete.setFields(['address_component']);

  autocomplete.addListener('place_changed', function(){
    state[$(element).attr('data-location')] = {
      lat: autocomplete.getPlace().geometry.location.lat(),
      lng: autocomplete.getPlace().geometry.location.lng(),
    }
  });
}

function autocompleteLoad(){
  initAutocomplete(document.querySelector('#searchBoxStart'));
  initAutocomplete(document.querySelector('#searchBoxEnd'));
}
