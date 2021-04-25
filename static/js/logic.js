// Function to determine circle radius based on earthquake magnitude
function circleSize(magnitude) {
    return magnitude * 20000;
}

urlEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(urlEarthquakes).then(function(dataEq) {
    // Once we get a response, send the data.features object to the createFeatures function
    createCircles(dataEq.features);
});

// ------------------------------------------------------------
// ------------------------------------------------------------

function createCircles(featuresEq) {


    // Define an array to hold earthquake coordinates
    var earthquakeCircles = [];
    
    for (var i = 0; i < featuresEq.length; i++) {
        
        var coordinates = featuresEq[i].geometry.coordinates

        earthquakeCircles.push(
            L.circle([coordinates[1], coordinates[0]], {
                weight: 0.5,
                opacity: 0.3,
                fillOpacity: 0.7,
                color: "black",
                fillColor: "green",
                radius: circleSize(featuresEq[i].properties.mag)
            })
        );
    }

    var earthquakesLayer = L.layerGroup(earthquakeCircles);

    createMap(earthquakesLayer);

}


function createMap(earthquakesLayer) {

    // Base layers
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });

    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
    });

    // Create a baseMaps object
    var baseMaps = {
        "Stellite Map": satelliteMap,
        "Light Map": lightMap,
        "Outdoors Map": outdoorsMap
    };

    // Create an overlay object
    var overlayMaps = {
    //   "State Population": states,
    "Earthquakes": earthquakesLayer
    };

    // Define a map object
    var myMap = L.map("map", {
        // center: [39.55, -105.78],
        center: [47.61, -122.33],
        zoom: 4,
        layers: [satelliteMap, earthquakesLayer]
    });

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}