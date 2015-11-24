var UI = require('ui');
var assets = require('assets').localStorageInit();

var places = require('places');
var favourites = require('favourites');
var customLocation = require('customLocation');
var placesConfig = require('placesConfig');
var defaultSearch = placesConfig.defaultSearch;

menu();

function menu(){
	var sections = Array();
	
		// FAVORITES SECTION
		var favoritesItems = Array();
	
		var fav = assets.favourites(); 
		if(typeof(fav) != "undefined" && fav !== null){
			var keys = Object.keys(fav);
			var lengthArray = keys.length;
			var favouritesAmount = 0;
			
			for(var i = 0; i < lengthArray; i++){
				var current = fav[keys[i]];
				if(current.inFav){
					favouritesAmount++;
				}
			}
			
			if(favouritesAmount){
				favoritesItems.push({
					title: "My favourites",
					subtitle: favouritesAmount + " saved"
				});
			}else{
				favoritesItems.push({
					title: "My favourites"
				});
			}
		}else{
			favoritesItems.push({
				title: "My favourites"
			});
		}
	
		favoritesItems.push({
			title: "My locations"
		});
	
		var favouritesTitleLocalised = "Favorites";
		if(assets.lang == "fr_FR"){
			favouritesTitleLocalised = "Favoris";
		}
	
		sections.push({
			title: favouritesTitleLocalised,
			items: favoritesItems
		});
	
		// SEARCH SECTION
		var searchItems = Array();
		for(var j = 0; j < defaultSearch.length; j++){
			var currentItem = defaultSearch[j];
			
			if(typeof(currentItem.subtitle) != "undefined"){
				searchItems.push({
					title: currentItem.title,
					subtitle: currentItem.subtitle
				});
			}else{
				searchItems.push({
					title: currentItem.title
				});
			}
		}
	
		var searchTitleLocalised = "Search";
		if(assets.lang == "fr_FR"){
			searchTitleLocalised = "Recherche";
		}
	
		sections.push({
			title: searchTitleLocalised,
			items: searchItems
		});
	
	var menuList = new UI.Menu(assets.elementSettingsByPlatform({
			sections: sections, 
			backgroundColor : "dukeBlue",
			textColor : "white",
			highlightBackgroundColor : "windsorTan",
			highlightTextColor : "white"
		}));
	
	menuList.show();
	
	menuList.on('select', function(e) {
		switch(e.sectionIndex){
			case 0:
				if(e.itemIndex === 1){ // My location
					customLocation.display();
				}else if(e.itemIndex === 0){ // My favourites
					favourites.display();
				}
				break;
			
			case 1:
				var selectedItem = defaultSearch[e.itemIndex];
				places.searchPlaces(selectedItem, 0);
				break;
		}
	});
}