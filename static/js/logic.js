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
pathTectonicPlates = "static/data/PB2002_plates.json"

// Perform an API call to the USGS GeoJSON feed to retrieve data for all earthquakes in the past 7 days
d3.json(urlEarthquakes).then(function(dataEq) {

    // When the first API call is complete, pull in the earth tectonic plates dataset from the "data" folder
    d3.json(pathTectonicPlates).then(function(dataPlates) {
        // Once we get a response, send both the earthquake features object and the tectonic plates data to the createFeatures() function
        createFeatures(dataEq.features, dataPlates);
    })
})
.catch(function(error) {
    console.log(error);
});


// Function to create features to be later added to the map
function createFeatures(featuresEq, dataPlates) {

    // Define an array to hold earthquake coordinates
    var earthquakeCircles = [];
    
    for (var i = 0; i < featuresEq.length; i++) {
        
        var coordinates = featuresEq[i].geometry.coordinates

        earthquakeCircles.push(
            L.circle([coordinates[1], coordinates[0]], {
                weight: 0.5,
                opacity: 0.5,
                fillOpacity: 0.6,
                color: "#4169E1",
                fillColor: getColor(coordinates[2]),
                radius: circleSize(featuresEq[i].properties.mag)
            })
            .bindPopup("<h4>" + featuresEq[i].properties.place + "</h4><hr>"
                + "<p>Magnitude: " + featuresEq[i].properties.mag + "</p> "
                + "<p>Time: " + moment(featuresEq[i].properties.time).format("MM/DD/YYYY hh:mm A") + "</p>")
        );
    }

    // Group the circle objects array into a layer group
    var earthquakesLayer = L.layerGroup(earthquakeCircles);

    // Set a style object to customize rendered plates polyons
    var platesStyle = {
        color: "#DDA0DD",
        fill: false,
        opacity: 0.9,
        weight: 1.3
    };

    // Creating a geoJSON layer with the retrieved data
    var platesLayer = L.geoJson(dataPlates, {
        style: platesStyle
    })

    // Pass the layer groups to the createMap() function
    createMap(earthquakesLayer, platesLayer);
}

// Function to create the map
function createMap(earthquakesLayer, platesLayer) {

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
        "Earthquakes": earthquakesLayer,
        "Tectonic Plates": platesLayer
    };

    // Define a map object
    var myMap = L.map("map", {
        center: [49.28, -123.12], //Vancouver, BC, Canada coordinates
        zoom: 4,
        layers: [satelliteMap, earthquakesLayer, platesLayer]
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
