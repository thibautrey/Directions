var UI = require('ui');
var assets = require('assets');
var navigation = require('navigation');
var customs;

customs = assets.getCustoms();

var Settings = require('settings');

function setConfigPage(){
	Settings.config(
		{ url: 'http://directions.parseapp.com/?' + encodeURIComponent(JSON.stringify(assets.getCustoms())) },
		function(e) {
			customs = assets.getCustoms();
		},
		function(e) {
			if(typeof(e.options) != "undefined"){
				if(typeof(e.options.locations) != "undefined"){
					customs = e.options;
					assets.setCustoms(e.options);
					setConfigPage();
				}
			}
		}
	);
}

setConfigPage();

this.exports.display = display;

function display(){
	var customList = assets.getCustoms();
	var dataDisplayed = false;
	
	if(customList){
		dataDisplayed = true;
		customs = assets.getCustoms();
		displayListOfCustoms(customs.locations);
	}
	
	if(!dataDisplayed){
		var noFavList = new UI.Card(assets.elementSettingsByPlatform({
				title: "No locations",
				body: "There is no locations saved. Please save a place in your location first.",
				scrollable: true, 
				titleColor : "black",
				subtitleColor : "black",
				bodyColor : "black",
				backgroundColor : "yellow"
			}));
		noFavList.show();
	}
}

function displayListOfCustoms(data){
	var items = Array();
	
	// Generate the list of customs
	for(var i = 0; i < data.length; i++){
		var row = data[i];
		items.push({
			title: row.title
		});
	}
	
	var customsList = new UI.Menu(assets.elementSettingsByPlatform({
			backgroundColor: "green",
			textColor : "black",
			highlightBackgroundColor : "inchworm",
			highlightTextColor : "black",
			sections: [
				{
					title: 'Saved location',
					items: items
				}
			]
		}));
	
	customsList.show();
	
	customsList.on('select', function(e) {
		var selectedCustom = customs.locations[e.itemIndex];
		navigation.display({
			geometry : {
				location : {
					lat: selectedCustom.location.lat,
					lng: selectedCustom.location.lng
				}
			}
		}, true);
	});
}