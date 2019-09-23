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
    this.onConfirm = this.onConfirm.bind(this);
    this.addResultsToList = this.addResultsToList.bind(this);
    this.accordionClickHandler = this.accordionClickHandler.bind(this);
    this.placeResultClickHandler = this.placeResultClickHandler.bind(this);
  }

  /** @method onConfirm
      @param none
      Passes selected places back to Trip object
   */
  onConfirm() {
    let selectedPlacesObj = document.querySelectorAll('.selected');
    for (let waypointIndex = 1; waypointIndex < this.waypointsArray.length; waypointIndex++) {
      let currentSelection = {
        waypointName: this.waypointsArray[waypointIndex].location.name,
        waypointSelectedPlaces: []
      };
      for (let selectionIndex = 0; selectionIndex < selectedPlacesObj.length; selectionIndex++) {
        if (selectedPlacesObj[selectionIndex].parentElement.previousElementSibling.innerText.includes(currentSelection.waypointName)) {
          currentSelection.waypointSelectedPlaces.push(selectedPlacesObj[selectionIndex].firstElementChild.nextElementSibling.firstElementChild.innerText);
        }
      }
      this.selectedPlaces.push(currentSelection);
    }
    this.selectedPlaces.unshift({ waypointName: this.waypointsArray[0].location.name, waypointSelectedPlaces: [] });
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
      let currentStopLocationData = {
        name: waypoint.location.name,
        lat: waypoint.location.geometry.location.lat(),
        lng: waypoint.location.geometry.location.lng()
      };
      resolve(currentStopLocationData);
    });

    locationDataPromise.then((currentStopLocationData) => {
      let locationObjToSearch = new google.maps.LatLng(currentStopLocationData.lat, currentStopLocationData.lng);
      let request = {
        location: locationObjToSearch,
        radius: radius,
        type: [placeType]
      };
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
    for (let resultIndex = 0; resultIndex < 7; resultIndex++) {
      this.fetchInfoForSearchResult(searchResults[resultIndex]);
    }
  }

  /** @method fetchInfoForSearchResult
      @param {object} searchResult - Contains Google Place object
      Fetches additional data about the Google Place object
   */
  fetchInfoForSearchResult(searchResult) {
    let searchResultData = {};
    let request = {
      placeId: searchResult.place_id,
      fields: ['name', 'place_id', 'formatted_address', 'geometry',
        'url', 'types', 'photos', 'rating', 'user_ratings_total', 'price_level']
    };
    this.placesServiceObj.getDetails(request, function(place, status) {
      if (status !== 'OK') {
        return false;
      }
      for (let field of request.fields) {
        searchResultData[field] = place[field];
      }
      trip.places.renderPlaceResultBox(searchResultData);
    });
  }

  /** @method renderPlaceResultBox
      @param {object} searchResultData - Contains Google Place object data
      Appends additional data about the Google Place search result to the DOM
  */
  renderPlaceResultBox(searchResultData) {
    let placeListItem = $('<div>').addClass('places__ListItem');

    placeListItem.append($('<img>').addClass('places__ListItem-Photo').attr('src', searchResultData.photos[0].getUrl()));

    let nameField = $('<div>').addClass('places__ListItem-Name');
    nameField.append($('<a>').attr({ 'href': searchResultData.url, 'target': '_blank' }).text(searchResultData.name));
    placeListItem.append(nameField);

    placeListItem.append($('<div>').addClass('places__ListItem-Address').text(searchResultData.formatted_address));

    let ratingElementsContainer = $('<div>').addClass('places__ListItem-Rating');
    let priceLevelDisplay = $('<span>').text('Price Level: ' + this.showPriceLevel(searchResultData.price_level));
    ratingElementsContainer.append(priceLevelDisplay);
    let starRatingDisplay = this.showStarRating(searchResultData.rating, searchResultData.user_ratings_total);
    ratingElementsContainer.append(starRatingDisplay);
    placeListItem.append(ratingElementsContainer);

    $('#places__AccordionContainer' + (this.waypointsArray.indexOf(this.currentWaypoint))).append(placeListItem);
  }

  /** @method showPriceLevel
      @param {number} priceLevel - price level number between 0 and 4
      @returns {string} priceLevelString - String for displaying price level
      Creates string for price level indicator based on Google Place price data
  */
  showPriceLevel(priceLevel = 0) {
    let priceLevelString = '';
    for (let dollarSigns = 0; dollarSigns < priceLevel; dollarSigns++) {
      priceLevelString += '$';
    }
    for (let dashes = 0; dashes < (4 - priceLevel); dashes++) {
      priceLevelString += '-';
    }
    return priceLevelString;
  }

  /** @method showStarRating
      @param {number} rating - rating between 0.0 and 5.0
      @param {number} userRatingsTotal - number of total reviews on Google Places
      @returns {object} starRatingContainer - DOM elements for displaying 5 star rating icons
      Renders DOM elements for 5 star rating icons based on Google Place rating
  */
  showStarRating(rating, userRatingsTotal) {
    let roundedRating = Math.round(rating * 2) / 2;
    let starRatingContainer = $('<div>').addClass('places__RatingContainer');
    let filledStars = Math.floor(roundedRating);
    let halfStars = null;
    if (Number.isInteger(roundedRating)) {
      halfStars = 0;
    } else {
      halfStars = 1;
    }
    let emptyStars = 5 - (filledStars + halfStars);
    while (filledStars > 0) {
      starRatingContainer.append($('<i>').addClass('fas fa-star'));
      filledStars--;
    }
    if (halfStars) {
      starRatingContainer.append($('<i>').addClass('fas fa-star-half-alt'));
    }
    while (emptyStars > 0) {
      starRatingContainer.append($('<i>').addClass('far fa-star'));
      emptyStars--;
    }
    starRatingContainer.append(`&nbsp;${rating}/5 stars (${userRatingsTotal} reviews)`);
    return starRatingContainer;
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

  /** @method addClickHandlers
      @param none
      Attaches click handlers to DOM elements on Places page
  */
  addClickHandlers() {
    $('.places__Confirm').on('click', this.onConfirm);
    $('.places__Accordion-Name').on('click', this.accordionClickHandler);
    $('#accordion').on('click', '.places__ListItem', this.placeResultClickHandler);
  }

  /** @method accordionClickHandler
      @param {object} event - Event object for clicked accordion heading
      @returns {boolean} false - If search data was already fetched
      When clicking on an accordion heading, find places search results near that stop
  */
  accordionClickHandler(event) {
    let clickedWaypointIndex = $(event.currentTarget).attr('id').slice(-1);
    if (this.waypointsArray[clickedWaypointIndex].fetchedData) {
      return false;
    }
    this.fetchNearbyPlaces(this.waypointsArray[clickedWaypointIndex], 'restaurant');
  }

  /** @method placeResultClickHandler
      @param {object} event - Event object for clicked place search result
      Toggles class for selected/unselected place search result
  */
  placeResultClickHandler(event) {
    $(event.currentTarget).toggleClass('selected');
  }

}
