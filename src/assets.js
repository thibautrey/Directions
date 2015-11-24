var lang = navigator.language;
if(lang == "fr"){
	lang = "fr_FR";
}
var favourites;
var places;
var customs;

this.exports.lang = function(){
	return lang;
};

this.exports.location = function(age, response){
	var ageLocation = age;
	if(typeof(ageLocation) == "undefined"){
		ageLocation = "10000";
	}
	var locationOptions = {
		enableHighAccuracy: true, 
		maximumAge: ageLocation, 
		timeout: 5000
	};
	
	navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
	
	function locationSuccess(pos) {
		if(typeof(response.success) != "undefined"){
			response.success(pos);
		}
	}

	function locationError(err) {
		if(typeof(response.error) != "undefined"){
			response.error();
		}
	}
};

this.exports.watchLocation = function(age, response){
	var ageLocation = age;
	if(typeof(ageLocation) == "undefined"){
		ageLocation = 5000;
	}
	var locationOptions = {
		enableHighAccuracy: true, 
		maximumAge: ageLocation, 
		timeout: Infinity
	};
	
	navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);
	
	function locationSuccess(pos) {
		if(typeof(response.success) != "undefined"){
			response.success(pos);
		}
	}

	function locationError(err) {
		if(typeof(response.error) != "undefined"){
			response.error();
		}
	}
};

this.exports.decompressPolyline = function(encoded){
		var len = encoded.length;
		var index = 0;
		var array = [];
		var lat = 0;
		var lng = 0;

		while (index < len) {
		var b;
		var shift = 0;
		var result = 0;
		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);
		
		var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
		lat += dlat;

		shift = 0;
		result = 0;
		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);
		
		var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
		lng += dlng;

		array.push([lat * 1e-5, lng * 1e-5]);
		}

		return array;
};

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at http://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: http://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2015            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
this.exports.distance = function(lat1, lon1, lat2, lon2, unit){
	
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit=="K") { dist = dist * 1.609344; }
	if (unit=="N") { dist = dist * 0.8684; }
	
	return dist;
};

this.exports.platform = platform;
	
function platform(){
	if(Pebble.getActiveWatchInfo) {
		var watchinfo = Pebble.getActiveWatchInfo();
		var pltfrm = watchinfo.platform;
		return pltfrm;
  } else {
    return "aplite";
  } 
	
	if(Pebble.getActiveWatchInfo) {
		return "basalt";
	} else {
			return "aplite";
	}	
}

this.exports.elementSettingsByPlatform = function(settings){
	var cleaned = settings;
	
	if(platform() == "aplite"){
		var keysToRemove = Array("titleColor", "subtitleColor", "bodyColor", "backgroundColor", "textColor", "highlightBackgroundColor", "highlightTextColor");
		for(var i = 0; i < keysToRemove.length; i++){
			delete cleaned[keysToRemove[i]];
		}
		cleaned.color = "black";
	}
	
	return cleaned;
};

this.exports.localStorageInit = function(){
	favouritesGetter();
	placesGetter();
	customsInit();
	return this;
};

this.exports.favourites = favouritesGetter;

function favouritesGetter(){
	if(typeof(favourites) != "undefined"){
		return favourites;
	}else{
		favourites = localStorage.getItem("favourites");
		if(favourites !== null){
			favourites = JSON.parse(favourites);
			favourites = favourites.data;
		}
		return favourites;
	}
}

this.exports.setFavourites = function(fav){
	if(favourites === null){
		favourites = {};
	}
	favourites[fav.place_id] = fav;
	localStorage.setItem("favourites", JSON.stringify({
		data: favourites
	}));
};

this.exports.getFavourites = function(place_id){
	if(typeof(favourites) != "undefined"){
		if(favourites !== null){
			if(typeof(favourites[place_id]) != "undefined"){
				return favourites[place_id];
			}else{
				return null;	
			}	
		}else{
			return null;
		}
	}else{
		return null;
	}
};

this.exports.places = placesGetter;

function placesGetter(){
	if(typeof(places) != "undefined"){
		return places;
	}else{
		places = localStorage.getItem("places");
		if(places !== null){
			places = JSON.parse(places);
			places = places.data;
		}
		return places;
	}
}

this.exports.setPlaces = function(place){
	if(places === null){
		places = {};
	}
	places[place.id] = place;
	localStorage.setItem("places", JSON.stringify({
		data: places
	}));
};

this.exports.getPlaces = function(place_id){
	if(typeof(places) != "undefined"){
		if(places !== null){
			if(typeof(places[place_id]) != "undefined"){
				return places[place_id];
			}else{
				return null;	
			}	
		}else{
			return null;
		}
	}else{
		return null;
	}
};

this.exports.customs = customsInit;

function customsInit(){
	if(typeof(customs) != "undefined"){
		return customs;
	}else{
		customs = localStorage.getItem("customs");
		if(customs !== null){
			customs = JSON.parse(customs);
		}
		
		return customs;
	}
}

this.exports.setCustoms = function(custom){
	var data = JSON.stringify(custom);
	customs = custom;
	localStorage.setItem("customs", data);
};

this.exports.getCustoms = function(){
	if(typeof(customs) != "undefined"){
		if(customs !== null){
			if(typeof(customs) != "undefined"){
				if(!Array.isArray(customs.locations)){
					var customsToSave = {locations:[], metrics: "miles"};
					customs = customsToSave;
					var data = JSON.stringify(customsToSave);
					localStorage.setItem("customs", data);
				}
				return customs;
			}else{
				return null;	
			}	
		}else{
			return null;
		}
	}else{
		return null;
	}
};

this.exports.tutorialDisplayedAmount = function(){
	var amount = localStorage.getItem("tutorialDisplayedAmount");
	
	if(amount === null){
		amount = {
			data: 0
		};
	}else{
		amount = JSON.parse(amount);
	}
	
	return amount.data;
};

this.exports.tutorialDisplayed = function(){
	var amount = localStorage.getItem("tutorialDisplayedAmount");
	
	if(amount === null){
		amount = {
			data: 0
		};
	}else{
		amount = JSON.parse(amount);
	}
	
	amount.data = amount.data+1;
	
	localStorage.setItem("tutorialDisplayedAmount", JSON.stringify(amount));
};