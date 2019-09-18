/** Class representing places in a given area */
class Place {
/** Constructor stores arguments and creates Google Places object
    @param {object} mapObject - The Google Maps Map object
    @param {object} waypointsArray - An array containing objects containing location information on a place
    @param {callback} tripCallback - Used to pass array of places back to the Trip object
 */
  constructor(mapObject, waypointsArray, tripCallback) {
    //Store data
    this.mapObject = mapObject;
    this.waypointsArray = waypointsArray;
    this.tripCallback = tripCallback;
    this.currentWaypoint = null;
    this.selectedPlaces = [];

    //Create Google Places Service object
    this.placesServiceObj = new google.maps.places.PlacesService(this.mapObject);

    //Bind methods
    this.addResultsToList = this.addResultsToList.bind(this);
    this.accordionClickHandler = this.accordionClickHandler.bind(this);
    this.placeResultClickHandler = this.placeResultClickHandler.bind(this);

    //Delete this section
    console.log('New Place obj created:', this, this.waypointsArray);
  }

  /** @method onConfirm
      @param none
      Passes selected places back to Trip object
   */
  onConfirm() {
    this.tripCallback(this.selectedPlaces);
  }

/** @method fetchNearbyPlaces
    @param none
    Finds nearby places to the given location
 */
  fetchNearbyPlaces(waypoint = this.waypointsArray[1], placeType = 'restaurant') {
    this.currentWaypoint = waypoint;
    this.currentWaypoint.fetchedData = true;
    const radius = '15000';
    const validPlaceTypes = ['restaurant', 'lodging', 'natural_feature'];
    if (!validPlaceTypes.includes(placeType)) {
      return false;
    }

    //Create Google Places Location & Request objects
    const locationDataPromise = new Promise((resolve, reject) => {
      console.log('Getting location values now');
      let currentStopLocationData = {
        name: waypoint.location.name,
        lat: waypoint.location.geometry.location.lat(),
        lng: waypoint.location.geometry.location.lng()
      };
      resolve(currentStopLocationData);
    });

    locationDataPromise.then((currentStopLocationData) => {
      console.log('After getting location values');
      let locationObjToSearch = new google.maps.LatLng(currentStopLocationData.lat, currentStopLocationData.lng);
      let request = {
        location: locationObjToSearch,
        radius: radius,
        type: [placeType]
      };

      //Delete this section
      console.log('fetchNearbyPlaces:', locationObjToSearch, request, arguments, currentStopLocationData);

      //Searches for places within 15km of location, passes array of search results to callback function
      this.placesServiceObj.nearbySearch(request, this.addResultsToList);
    });
  }

  /** @method addResultsToList
      @param {array} searchResults - Array of place objects
      @param {string} searchStatus - Contains the status of the previous search
      @returns {boolean} false - If searchStatus !== 'OK'
   */
  addResultsToList(searchResults, searchStatus) {
    if (searchStatus !== 'OK') {
      return false;
    }
    for (let resultIndex = 0; resultIndex < 8; resultIndex++) {
      this.fetchInfoForSearchResult(searchResults[resultIndex]);
    }
  }

  /** @method fetchInfoForSearchResult
      @param {object} searchResult - Contains Google Place object
      Fetches additional data about the Google Place object and appends it to the DOM
   */
  fetchInfoForSearchResult(searchResult) {
    let placeListItem = $('<div>').addClass('places__ListItem');
    let searchResultData = {};
    let request = {
      placeId: searchResult.place_id,
      fields: ['name', 'place_id', 'formatted_address', 'geometry',
        'url', 'types', 'photos', 'rating', 'user_ratings_total', 'price_level']
    };
    this.placesServiceObj.getDetails(request, function(place, status) {
      console.log('Detailed search status:', status);
      if (status !== 'OK') {
        return false;
      }
      for (let field of request.fields) {
        searchResultData[field] = place[field];
      }

      placeListItem.append($('<div>').addClass('places__ListItem-Name').text(searchResultData.name));
      placeListItem.append($('<div>').addClass('places__ListItem-Address').text(searchResultData.formatted_address));
      placeListItem.append($('<div>').addClass('places__ListItem-Rating').text(`${searchResultData.rating} out of 5 stars (${searchResultData.user_ratings_total} reviews)`));
    });

    $('#places__AccordionContainer' + (this.waypointsArray.indexOf(this.currentWaypoint))).append(placeListItem);

    //Delete this section
    console.log('fetchingInfoForSearchResult:', searchResultData);
  }

  /** @method renderPlacesPage
      @param none
      Appends the Places HTML structure to the DOM
   */
  renderPlacesPage() {
    let accordionElements = '';
    for (let stopIndex = 1; stopIndex < this.waypointsArray.length; stopIndex++) {
      let individualAccordion = `
      <h1 class="places__Accordion-Name" id="places__Accordion-Name${stopIndex}">
        <span class="places__Accordion-Weather" id="places__Accordion-Weather${stopIndex}"></span>
      </h1>
      <div class="places__AccordionContainer" id="places__AccordionContainer${stopIndex}"></div>
      `;
      accordionElements += individualAccordion;
    }

    const placesDOM = $(`
      <div class="places__Container">
        <div class="places__LogoContainer">
          <h2 class="interstate-bold">ROADSTER</h2>
        </div>
        <div class="places__ListContainer">
          <div class="places__ListContainer-Accordion interstate-light" id="accordion">
            ${accordionElements}
          </div>
        </div>
        <div class="places__Confirm">
          <button class="btn btn--green">Confirm</button>
        </div>
      </div>
    `);
    $('.main').empty().append(placesDOM);
    this.addClickHandlers();
  }

  addClickHandlers() {
    $('.places__Accordion-Name').on('click', this.accordionClickHandler);
    $('#accordion').on('click', '.places__ListItem', this.placeResultClickHandler);
  }

  accordionClickHandler(event) {
    let clickedWaypointIndex = $(event.currentTarget).attr('id').slice(-1);
    if (this.waypointsArray[clickedWaypointIndex].fetchedData) {
      return false;
    }
    this.fetchNearbyPlaces(this.waypointsArray[clickedWaypointIndex], 'restaurant');
  }

  placeResultClickHandler(event) {
    $(event.currentTarget).toggleClass('selected');
  }

}
