class Place {
  constructor(mapObject, waypointsArray, tripCallback) {
    //Store data
    this.mapObject = mapObject
    this.waypointsArray = [waypointsArray, waypointsArray];
    this.tripCallback = tripCallback;
    // this.stopCounter = 0;
    // this.selectedPlaces = [];
    // this.stopsDataArray = [];
    // this.setStopsDataArrayPromise();

    //Create Google Places Service object
    this.placesServiceObj = new google.maps.places.PlacesService(this.mapObject);

    //Bind methods
    this.addResultsToList = this.addResultsToList.bind(this);
    // this.restaurantButtonHandler = this.restaurantButtonHandler.bind(this);
    // this.hotelButtonHandler = this.hotelButtonHandler.bind(this);
    // this.otherButtonHandler = this.otherButtonHandler.bind(this);

    //Delete this section
    console.log('New Place obj created:', this, this.waypointsArray);
  }

  // setStopsDataArrayPromise() {
  //   const locationDataPromise = new Promise((resolve, reject) => {
  //     for (let stop of this.waypointsArray) {
  //       let currentStopLocationData = {
  //         name: stop.name,
  //         lat: stop.geometry.location.lat(),
  //         lng: stop.geometry.location.lng()
  //       };
  //       this.stopsDataArray.push(currentStopLocationData);
  //     }
  //     resolve('Data retrieved');
  //   });
  //   locationDataPromise.then(message => { console.log(message) }).catch(error => { console.log(error) });
  // }

  // onConfirm() {
  //   //Pass selectedPlaces array back to Trip class
  //   this.tripCallback(this.selectedPlaces);
  // }

  fetchNearbyPlaces(waypoint = this.waypointsArray[0], placeType = 'restaurant') {
    $('#accordion').empty();

    const radius = '15000';
    const validPlaceTypes = ['restaurant', 'lodging', 'natural_feature'];
    if (!validPlaceTypes.includes(placeType)) {
      return false;
    }

    //For each stop, create Google Places Location & Request objects, find nearby places
    const locationDataPromise = new Promise((resolve, reject) => {
      console.log('Getting location values now');
      let currentStopLocationData = {
        name: waypoint.name,
        lat: waypoint.geometry.location.lat(),
        lng: waypoint.geometry.location.lng()
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

      // let placeListHeading = $('<h3>')
      //   .addClass('places__ListHeading interstate-light')
      //   .attr('id', 'places__ListHeading' + stopIndex)
      //   .text(currentStopLocationData.name);
      // let placeListContainer = $('<div>')
      //   .addClass('places__ListContainer interstate-light')
      //   .attr('id', 'places__ListContainer' + stopIndex);
      // $('#accordion').append(placeListHeading, placeListContainer);

      //Delete this section
      console.log('fetchNearbyPlaces:', locationObjToSearch, request, arguments, currentStopLocationData);

      //Searches for places within 15km of location, passes array of search results to callback function
      this.placesServiceObj.nearbySearch(request, this.addResultsToList);


      // let getSearchResultsPromise = new Promise((resolve, reject) => {
      //   //Searches for places within 15km of location, passes array of search results to callback function
      //   this.placesServiceObj.nearbySearch(request, this.addResultsToList);
      //   resolve(true);
      // });
      // getSearchResultsPromise.then((getSearchResultsStatus) => {
      //   if (getSearchResultsStatus) {
      //     this.stopCounter++;
      //   }
      // });
    });


    //Delete this section
    // let locationObjToSearch = new google.maps.LatLng(this.locationData.lat, this.locationData.lng);
    // let request = {
    //   location: locationObjToSearch,
    //   radius: radius,
    //   type: [placeTypes[0]]
    // };

    //For hotels button, onclick => fetchNearbyPlaces('lodging')
    //For other button, onclick => fetchNearbyPlaces('natural_feature')
  }

  addResultsToList(searchResults, searchStatus) {
    if (searchStatus !== 'OK') {
      return false;
    }
    for (let resultIndex = 0; resultIndex < 5; resultIndex++) {
      this.fetchInfoForSearchResult(searchResults[resultIndex]);
    }
  }

  fetchInfoForSearchResult(searchResult) {
    let placeListItem = $('<div>').addClass('places__ListItem interstate-light'); //.attr('id', 'restraurants-tab').text('Restaurants found near ' + this.locationData.name + ': ')
    let searchResultData = {};
    let request = {
      placeId: searchResult.place_id,
      fields: ['name', 'place_id', 'formatted_address', 'geometry',
        'url', 'types', 'photos', 'rating', 'user_ratings_total', 'price_level']
    };
    this.placesServiceObj.getDetails(request, function(place, status) {
      console.log(status);
      if (status !== 'OK') {
        return false;
      }
      for (let field of request.fields) {
        searchResultData[field] = place[field];
      }
      placeListItem.append($('<div>').addClass('places__ListItem-Name').text(searchResultData.name)); //.text('Result ' + (resultIndex + 1) + ':')
      placeListItem.append($('<div>').addClass('places__ListItem-Address').text(searchResultData.formatted_address));
      placeListItem.append($('<div>').addClass('places__ListItem-Rating').text(`${searchResultData.rating} out of 5 stars (${searchResultData.user_ratings_total} reviews)`));
    });

    $('#places__ListContainer' + this.stopCounter).append(placeListItem);

    //Delete this section
    console.log('fetchingInfoForSearchResult:', searchResultData);
  }

  renderPlacesPage() {
    let accordionElements = '';
    for (let stopIndex = 0; stopIndex < this.waypointsArray.length; stopIndex++) {
      let individualAccordion = `
      <h1 class="places__Accordion-Name" id="places__Accordion-Name${stopIndex}">
        <span class="places__Accordion-Weather" id="places__Accordion-Weather${stopIndex}">Current Weather: 79&#8457; </span>
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
    // $('#placesRestaurant').on('click', this.restaurantButtonHandler);
    // $('#placesHotel').on('click', this.hotelButtonHandler);
    // $('#placesOther').on('click', this.otherButtonHandler);

    // $('.places__Accordion-Name').on('click', this.accordionClickHandler);
    $('#places__Accordion-Name1').on('click', this.accordionClickHandler);
  }

  // restaurantButtonHandler() {
  //   this.fetchNearbyPlaces('restaurant');
  // }

  // hotelButtonHandler() {
  //   this.fetchNearbyPlaces('lodging');
  // }

  // otherButtonHandler() {
  //   this.fetchNearbyPlaces('natural_feature');
  // }

  accordionClickHandler(event) {
    console.log($(event.currentTarget));
    this.fetchNearbyPlaces(this.waypointsArray[1], 'lodging');
  }

}
