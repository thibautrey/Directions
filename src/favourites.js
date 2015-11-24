var UI = require('ui');
var ajax = require('ajax');
var assets = require('assets');
var places = require('places');
var placesConfig = require('placesConfig');

this.exports.display = display;

function display(){
	var favouritesList = assets.favourites();
	var favourites = Array();
	
	if(favouritesList !== null){
		var favouritesKeys = Object.keys(favouritesList);
		
		for(var i = 0; i < favouritesKeys.length; i++){
			var row = favouritesKeys[i];
			favourites.push(favouritesList[row]);
		}
		
		displayListOfFavourites(favourites);	
	}else{
		var noFavList = new UI.Card(assets.elementSettingsByPlatform({
				title: "No favourites",
				body: "There is no favourites saved. Please save a place in your favourites.",
				scrollable: true,
				titleColor : "black",
				subtitleColor : "black",
				bodyColor : "black",
				backgroundColor : "yellow"
			}));
		noFavList.show();
	}
}

function displayListOfFavourites(data){
	var collections = Array();
	
	// Distribute the favourites in their categories
	for(var i = 0; i < data.length; i++){
		var row = data[i];
		var currentCollectionArray; // List of items in the current category
		
		if(typeof(collections[row.type]) != "undefined"){ // If the category is already created
			currentCollectionArray = collections[row.type].items;
		}else{
			currentCollectionArray = Array();
		}
		
		var categoryData = placesConfig.searchItem(row.type);
		
		if(row.inFav){
			currentCollectionArray.push(row);
		}
		
		if(currentCollectionArray.length){
			collections[row.type] = {
				type: categoryData.id,
				typeTitle: categoryData.title,
				items: currentCollectionArray
			};	
		}
	}
	
	var sections = Array();
	
	var collectionsKeys = Object.keys(collections);
	for(var j = 0; j < collectionsKeys.length; j++){
		var rowCollection = collections[collectionsKeys[j]];
		var items = Array();
		
		for(var k = 0; k < rowCollection.items.length; k++){
			var rowItems = rowCollection.items[k];
			items.push({
				title: rowItems.title,
				subtitle: rowItems.subtitle
			});
		}
		
		sections.push({
			title: rowCollection.typeTitle,
			items: items
		});
	}
	
	var favouritesList = new UI.Menu(assets.elementSettingsByPlatform({
		sections: sections,
		backgroundColor: "green",
		textColor : "black",
		highlightBackgroundColor : "inchworm",
		highlightTextColor : "black"
	}));
	
	favouritesList.show();
	
	favouritesList.on('select', function(e){
		var keys = Object.keys(collections);
		var sectionSelected = collections[keys[e.sectionIndex]];
		var itemSelected = sectionSelected.items[e.itemIndex];
		
		var card = new UI.Card(assets.elementSettingsByPlatform({
			title: 'Loading',
			body: 'Please wait ...',
			scrollable: true, 
			backgroundColor:"vividViolet",
			titleColor: "white",
			bodyColor: "white"
		}));
		
		card.show();
		
		fetchDataForFavourite(itemSelected.place_id, {
			success: function(data){
				card.hide();
				var categoryData = placesConfig.searchItem(sectionSelected.type);
				places.displayPlace(data, categoryData);
			},
			error: function(){
				card.hide();
				var error = new UI.Card(assets.elementSettingsByPlatform({
					title: 'Error',
					body: 'An error occured while retrieving the place. Please try again later.',
					scrollable: true,
					titleColor : "black",
					subtitleColor : "black",
					bodyColor : "black",
					backgroundColor : "red"
				}));
				error.show();
			}
		});
	});
}

function fetchDataForFavourite(place_id, callback){
	var results = assets.getPlaces(place_id);
	if(results !== null){
		if(typeof(callback.success) != "undefined"){
			callback.success(results);	
		}
	}else{
		ajax({
			url: 'https://maps.googleapis.com/maps/api/place/details/json?language=en&placeid=' + place_id + '&key=AIzaSyCSy3LS8Dhaut1rjV2QCskew4qh0AAMTxs',
			type: 'json'
		}, function(data){
			if(typeof(callback.success) != "undefined"){
				if(typeof(data.result) != "undefined"){
					assets.setPlaces(data.result);
					callback.success(data.result);	
				}
			}
		},
		function(){
			if(typeof(callback.error) != "undefined"){
				callback.error();
			}
		});
	}
}