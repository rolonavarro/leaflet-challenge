// Store our API endpoint inside queryUrl
function buildUrl(){
    // With this you can select a range of dates to display in the map
    //------------------------------------------
    // const
    //     domain = "earthquake.usgs.gov",
    //     endpoint = "/fdsnws/event/1/query",
    //     format = "geojson",
    //     starttime = "2020-06-01",
    //     endtime = "2020-06-02",
    //     maxLon = -69.52148437,
    //     minLon = -123.83789062,
    //     maxLat = 48.74894534,
    //     minLat = 25.16517337;

    // return `https://${domain}${endpoint}?format=${format}&starttime=${starttime}&endtime=${endtime}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}`;
    
    // API URL of past 7 significant earthquakes
    //------------------------------------------
    return "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
}

// Function to get the api from https://earthquake.usgs.gov/
(async function() {
    const queryUrl = buildUrl();
    const data = await d3.json(queryUrl);
    // When we get a response, send the data.features object
    createFeatures(data);
})()

// Create the fetures for the map
function createFeatures(earthquakeData) {

    function onEachLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          radius: circleSize(feature.properties.mag),
          fillOpacity: 0.7,
          color: getColor(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          weight: .5,
          opacity: 1
        });
      }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: onEachLayer
    });

    // Add lables to the dots
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><h4>Magnitude: " + (feature.properties.mag) + 
        "</h4><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

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

    const lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
        "Light Map": lightmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create map object
    var myMap = L.map("map", {
        center: [37.09, -97.71],
        zoom: 5,
        layers: [darkmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Add a legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            mag = ["0-1", "1-2", "2-3", "3-4", "4-5","5+"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(i) + '"></i> ' +
                mag[i] + '<br>';
        }
        return div;
    };legend.addTo(myMap);
    
}




// Sizes and colors of the circles
//------------------------------------------

// Size of circle
function circleSize(size) {
    return size ** 2.5;
};

function getColor(magnitude) {
    // Conditionals for magnitude
    if (magnitude >= 5) {
        return "#bd0026";
      }
      else if (magnitude >= 4) {
        return "#f03b20";
      }
      else if (magnitude >= 3) {
       return "#fd8d3c";
      }
      else if (magnitude >= 2) {
        return "#feb24c";
      }
      else if (magnitude >= 1) {
        return "#fed976";
      }
      else {
        return "#ffffb2";
      }
};



