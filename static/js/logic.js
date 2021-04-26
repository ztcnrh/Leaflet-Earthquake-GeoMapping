// Function to scale circle radius to our desired circle size based on earthquake magnitude
function circleSize(magnitude) {
    return magnitude * 20000;
}

// Function to assign a legend label color based on earthquake depths
function getColor(d) {
    return d > 90  ? '#ff320e' :
           d > 70  ? '#fa6c1a' :
           d > 50   ? '#fdab30' :
           d > 30   ? '#f8d151' :
           d > 10   ? '#e9ff22' :
                      '#47ce25';
}


urlEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(urlEarthquakes).then(function(dataEq) {
    // Once we get a response, send the features object to the createCircles() function
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
        )
    }

    // Group the circle objects array into a layer group
    var earthquakesLayer = L.layerGroup(earthquakeCircles);

    // Pass the layer group to the createMap() function
    createMap(earthquakesLayer);
}


function createMap(earthquakesLayer) {

    // Base layers to choose from
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

    // Create an overlayMaps object
    var overlayMaps = {
    //   "State Population": states,
    "Earthquakes": earthquakesLayer
    };

    // Define a map object
    var myMap = L.map("map", {
        // center: [39.55, -105.78],
        center: [47.61, -122.33], //Seattle, WA geo coordinates
        zoom: 4,
        layers: [satelliteMap, earthquakesLayer]
    });

    // Add layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create a legend to display color categorizations of the earthquake depths
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            depth = [-10, 10, 30, 50, 70, 90]
    
        // Loop through our density intervals (depth) and generate a label with a colored square for each interval
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
    
        return div;
    }
    
    legend.addTo(myMap);
}
