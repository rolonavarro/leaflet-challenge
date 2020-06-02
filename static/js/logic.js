// Store our API endpoint inside queryUrl
function buildUrl(){
    const
        domain = "earthquake.usgs.gov",
        endpoint = "/fdsnws/event/1/query",
        format = "geojson",
        starttime = "2020-06-01",
        endtime = "2020-06-02",
        maxLon = -69.52148437,
        minLon = -123.83789062,
        maxLat = 48.74894534,
        minLat = 25.16517337;

    return `https://${domain}${endpoint}?format=${format}&starttime=${starttime}&endtime=${endtime}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}`;
    // return "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
}

// Create the fetures for the map
function createFeatures(earthquakeData) {

    // Definea  function and add a Popup information about the 
    // earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}



function createMap(earthquakes) {

    
    
    // Adding title layer
    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Create map object
    var myMap = L.map("map", {
        center: [37.09, -97.71],
        zoom: 5,
        layers: [darkmap, earthquakes]
    });
    
}


// API URL of past 7 significant earthquakes
// const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// 
(async function(){
    const queryUrl = buildUrl();
    const data = await d3.json(queryUrl);
    // When we get a response, send the data.features object
    createFeatures(data.features);
})()