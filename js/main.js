// declare the map variable here to give it a global scope
let myMap;
let mapSelect;

// we might as well declare our baselayer(s) here too
const CartoDB_Positron = L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

const Thunderforest_SpinalMap = L.tileLayer('https://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey={apikey}',
{
attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
apikey: 'ea9b7fb93e24485791953aaf358e2696',
maxZoom: 22
});


function initialize(){
    loadMap();
};


function loadMap(mapid){
	try {
		myMap.remove()
	}
	catch(e) {
		console.log(e)
		console.log("no map to delete")
	}
	finally {
		//put your map loading code in here
		if(mapid == 'mapa'){
			mapSelect = 'A'

			//now reassign the map variable by actually making it a useful object, this will load your leaflet map
			myMap = L.map('mapdiv', {
				center: [40.50, -96.58]
				,zoom: 4
				,maxZoom: 18
				,minZoom: 3
				,layers: CartoDB_Positron
			});

			//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
			let baseLayers = {
				"CartoDB": CartoDB_Positron,
				"FireMap": Thunderforest_SpinalMap
			};

			//declare basemap selector widget
			let lcontrol = L.control.layers(baseLayers);
			//add it to the map
			lcontrol.addTo(myMap);

			fetchData();
			}

		if(mapid == 'mapb'){
			mapSelect = 'B'

			//now reassign the map variable by actually making it a useful object, this will load your leaflet map
			myMap = L.map('mapdiv', {
				center: [15, 15]
				,zoom: 2
				,maxZoom: 18
				,minZoom: 2
				,layers: CartoDB_Positron
			});

			//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
			let baseLayers = {
				"CartoDB": CartoDB_Positron,
				"FireMap": Thunderforest_SpinalMap
			};

			//declare basemap selector widget
			let lcontrol = L.control.layers(baseLayers);
			//add it to the map
			lcontrol.addTo(myMap);

			fetchData();
			}
		}
	};

function fetchData(){
    //load the data
		if (mapSelect == 'A'){
			fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/Amtrak_Stations.geojson')
					.then(function(response){
							return response.json();
					})
					.then(function(json){
							//create a Leaflet GeoJSON layer and add it to the map
							L.geoJson(json, {style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
					})
		}

		if (mapSelect == 'B'){
			fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/megacities.geojson')
					.then(function(response){
							return response.json();
					})
					.then(function(json){
							//create a Leaflet GeoJSON layer and add it to the map
							L.geoJson(json, {style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
					})
		}

};

function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}


function styleAll(feature, latlng) {
	// console.log(feature.properties.ZipCode)

	if (mapSelect == 'A'){
		var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

		if (feature.geometry.type == "Point") {
			styles.fillColor = '#fff'
			,styles.fillOpacity = 0.5
			,styles.stroke=true
			,styles.radius=6
		}

		if (typeof feature.properties.ZipCode == 'string') {
			styles.fillColor = 'cyan'
			,styles.fillOpacity = 0.5
			,styles.stroke=true
			,styles.radius=6
		}

		return styles;

	}

	if (mapSelect == 'B'){
		var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

		if (feature.geometry.type == "Point") {
			styles.fillColor = 'red'
			,styles.fillOpacity = 0.7
			,styles.stroke=true
			,styles.radius=7
		}

		return styles;

	}
}

function addPopups(feature, layer){
	if (mapSelect == 'A'){
		layer.bindPopup(feature.properties.City + ", " + feature.properties.State)
	}

	if (mapSelect == 'B'){
		layer.bindPopup(feature.properties.city + "<br>Pop: " + feature.properties.pop_2018)
	}

}

// window.onload = initialize();
