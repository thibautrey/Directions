var defaultSearchItems = Array();
defaultSearchItems.push({
	id: 1,
	title: "Airport",
	value: "airport",
	radius: 50000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 2,
	title: "ATM/Bank",
	value: "atm",
	radius: 500,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 3,
	title: "Bar",
	value: "bar",
	radius: 1500,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 4,
	title: "Beauty salon",
	value: "beauty_salon",
	radius: 1000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 5,
	title: "Book store",
	value: "book_store",
	radius: 1500,
	titleField: "name",
	subtitleField: "vicinity"
}); 

defaultSearchItems.push({
	id: 6,
	title: "Bus station",
	value: "bus_station",
	radius: 250,
	titleField: "name",
	subtitleField: "vicinity"
}); 
 
defaultSearchItems.push({
	id: 23,
	title: "Cafe",
	value: "cafe",
	radius: 1500,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 7,
	title: "City Hall",
	value: "city_hall",
	radius: 2000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 8,
	title: "Clothing store",
	value: "clothing_store",
	radius: 1500,
	titleField: "name",
	subtitleField: "vicinity"
}); 
 
defaultSearchItems.push({
	id: 9,
	title: "Dentist",
	value: "dentist",
	radius: 2000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 25,
	title: "Doctor",
	value: "doctor",
	radius: 2000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 10,
	title: "Gas station",
	value: "gas_station",
	radius: 5000,
	titleField: "name",
	subtitleField: "vicinity"
}); 

defaultSearchItems.push({
	id: 11,
	title: "Gym",
	value: "gym",
	radius: 1500,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 4,
	title: "Hair care",
	value: "hair_care",
	radius: 1000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 26,
	title: "Hospital",
	value: "hospital",
	radius: 5000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 27,
	title: "Pharmacy",
	value: "pharmacy",
	radius: 2000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 24,
	title: "Library",
	value: "library",
	radius: 3000,
	titleField: "name",
	subtitleField: "vicinity"
}); 

defaultSearchItems.push({
	id: 12,
	title: "Movie theater",
	value: "movie_theater",
	radius: 5000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 13,
	title: "Museum",
	value: "museum",
	radius: 5000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 14,
	title: "Night Club",
	value: "night_club",
	radius: 4000,
	titleField: "name",
	subtitleField: "vicinity"
}); 

defaultSearchItems.push({
	id: 15,
	title: "Park",
	value: "park",
	radius: 5000,
	titleField: "name",
	subtitleField: "vicinity"
}); 

defaultSearchItems.push({
	id: 16,
	title: "Parking",
	value: "parking", 
	radius: 5000,
	titleField: "name",
	subtitleField: "vicinity"
}); 

defaultSearchItems.push({
	id: 17,
	title: "Police",
	value: "police",
	radius: 1500,
	titleField: "name",
	subtitleField: "vicinity"
}); 

defaultSearchItems.push({
	id: 18,
	title: "Post office",
	value: "post_office",
	radius: 2000,
	titleField: "name",
	subtitleField: "vicinity"
}); 

defaultSearchItems.push({
	id: 19,
	title: "Restaurant",
	value: "restaurant",
	radius: 1000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 20,
	title: "School",
	radius: 15000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 21,
	title: "Subway station",
	value: "subway_station",
	radius: 250,
	titleField: "name",
	subtitleField: "vicinity"
}); 

defaultSearchItems.push({
	id: 22,
	title: "Train station",
	value: "train_station",
	radius: 15000,
	titleField: "name",
	subtitleField: "vicinity"
});

defaultSearchItems.push({
	id: 28,
	title: "University",
	value: "university",
	radius: 15000,
	titleField: "name",
	subtitleField: "vicinity"
});

this.exports.defaultSearch = defaultSearchItems;

function searchItem(id){
	for(var i = 0; i < defaultSearchItems.length; i++){
		var row = defaultSearchItems[i];
		if(row.id == parseInt(id)){
			return row;
		}
	}
}

this.exports.searchItem = searchItem;