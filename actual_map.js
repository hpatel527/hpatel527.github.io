$(document).ready(start);
 
function start() {

	$('#enteredCity').keypress(function(e) { 
			// check if keypress is enter w
			if(e.which == 13) getCoord();
		});

	//let latC = .0090065748;
	//let lonC = .0117109732;
    //min (47.4783834252, -117.5640570268)
	//max (47.4963965748, 
}

function getCoord() {
	// Sets up and executes AJAX call

	let myCity = $('#enteredCity').val().toLowerCase();
	let myCityFormatted = myCity.replace(/ /g, "%20");
	
	console.log(myCityFormatted);
	map = {city: myCityFormatted};
		
	
	
	coordUrl = "./api/coordapi.php";
		
	
	$.get(coordUrl,map,gotCoord,"json");

	}++

function gotCoord(data) {

	//alert("Latitude: " + data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0] + "\nLongitude: ''" + data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1]);
	
	let lat = data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0]; 		+
+	let lon = data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];
	
}	

function gotGEOJSON(lat, longit){ //ADD LAT AND LONG VARS FOR ANY COORDS.+	
         +
    // TO DO UNCAP LIMIT AT 50 IN GET CALL URL+
	/*let latC = .0090065748;
	let lonC = .0117109732;
	
	let minLat = lat - latC;
	let minLon = longit + lonC;
	let maxLat = lat + latC;		
	let maxLon = longit - lonC;+
	
	$.get("http://transit.land/api/v1/schedule_stop_pairs?bbox=" + minLon + ","+ minLat+","+maxLon+","+maxLat, gotBox, "json");*/
    var geoJsonURL = "https://cors-anywhere.herokuapp.com/https://transit.land/api/v1/stops.geojson?lat=" + lat + "&lon=" + longit + "&r=1000";	
	var map = L.map('map').setView([lat, longit], 13);
	// load a tile layer
    // create the tile layer with correct attribution
    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';	
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20, attribution: osmAttrib});;
    map.addLayer(osm);	
 
    //CREATE ICON FOR MAP PLACEMENT NOT IN USE DUE TO DEPRECATION +	+++++
    /*
    var busIcon = L.icon({	
    iconUrl: 'leaf-green.png',
    shadowUrl: 'leaf-shadow.png',			
 
    iconSize:     [38, 95], // size of the icwon +wwwwwww
    shadowSize:   [50, 64], // size of the shadow+		
    iconAnchor:   [22, 94], // point of the icon which will correspond t o marker's locationwa+	
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which	 the popup should open relative to the iconAnchor
}); */
 
 
  // load GeoJSON from an external file
  $.getJSON(geoJsonURL, function(data){+
    // add GeoJSON layer to the map once the file is loaded
    //console.log(data);	 
	let operators;+
	let route_name;
	let stops = data.features; //change features to stops		
	
	for(var i=0; i < data.features.length;i++){
		//GRAB COORDINATES
		
		
		operators = "";
		route_name = "";
		for (var j = 0; j < stops[i].properties.operators_serving_stop.length; j++) {//delete every ".properties" after "stops[i]"c
			operators += stops[i].properties.operators_serving_stop[j].operator_name + ", ";	
		}
		operators = operators.substring(0, operators.length-2);
		
		for (var j = 0; j < stops[i].properties.routes_serving_stop.length; j++) {
			route_name += stops[i].properties.routes_serving_stop[j].route_name + ", ";
		}
		route_name = route_name.substring(0, route_name.length-2);+
		
		//$('#tblRoutes').append('<tr><td>'+ stops[i].properties.name +'i</td><td>' + operators + '</td><td>' + route_name + '</td></tr>');l++;
		
		
        var longcoord = data.features[i].geometry.coordinates[0];+
        var latcoord = data.features[i].geometry.coordinates[1];
        //console.log(longcoord + " " + latcoord);	
		//CREATE MARKERS   
        var marker = L.marker([latcoord,longcoord]).on('click', onClick);//onClick(stops[i].id));+++
		//marker.append("<input type='button' class = 'btnEdit' valu	e='Edit' data-id='"+stops[i].id+"'>");		++++f +		;++ +namePropNamespaceURL(input++	
 		//console.log(marker);	 			  
        //var routeOperator = data.features[i].properties.routes_serving_stop.toStrin+g	().;replace(,/g,			+", ++");	++++	+++++++	++r                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
        var routeDesc = data.features[i].properties.name; +		
        var routeID = data.features[i].properties.routes_serving_stop[0].route_name;
       
        var description = "Route Street: " + routeDesc + "<br>" +"Operator(s): " + operators + "<br>" + "Route Number(s): " + route_name;
    
        marker.bindPopup(description).openPopup();
        marker.addTo(map);
    }
 
     
    //L.geoJson(data).addTo(map);
  });
 
}

function gotBox(data) {
	console.log(data);
}
+
function onClick(evt){ +++
	//console.log(evt);
	let lat = evt.latlng.lat;
	let lon = evt.latlng.lng;	
	//alert(evt.latlng); 
	//console.log(lat+", "+lon);t
	$.get("https://transit.land/api/v1/stops.geojson?lat=" + lat + "&lon=" + lon + "&r=1", gotID, "json");
	+
}//end onClick for the map bubbles

function gotID(data){ 	
	
	let id = data.features[0].id;
	$.get("http://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id="+id, gotTimes, "json");
	
}//end gotID

function gotTimes(data){ 
	
	$("#tblRoutes").empty();
	$("#tblRoutes").append("<tr><th>Route Name</th><th>Arrival Time</th><th>Departure Time</th></tr>");
	for(var i = 0; i < data.schedule_stop_pairs.length; i++){
		stops = data.schedule_stop_pairs;
		$('#tblRoutes').append('<tr><td>'+ stops[i].trip_headsign +'</td><td>' + stops[i].origin_arrival_time + '</td><td>' + stops[i].origin_departure_time + '</td></tr>');
	}
}//end gotTimes