class Place {
  constructor(mapObject, location, tripCallback) {
    //Store data
    this.mapObject = mapObject
    this.locationData = {
      name: location.name,
      lat: location.geometry.location.lat(),
      lng: location.geometry.location.lng(),
    };
    this.tripCallback = tripCallback;
    this.selectedPlaces = [];

    //Create Google Places Service object
    this.placesServiceObj = new google.maps.places.PlacesService(this.mapObject);

    //Bind methods
    this.createPlacesTab = this.createPlacesTab.bind(this);
    // this.fetchInfoForSearchResult = this.fetchInfoForSearchResult.bind(this);

    //Delete this section
    console.log('New Place obj created:', location);
  }

  onConfirm() {
    //Pass selectedPlaces array back to Trip class
    this.tripCallback(this.selectedPlaces);
  }

  fetchNearbyPlaces() {
    const radius = '15000';
    const placeTypes = ['restaurant', 'lodging', 'natural_feature', 'point_of_interest'];

    //Create Google Places Location & Request objects
    let locationObjToSearch = new google.maps.LatLng(this.locationData.lat, this.locationData.lng);
    let request = {
      location: locationObjToSearch,
      radius: radius,
      type: ['restaurant']
    };

    console.log('fetchNearbyPlaces:', locationObjToSearch, request);

    //Searches for places within 30km of location, passes array of search results to callback function
    this.placesServiceObj.nearbySearch(request, this.createPlacesTab);
  }

  createPlacesTab(searchResults, searchStatus) {
    if (searchStatus !== 'OK') {
      return false;
    }
    let newPlacesTab = $('<div>').attr('id', 'restraurants-tab').text('Restaurants found near ' + this.locationData.name + ': ')
    for (var i = 0; i < 9; i++) {
      let currentPlaceData = this.fetchInfoForSearchResult(newPlacesTab, searchResults[i], i);
      // newPlacesTab.append($('<div>').addClass('place-result-box')
      //   .text('Result ' + (i + 1) + ':')
      //   .append('<br>Name: ' + currentPlaceData['name'])
      //   .append('<br>Adress: ' + currentPlaceData['formatted_address'])
      //   .append('<br>Rating: ' + currentPlaceData['rating'] + ' out of 5 stars (' + currentPlaceData['user_ratings_total'] + ' reviews)')
      //   );
    }
    $('body').append(newPlacesTab);
    // this.renderPlacesPage();
  }

  fetchInfoForSearchResult(newPlacesTab, searchResult, i) {
    let searchResultData = {};
    let request = {
      placeId: searchResult.place_id,
      fields: ['name', 'place_id', 'formatted_address', 'geometry',
        'url', 'type', 'photos', 'rating', 'user_ratings_total', 'price_level']
    };
    this.placesServiceObj.getDetails(request, function(place, status) {
      if (status === 'OK') {
        for (let i = 0; i < request.fields.length; i++) {
          searchResultData[request.fields[i]] = place[request.fields[i]];
        }
      }
      newPlacesTab.append($('<div>').addClass('place-result-box')
        .text('Result ' + (i + 1) + ':')
        .append('<br>Name: ' + searchResultData['name'])
        .append('<br>Address: ' + searchResultData['formatted_address'])
        .append('<br>Rating: ' + searchResultData['rating'] + ' out of 5 stars (' + searchResultData['user_ratings_total'] + ' reviews)')
      );
    });

    console.log('fetchingInfoForSearchResult:', searchResultData);

  }

  renderPlacesPage() {
    $('.main').empty();
  }

  selectPlaceResult() {

  }
}
