var UI = require('ui');
var ajax = require('ajax');
var assets = require('assets');
var navigation = require('navigation');

var placesSearchCaching = Array();

this.exports.searchPlaces = function(places, page){
	var loadingCard = new UI.Card(assets.elementSettingsByPlatform({
		title: "Loading",
		body: "Fetching data please wait ...",
		backgroundColor:"vividViolet",
		titleColor: "white",
		bodyColor: "white"
	}));
	loadingCard.show();
	
	assets.location(30000, {
		success: function(pos){
			var coordinates = pos.coords;
			
			retrieveDataPlaces(places, coordinates.latitude+","+coordinates.longitude, {
				success: function(data){
					loadingCard.hide();
					displayPlaces(data, places);
				},
				error: function(){
					var errorCard = new UI.Card(assets.elementSettingsByPlatform({
						title: "Error",
						body: "An error occured while retrieving the data. Please try again later.",
						titleColor : "black",
						subtitleColor : "black",
						bodyColor : "black",
						backgroundColor : "red"
					}));
					errorCard.show();
				}
			}, page);
		},
		error: function(){
			var errorCard = new UI.Card(assets.elementSettingsByPlatform({
				title: "Error location",
				body: "An error occured while retrieving location. Please make sure your location service is activated.",
				titleColor : "black",
				subtitleColor : "black",
				bodyColor : "black",
				backgroundColor : "red"
			}));
			errorCard.show();
		}
	});
};

function displayPlaces(data, places){
	var itemsToDisplay = Array();
	
	for(var i = 0; i < data.length; i++){
		var currentItem = data[i];
		
		itemsToDisplay.push({
			title: currentItem[places.titleField],
			subtitle: currentItem[places.subtitleField]
		});
	}
	
	var listToDisplay = new UI.Menu(assets.elementSettingsByPlatform({
		backgroundColor: "green",
		textColor : "black",
		highlightBackgroundColor : "inchworm",
		highlightTextColor : "black",
		sections: [{
			title: places.title,
			items: itemsToDisplay
		}]
	}));
	
	listToDisplay.show();
	listToDisplay.on('select', function(e) {
		var currentItem = data[e.itemIndex];
		displayPlace(currentItem, places);
	});
}

this.exports.displayPlace = displayPlace;

function displayPlace(data, places){
	var value = assets.getFavourites(data.place_id);
	var inFav = false;
	
	var favouriteItem = {
		title: "Add to favourites"
	};
	if(value !== null){
		if(value.inFav){
			inFav = true;
			favouriteItem = {
				title: "Add to favourites",
				subtitle: "In favourites"
			};
		}
	}
	
	var items = Array();
		items.push({ title: "Start navigation" });
		items.push({ title: data[places.titleField], subtitle: data[places.subtitleField] });
		items.push(favouriteItem);
	
		if(typeof(data.rating) != "undefined"){
			items.push({ title: "Rating", subtitle: data.rating});
		}
	
		if(typeof(data.opening_hours) != "undefined"){
			if(data.opening_hours.open_now){
				items.push({ title: "Open now", subtitle: "Yes"});
			}else{
				items.push({ title: "Open now", subtitle: "No"});
			}
		}
	
	var placeList = new UI.Menu(assets.elementSettingsByPlatform({
		backgroundColor: "imperialPurple",
		textColor : "white",
		highlightBackgroundColor : "roseVale",
		highlightTextColor : "white",
		sections: [{
			title: "Details",
			items: items
			}]
		}));

	placeList.show();	
	placeList.on('select', function(e){
		switch(e.itemIndex){
			case 1:
				var titleCard = new UI.Card(assets.elementSettingsByPlatform({
					title: data[places.titleField],
					body: data[places.subtitleField],
					scrollable: true,
					backgroundColor: "imperialPurple",
					titleColor: "white",
					subtitleColor: "white",
					bodyColor: "white"
				}));
				titleCard.show();
				break;
				
			case 2:
				var value = {
					inFav: inFav,
					place_id: data.place_id,
					type: places.id,
					title: data[places.titleField],
					subtitle: data[places.subtitleField]
				};
				
				if(!inFav){
					inFav = true;
					value.inFav = true;
					assets.setFavourites(value);
					placeList.item(0, 1, { title: "Add to favourites", subtitle: 'Saved in favourites' });
				}else{
					inFav = false;
					value.inFav = false;
					assets.setFavourites(value);
					placeList.item(0, 1, { title: "Add to favourites", subtitle: '' });
				}
				break;
				
			case 0:
				navigation.display(data);
				break;
		}
	});
}

function retrieveDataPlaces(places, location, callback, page){
	var eventualCacheData = placesSearchCaching[location.toString()];
	if(typeof(eventualCacheData) != "undefined"){
		var currentDate = new Date().getTime();
		if(currentDate - eventualCacheData.lastFetch > 30000){
			executeAjax(places, location, callback, page);
		}else{
			if(typeof(callback.success) != "undefined"){
				callback.success(eventualCacheData);
			}
		}
	}else{
		executeAjax(places, location, callback, page);
	}
	
	function executeAjax(places, location, callback, page){
		ajax({
			url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?language=en&location=' + location + '&radius=' + places.radius + '&types=' + places.value + '&key=AIzaSyCSy3LS8Dhaut1rjV2QCskew4qh0AAMTxs',
			type: 'json'
		},
			function(data) {
				if(typeof(callback.success) != "undefined"){
					if(typeof(data.results) != "undefined"){
						callback.success(data.results);
					}else{
						if(typeof(callback.error) != "undefined"){
							callback.error("No data");
						}
					}
				}
			},
			function(error){
				if(typeof(callback.error) != "undefined"){
					callback.error(error);
				}
			}
		);
	}
}