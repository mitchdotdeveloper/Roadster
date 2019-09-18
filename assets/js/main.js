/** @method $
    @param {document} document
    @method ready
    @param {callback} init
    Calls given callback function when document is loaded
 */
$(document).ready(init)

/** @constant
    @type {string}
    @default
    Holds the start and end destination autocomplete object
 */
const state = {
  start: null,
  end: null
};

/** @function init
    @param none
    Add a click handler to DOM button '#searchBoxGo'
*/
function init(){
  $('#searchBoxGo').on('click', startTrip);
  $('#accordion').accordion({
    heightStyle: 'fill',
    animate: {
      easing: 'linear',
      duration: 100
    }
  });
}
let trip;

/** @function startTrip
    @param {event} event
    Limits input and creates a Trip object and renders the map
 */
function startTrip(event){
  if (!state.start || !state.end) return;
  event.preventDefault();
  trip = new Trip(state);
  trip.renderRoute();
}

/** @function initAutoComplete
    @param {element} element
    Creates autocomplete object and adds it to the global state object
 */
function initAutocomplete(element){
  let autocomplete = new google.maps.places.Autocomplete(
   element, {types: ['geocode']}
  );

  autocomplete.addListener('place_changed', () => {
    state[$(element).attr('data-location')] = autocomplete.getPlace();
  });
}

/** @function autocompleteLoad
    @param none
    Initializes auto complete functionality on the two input boxes
    '#searchBoxStart' & '#searchBoxEnd'
 */
function autocompleteLoad(){
  initAutocomplete(document.querySelector('#searchBoxStart'));
  initAutocomplete(document.querySelector('#searchBoxEnd'));
}
