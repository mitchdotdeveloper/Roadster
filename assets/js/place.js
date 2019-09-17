class Place {
  constructor(mapObject, location, tripCallback) {
    this.mapObject = mapObject
    this.location = {
      lat: location.lat,
      lng: location.lng
    };
    this.tripCallback = tripCallback;
    this.selectedPlaces = [];
    // this.placeTypes = ['restaurant', 'lodging', 'point_of_interest', 'natural_feature'];

    this.createPlacesTab = this.createPlacesTab.bind(this);
  }

  onConfirm() {
    this.tripCallback(this);
  }

  fetchNearbyPlaces() {
    //Create Google Places Service objects
    let placesServiceObj = new google.maps.places.PlacesService(this.mapObject);
    let locationObjToSearch = new google.maps.LatLng(this.location.lat, this.location.lng);
    let request = {
      location: locationObjToSearch,
      radius: '30000',
      type: ['restaurant']
    };

    //Searches for restaurants within 30,000m of location, passes array of search results to callback function
    placesServiceObj.nearbySearch(request, this.createPlacesTab);
  }

  createPlacesTab(searchResults, searchStatus) {
    if (searchStatus !== 'OK') {
      return false;
    }
    let newPlacesTab = $('<div>').attr('id', 'restraurants-tab').text('Restaurants found near this location: ')
    for (var i = 0; i < searchResults.length; i++) {
      let currentPlaceData = this.getInfoFromSearchResult(searchResults[i]);
      newPlacesTab.append($('<div>')
        .text('Result ' + (i+1) + ': ')
        .append('<br>Name:' + currentPlaceData.name)
        .append('<br>Location:' + currentPlaceData.location)
        );
    }
    $('body').append(newPlacesTab);
    // this.renderPlacesPage();
  }

  getInfoFromSearchResult(searchResult) {
    let searchResultData = {
      place_id: searchResult.place_id,
      name: searchResult.name,
      photos: searchResult.photos,
      location: searchResult.geometry.location
    };
    return searchResultData;
  }

  renderPlacesPage() {
  }
}
