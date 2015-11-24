var UI = require('ui');
var Vibe = require('ui/vibe');
var ajax = require('ajax');
var Vector2 = require('vector2');
var assets = require('assets').localStorageInit();

var navigationModes = Array();
this.exports.display = display;
var currentDestination;
var currentRoute;
var currentStep;
var shouldStartImmediately = false;

navigationModes.push({
	id: 1,
	title: "Public transport",
	locationFrequency: 5000,
	name: 'transit'
});

navigationModes.push({
	id: 2,
	title: "Driving",
	locationFrequency: 5000,
	name: 'driving'
});

navigationModes.push({
	id: 3,
	title: "Walking",
	locationFrequency: 15000,
	name: 'walking'
});

navigationModes.push({
	id: 4,
	title: "Cycling",
	locationFrequency: 10000,
	name: 'bicycling'
});

function display(place_id, startNavigation){
	if(typeof(startNavigation) != "undefined"){
		shouldStartImmediately = true;
	}else{
		shouldStartImmediately = false;
	}
	
	currentDestination = place_id;
	var navigationItems = Array();
	
	for(var i = 0; i < navigationModes.length; i++){
		var current = navigationModes[i];
		navigationItems.push({
			title: current.title
		});
	}
	var menuSelectModeNav = new UI.Menu(assets.elementSettingsByPlatform({
		backgroundColor: "imperialPurple",
		textColor : "white",
		highlightBackgroundColor : "roseVale",
		highlightTextColor : "white",
		sections: [{
			title: "Mode",
			items: navigationItems
		}]
	}));
	
	menuSelectModeNav.show();
	
	menuSelectModeNav.on('select', function(e){
		var currentNavigationMode = navigationModes[e.itemIndex];
		
		switch(currentNavigationMode.id){
			case 1:
				prepareForPublicTransport();
				break;
				
			case 2:
				prepareForDriving();
				break;
				
			case 3:
				prepareForWalking();
				break;
				
			case 4:
				prepareForBicycling();
				break;
		}
	});
}

function prepareForPublicTransport(){
	var transitModes = Array();
	transitModes.push({
		id: 1,
		title: "Bus",
		value: "bus"
	});
	transitModes.push({
		id: 2,
		title: "Subway",
		value: "subway"
	});
	transitModes.push({
		id: 3,
		title: "Train",
		value: "train"
	});
	transitModes.push({
		id: 4,
		title: "Tram",
		value: "tram"
	});
	transitModes.push({
		id: 5,
		title: "Rail",
		value: "rail"
	});
	transitModes.push({
		id: 6,
		title: "Any",
		value: "bus|subway|train|tram|rail"
	});
	
	var stepModes = Array();
	stepModes.push({
		id: 1,
		title: "Less walking",
		value: "less_walking"
	});
	
	stepModes.push({
		id: 2,
		title: "Fewer transfers",
		value: "fewer_transfers"
	});
	
	var selectedMode = transitModes[0];
	var selectedModeLazy = stepModes[0];
	
	var public = new UI.Menu(assets.elementSettingsByPlatform({
		backgroundColor: "imperialPurple",
		textColor : "white",
		highlightBackgroundColor : "roseVale",
		highlightTextColor : "white",
		sections: [
		{
			title: "",
			items: [
				{
					title: "Let's go!"
				}
			]
		},
		{
			title: "Transit mode",
			items: [
			{
				title: selectedMode.title,
				subtitle: "Click to change"
			}
			]
		},
		{
			title: "Lazy mode",
			items: [{
				title: selectedModeLazy.title,
				subtitle: "Click to change"
			}]
		}
		]
	}));
	
	public.show();
	
	public.on('select', function(e){
		switch(e.sectionIndex){
			case 0:
				var options = Array();
				options.push({
					name: "transit_mode",
					value: selectedMode.value
				});
				
				options.push({
					name: "transit_routing_preference",
					value: selectedModeLazy.value
				});
				
				options.push({
					name: "mode",
					value: "transit"
				});
				
				options.push({
					name: "alternatives",
					value: true
				}); 
				
				options.push({
					name: "language",
					value: "en"
				});  
				
				options.push({
					name: "departure_time",
					value: "now"
				});
				 
				fetchNavigationData(options);
				break;
				
			case 1:
				var itemsForTransit = Array();
				for(var i = 0; i < transitModes.length; i++){
					var currentTransit = transitModes[i];
					itemsForTransit.push({
						title: currentTransit.title
					});
				}
				var menuTransitMode = new UI.Menu(assets.elementSettingsByPlatform({
					backgroundColor: "imperialPurple",
					textColor : "white",
					highlightBackgroundColor : "roseVale",
					highlightTextColor : "white",
					sections: [{
						title: "Transit mode",
						items: itemsForTransit
					}]
				}));
				menuTransitMode.show();	
				menuTransitMode.on('select', function(e){
					selectedMode = transitModes[e.itemIndex];
					public.item(1, 0, {title: selectedMode.title, subtitle: "Click to change"});
					menuTransitMode.hide();
				});
				break;
			
			case 2:
				var itemsForLazy = Array();
				for(var j = 0; j < stepModes.length; j++){
					var currentLazy = stepModes[j];
					itemsForLazy.push({
						title: currentLazy.title
					});
				}
				var menuLazyMode = new UI.Menu(assets.elementSettingsByPlatform({
					backgroundColor: "imperialPurple",
					textColor : "white",
					highlightBackgroundColor : "roseVale",
					highlightTextColor : "white",
					sections: [{
						title: "Lazy mode",
						items: itemsForLazy
					}]
				}));
				menuLazyMode.show();	
				menuLazyMode.on('select', function(e){
					selectedModeLazy = stepModes[e.itemIndex];
					public.item(2, 0, {title: selectedModeLazy.title, subtitle: "Click to change"});
					menuLazyMode.hide();
				});
				break;
		}
	});
}

function prepareForDriving(){
	var drivingOptions = Array();
	
	drivingOptions.push({
		id: 1,
		title: "Tolls",
		status: false,
		value: "tolls"
	});
	
	drivingOptions.push({
		id: 2,
		title: "Highways",
		status: false,
		value: "highways"
	});
	
	drivingOptions.push({
		id: 3,
		title: "Ferries",
		status: true,
		value: "ferries"
	});
	
	function initDrivingOptions(){
		var drivingOptionsItems = Array();
		
		for(var i = 0; i < drivingOptions.length; i++){
			var currentOption = drivingOptions[i];
			var status;

			if(currentOption.status){
				status = "Avoid";
			}else{
				status = "Do not avoid";
			}

			drivingOptionsItems.push({
				title : currentOption.title,
				subtitle: status
			});
		}
		
		return drivingOptionsItems;
	}
	
	var driving = new UI.Menu(assets.elementSettingsByPlatform({
		backgroundColor: "imperialPurple",
		textColor : "white",
		highlightBackgroundColor : "roseVale",
		highlightTextColor : "white",
		sections: [
		{
			title: "",
			items: [
				{
					title: "Let's go!"
				}
			]
		},
		{
			title: "Avoid",
			items: initDrivingOptions()
		}
		]
	}));
	
	driving.show();
	
	driving.on('select', function(e){
		if(e.sectionIndex === 1){
			var selectedOption = drivingOptions[e.itemIndex];
			selectedOption.status = !selectedOption.status;
			
			driving.items(1, initDrivingOptions());
		}else if(e.sectionIndex === 0){
			var options = Array();
			options.push({
				name: "mode",
				value: "driving"
			});
			
			options.push({
				name: "alternatives",
				value: true
			});
			
			var avoid = "";
			for(var i = 0; i < drivingOptions.length; i++){
				var currentDrivingOption = drivingOptions[i];
				if(currentDrivingOption.status){
					if(avoid.length > 0){
						avoid = avoid + "|" + currentDrivingOption.value;
					}else{
						avoid = avoid + currentDrivingOption.value;
					}
				}
			}
			
			if(avoid.length > 0){
				options.push({
					name: "avoid",
					value: avoid
				});
			}
			
			options.push({
				name: "language",
				value: "en"
			});
			 
			options.push({
				name: "units",
				value: "imperial"
			});
			
			options.push({
				name: "departure_time",
				value: "now"
			});
			
			fetchNavigationData(options);
		}				 
	});
}

function prepareForWalking(){
	var options = Array();
	
	options.push({
		name: "mode",
		value: "walking"
	});

	options.push({
		name: "alternatives",
		value: true
	}); 

	options.push({
		name: "language",
		value: "en"
	});  

	options.push({
		name: "units",
		value: "imperial"
	});

	options.push({
		name: "departure_time",
		value: "now"
	});
	
	fetchNavigationData(options);
}

function prepareForBicycling(){
	var options = Array();
	
	options.push({
		name: "mode",
		value: "bicycling"
	});

	options.push({
		name: "alternatives",
		value: true
	}); 

	options.push({
		name: "language",
		value: "en"
	});  

	options.push({
		name: "units",
		value: "imperial"
	});

	options.push({
		name: "departure_time",
		value: "now"
	});
	
	fetchNavigationData(options);
}

function fetchNavigationData(options){
	var loadingCard = new UI.Card(assets.elementSettingsByPlatform({
		title: "Loading",
		body: "Please wait while we retrieve the best routes for you.",
		backgroundColor:"vividViolet",
		titleColor: "white",
		bodyColor: "white"
	}));
	
	loadingCard.show();
	
	assets.location(0, {
		success: function(locationData){
			var isFirstOption = true;
			var totalString = "https://maps.googleapis.com/maps/api/directions/json";

			function addOption(name, value){
				if(isFirstOption){
					isFirstOption = false;
					totalString += "?" + name + "=" + value;
				}else{
					totalString += "&" + name + "=" + value;
				}
			}

			for(var i = 0; i < options.length; i++){
				var currentOption = options[i];
				addOption(currentOption.name, currentOption.value);
			}
		
			var coordinates = locationData.coords;
			addOption("origin", coordinates.latitude + "," + coordinates.longitude);
			addOption("destination", currentDestination.geometry.location.lat + "," + currentDestination.geometry.location.lng);
			addOption("key", "AIzaSyCSy3LS8Dhaut1rjV2QCskew4qh0AAMTxs");
			addOption("language", navigator.language);
			var unit = "";
			if(assets.getCustoms().metrics == "miles"){
				unit = "imperial";
			}else{
				unit = "metric";
			}
			
			addOption("units", unit);
		
			ajax({
				url: totalString,
				type: 'json'
			}, 
					function(dataFromGoogle){
						if(dataFromGoogle.status == "ZERO_RESULTS"){
							var errorCard = new UI.Card(assets.elementSettingsByPlatform({
									title: "Error direction", 
									body: "It is not possible to go to that place using the type of transport you have selected.",
									scrollable: true,
									titleColor: "black",
									subtitleColor: "black",
									bodyColor: "black",
									backgroundColor: "red"
								}));
								errorCard.show();
						}else{
							startNavigation(dataFromGoogle);
						}
					
						loadingCard.hide();
				},
					function(){
					loadingCard.hide();
					var errorCard = new UI.Card(assets.elementSettingsByPlatform({
						title: "Error data", 
						body: "An error occured while retrieving the directions. Please try again later!",
						scrollable: true,
						titleColor: "black",
						subtitleColor: "black",
						bodyColor: "black",
						backgroundColor: "red"
					}));
					errorCard.show();
				}
			);
		},
		error: function(error){
			loadingCard.hide();
			var errorCard = new UI.Card(assets.elementSettingsByPlatform({
				title: "Error location", 
				body: "An error occured while retrieving your location. Please make sure the location sevice is activated on your phone.",
				scrollable: true,
				titleColor: "black",
				subtitleColor: "black",
				bodyColor: "black",
				backgroundColor: "red"
			}));
			errorCard.show();
		}
	});
}

function startNavigation(dataFromGoogle){
	function totalDurationRoute(route){
		var totalTime = 0;
		for(var i = 0; i < route.legs.length; i++){
			var currentLeg = route.legs[i];
			totalTime += currentLeg.duration.value;
		}
		
		var days = 0;
		var hours = 0;
		var mins = 0;
		var seconds = 0;
		
		// Days ?
		if((totalTime/86400)>0){
			days = Math.floor(totalTime/86400);
			totalTime = totalTime-(days*86400);
		}
		
		// Hours ?
		if((totalTime/3600)>0){
			hours = Math.floor(totalTime/3600);
			totalTime = totalTime-(hours*3600);
		}
		
		// Mins ?
		if((totalTime/60)>0){
			mins = Math.floor(totalTime/60);
			totalTime = totalTime-(mins*60);
		}
		
		// Seconds ?
		if((totalTime/1)>0){
			seconds = Math.floor(totalTime/1);
			totalTime = totalTime-(seconds*1);
		}
		
		var resultString = "";
		if(days>0){
			resultString+= days + "days ";
		}
		
		if(hours>0){
			resultString+= hours + "h ";
		}
		
		if(mins>0){
			resultString+= mins + "min ";
		}
		
		if(seconds>0){
			resultString+= seconds + "s";
		}
		return resultString;
	}
	
	if(dataFromGoogle.routes.length > 1){
		var routesList = Array();
		
		for(var i = 0; i < dataFromGoogle.routes.length; i++){
			var currentRoute = dataFromGoogle.routes[i];
			
			var arrival = "";
			if(typeof(currentRoute.legs[currentRoute.legs.length-1].arrival_time) != "undefined"){
				arrival = "Arr: " + currentRoute.legs[currentRoute.legs.length-1].arrival_time.text;
			}
			
			var distance = "";
			if(typeof(currentRoute.legs[currentRoute.legs.length-1].distance) != "undefined"){
				distance = currentRoute.legs[currentRoute.legs.length-1].distance.text;
			}
			
			var currentStepData;
			for(var j = 0; j < currentRoute.legs.length; j++){
				var currentLeg = currentRoute.legs[j];
				for(var k = 0; k < currentLeg.steps.length; k++){
					var currentStep = currentLeg.steps[k];
					
					if(typeof(currentStep.transit_details) != "undefined"){
						currentStepData = currentStep;
						break;
					}
				}
			}
			
			var title = "";
			if(typeof(currentStepData) != "undefined"){
				if(typeof(currentStepData.transit_details) != "undefined"){
					if(typeof(currentStepData.transit_details.line) != "undefined"){
						if(typeof(currentStepData.transit_details.line.short_name) != "undefined"){
							title = currentStepData.transit_details.line.short_name + " - " + totalDurationRoute(currentRoute);	
						}
					}
				}
			}
			
			if(title === ""){
				title = totalDurationRoute(currentRoute);
			}
			
			var subtitle = "";
			if(arrival.length){
				subtitle = arrival;
			}
			
			if(distance.length){
				if(subtitle.length){
					subtitle += " - ";
				}
				subtitle += distance;
			}
			
			routesList.push({
				title: title,
				subtitle: subtitle
			});
		}
		
		var menuRoutes = new UI.Menu(assets.elementSettingsByPlatform({
			backgroundColor: "imperialPurple",
			textColor : "white",
			highlightBackgroundColor : "roseVale",
			highlightTextColor : "white",
			sections: [{
				title: "Routes",
				items: routesList
			}]
		}));
		
		menuRoutes.show();
		menuRoutes.on('select', function(e){
			navigate(dataFromGoogle.routes[e.itemIndex]);
			// TO REMOVE WHEN FINISHED
			//var points = assets.decompressPolyline(dataFromGoogle.routes[e.itemIndex].overview_polyline.points);
		
		});
	}else{
		navigate(dataFromGoogle.routes[0]);
	}
}

function navigate(route){
	currentRoute = route;
	currentStep = 1;
	var currentLegSelected = 0;
	var currentLegStepSelected = 0;
	var nbStepsTotal = 0;
	for(var i = 0; i < currentRoute.legs.length; i++){
		var currentLeg = currentRoute.legs[i];
		nbStepsTotal += currentLeg.steps.length;
	}
	
	assets.tutorialDisplayed();
	/*var instruction = new UI.Card({
		title: 'Instructions',
		scrollable: true,
		body: '-Middle quick press: next step. -Middle long press: go to first step. To quit this instruction page press back.'//'-Up long press: previous step. -Down long press: next step.           -Up and down quick press : scroll the page.           -Middle quick press: next step. -Middle long press: go to first step. To quit this instruction page press back.'
	});*/
	
	var wind = new UI.Window({
		scrollable: true
	});
	
	// Create a background Rect
	var bgRect = new UI.Rect(assets.elementSettingsByPlatform({
		position: new Vector2(0, 0),
		size: new Vector2(144, 500),
		backgroundColor: 'electricUltramarine'
	}));
	wind.add(bgRect);
	
	// Steps Label
	var stepsLabel = new UI.Text(assets.elementSettingsByPlatform({
		text: "Step:",
		color: "white",
		backgroundColor: "clear",
		position: new Vector2(10, 0),
		size: new Vector2(50, 15),
		font: 'gothic-24-bold',
	}));
	wind.add(stepsLabel);
	
	// Steps Value
	var stepsValue = new UI.Text(assets.elementSettingsByPlatform({
		text: currentStep+"/"+nbStepsTotal,
		color: "white",
		backgroundColor: "clear",
		position: new Vector2(54, 0),
		size: new Vector2(90, 15),
		font: 'gothic-24-bold',
	}));
	wind.add(stepsValue);
	
	// Distance Label
	var distanceLabel = new UI.Text(assets.elementSettingsByPlatform({
		text: "Dist:",
		color: "white",
		backgroundColor: "clear",
		position: new Vector2(10, 20),
		size: new Vector2(50, 15),
		font: 'gothic-24-bold',
	}));
	wind.add(distanceLabel);
	
	// Distance Value
	var distanceValue = new UI.Text(assets.elementSettingsByPlatform({
		text: "282ft",
		color: "white",
		backgroundColor: "clear",
		position: new Vector2(54, 20),
		size: new Vector2(90, 15),
		font: 'gothic-24-bold',
	}));
	wind.add(distanceValue);
	
	// Duration Label
	var durationLabel = new UI.Text(assets.elementSettingsByPlatform({
		text: "Dur:",
		color: "white",
		backgroundColor: "clear",
		position: new Vector2(10, 40),
		size: new Vector2(50, 15),
		font: 'gothic-24-bold',
	}));
	wind.add(durationLabel);
	
	// Duration Value
	var durationValue = new UI.Text(assets.elementSettingsByPlatform({
		text: "1min",
		color: "white",
		backgroundColor: "clear",
		position: new Vector2(54, 40),
		size: new Vector2(90, 15),
		font: 'gothic-24-bold',
	}));
	wind.add(durationValue);

	// Action Value
	var actionValue = new UI.Text(assets.elementSettingsByPlatform({
		text: "Head east on Spring Garden toward Gallowgate/Route 1",
		color: "chromeYellow",
		backgroundColor: "clear",
		position: new Vector2(5, 65),
		size: new Vector2(134, 500),
		font: 'gothic-28-bold',
	}));
	wind.add(actionValue);
	
	var turn_right = new UI.Image({
		position: new Vector2(115, 10),
		size: new Vector2(20, 20),
		image: 'images/right-arrow.png'
	});
	
	var turn_left = new UI.Image({
		position: new Vector2(115, 10),
		size: new Vector2(20, 20),
		image: 'images/left-arrow.png'
	});
	
	
	wind.show();

	/*if(assets.tutorialDisplayedAmount()<=2){
		instruction.show();
	}*/
	
	refreshStep();
	
	var currentStepData;
	function refreshStep(){
		wind.remove(turn_right);
		wind.remove(turn_left);
		
		currentStepData = currentRoute.legs[currentLegSelected].steps[currentLegStepSelected];
		
		if(typeof(currentStepData.maneuver) != "undefined"){
			if(currentStepData.maneuver == "turn-right"){
				wind.add(turn_right);
			}else if(currentStepData.maneuver == "turn-left"){
				wind.add(turn_left);
			}
		}
		
		stepsValue.text(currentStep+"/"+nbStepsTotal);
		distanceValue.text(currentStepData.distance.text);
		durationValue.text(currentStepData.duration.text);
		var instructiontext = "";
		if(typeof(currentStepData.transit_details) != "undefined"){
			instructiontext += "Line: ";
			if(typeof(currentStepData.transit_details.line) != "undefined"){
				instructiontext += currentStepData.transit_details.line.short_name;
			}
			if(typeof(currentStepData.transit_details.headsign) != "undefined"){
				instructiontext += " (" + currentStepData.transit_details.headsign + ").\n";
			}
			instructiontext += "Departure: " + currentStepData.transit_details.departure_time.text.trim() + " (" + currentStepData.transit_details.departure_stop.name +").\n";
			instructiontext += "Stops: " +  currentStepData.transit_details.num_stops + ".\n";
		}
		instructiontext += currentRoute.legs[currentLegSelected].steps[currentLegStepSelected].html_instructions.replace("<b>", "").replace("</b>", "");
		instructiontext = instructiontext.replace(/<(?:.|\n)*?>/gm, '');
		actionValue.text(instructiontext);
	}
	
	/*var previousDistance = currentStepData.distance.value;
	assets.watchLocation(0, {
		success: function(locationData){
			if(currentStepData){
				var coordinates = locationData.coords;
				var distance = assets.distance(coordinates.latitude, coordinates.longitude, currentStepData.end_location.lat, currentStepData.end_location.lng, "m");
						distance = Math.round(distance*5280);
				
				var textForDistance = currentStepData.distance.text + " (";
				if(distance>1000){
					textForDistance += Math.round(distance/5280) + "m)";
				}else{
					textForDistance += distance + "ft)";
				}
				
				distanceValue.text(textForDistance);
				
				var shouldGoNext = false;
				if(previousDistance > distance){
					previousDistance = distance;
				}
				
				// Less than 50 feet
				if(distance < 50){
					shouldGoNext = true;
				}
				
				if(shouldGoNext){
					if(currentRoute.legs.length-1>currentLegSelected){
						nextStep();
						Vibe.vibrate('short');
					}
				}
				console.log(distance);
			}
		}
	});*/
	
	function previousStep(){
		if(currentStep>1){
			currentStep--;
			if(currentLegStepSelected > 0){
				currentLegStepSelected--;
			}else{
				if(currentLegSelected > 0){
					currentLegStepSelected--;
					currentLegSelected--;
				}
			}
			wind.hide(); // Force scroll up
			wind.show();
			refreshStep();
		}
	}
	
	function nextStep(){
		if(currentStep<nbStepsTotal){
			currentStep++;
			if(currentLegStepSelected < (currentRoute.legs[currentLegSelected].steps.length-1)){
				currentLegStepSelected++;
			}else{
				if(currentLegSelected < currentRoute.legs.length){
					currentLegStepSelected = 0;
					currentLegSelected++;
				}
			}
			wind.hide(); // Force scroll up
			wind.show();
			refreshStep();
		}
	}
	
	wind.on('click', 'select', function(){
		nextStep();
	});
	
	wind.on('longClick', 'down', function(){
		nextStep();
	});
	
	wind.on('longClick', 'up', function(){
		previousStep();
	});
	
	wind.on('longClick', 'select', function(){
		currentStep = 1;
		currentLegStepSelected = 0;
		currentLegSelected = 0;
		refreshStep();
	});
}