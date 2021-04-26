# Leaflet-Earthquake-GeoMapping

Penn Data Boot Camp Assignment 17 - Interactive map to visualize a USGS earthquake dataset (GeoJSON) using Leaflet for JavaScript.

## Background

The USGS (United States Geological Survey) provides earthquake data in a number of different formats, updated every minute. The goal of this exercise is to visualize an earthquake dataset and map various features including the locations of each earthquake data record using [Leaflet](https://leafletjs.com/) and [Mapbox](https://www.mapbox.com/maps)'s API

Using USGS' GeoJSON Feed, the ["All Earthquakes from the Past 7 Days"](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson) dataset was chosen. To map and visualize the data, here's a brief summary of the steps taken:
1. Connected to and retrieved the data;
2. Plotted all of the earthquake locations from the dataset based on their longitude and latitude. Location markers' sizes and colors vary based on the magnitude and the depth of the earthquake respectively;
3. Binded popups that provide additional information about the earthquake when a marker is clicked;
4. Created a legend that provides context for earthquake depths. _Earthquakes with greater depths appear darker in color (from green to red)_;
5. Included different base maps (satellite map, outdoors map, etc.) to choose from and an additional overlay (world tectonic plates) that can be turned on and off independently. 

## Map Highlights

**Page on Load:**
![Default View](image_highlights/default+popup.png)

**United States West Coast Highlight:**
![Default View](image_highlights/outdoors+zoomed.png)
