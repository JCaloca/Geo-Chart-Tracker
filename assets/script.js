const lastFMApiKey = "7103ecc963d87a0eec25ce7ff0a3508b";
const lastFMBaseURL = "https://ws.audioscrobbler.com/2.0/";
const lastGMSharedSecret = "805e3e44ae25a3661eb4eaca62959ccf"; // Not sure what this is, just keeping it here in case I need it later.

/*
 *  Displays the global top artists when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayGlobalTopArtists(data) {
    console.log("DISPLAYING TOP ARTISTS");
}

/*
 *  Displays the global top tracks when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayGlobalTopTracks(data) {
    console.log("DISPLAYING TOP TRACKS");
}

/*
 *  Fetches the top artists by country name.
 *  Inputs:
 *      countryName: The name of the country we are fetching data for as a string.
 */
function fetchCountryTopArtists(countryName) {

}

/*
 *  Fetches the top tracks by country name.
 *  Inputs:
 *      countryName: The name of the country we are fetching data for as a string.
 */
function fetchCountryTopTracks(countryName) {

}

/*
 *  Fetches the top tracks by country and city name.
 *  Inputs:
 *      countryName:    The name of the country we are fetching data for as a string.
 *      metroName:      The name of the city we are fetching data for as a string.
 */
function fetchMetroTopTracks(cityName, metroName) {

}

/*
 *  Fetches the global top artists.
 */
function fetchGlobalTopArtists() {
    var url = lastFMBaseURL + "?method=chart.gettopartists&api_key=" + lastFMApiKey + "&format=json";

    fetch(url)
        .then(function (response) {
            console.log("response", response);

            return response.json();
        })
        .then(function (data) {
            console.log("data", data);

            displayGlobalTopArtists(data);
        });
}

/*
 *  Fetches the global top tracks.
 */
function fetchGlobalTopTracks() {
    var url = lastFMBaseURL + "?method=chart.gettoptracks&api_key=" + lastFMApiKey + "&format=json";

    fetch(url)
        .then(function (response) {
            console.log("response", response);

            return response.json();
        })
        .then(function (data) {
            console.log("data", data);

            displayGlobalTopTracks(data);
        });
}

var worldjsonPath = "./assets/custom.geo.json"
// function getJSON(worldjsonPath) {
//     fetch(worldjsonPath)
//         .then(function (data) {
//             console.log(data);
//             worldJSON = JSON.parse(data);
//             console.log(worldJSON);
//         });
// }

// getJSON(worldjsonPath);

var map = L.map('map').setView([51.505, -0.09], 2);
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';
var clickedCountry; //adding this so we can pass the city clicked to the fetch function
// import { worldCountries } from "./custom.geo.js";
// var worldGeoJSON = "./assets/custom.geo.json";
//sample stree colored map
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);
var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap, ©CartoDB'
}).addTo(map);

var positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap, ©CartoDB',
    pane: 'labels'
}).addTo(map);

var geojson = L.geoJson(countriesDATA).addTo(map);
geojson.eachLayer(function (layer) {
    layer.bindPopup(layer.feature.properties.name).on('click', function (e) { //adding leaflet event to zoom in at the countries
        map.setView([layer.feature.properties.label_y, layer.feature.properties.label_x], 4);
        clickedCountry = layer.feature.properties.iso_a3;
        //iso_n3: 3 digit code, iso_a3: 3 character code//
        console.log(clickedCountry);
    });
    // map.setView([layer.feature.properties.label_y, layer.feature.properties.label_x], 12);
    // console.log("test");
});

map.fitBounds(geojson.getBounds());


