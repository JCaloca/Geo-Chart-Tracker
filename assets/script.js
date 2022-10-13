const lastFMApiKey = "7103ecc963d87a0eec25ce7ff0a3508b";
const lastFMBaseURL = "https://ws.audioscrobbler.com/2.0/";
const lastFMSharedSecret = "805e3e44ae25a3661eb4eaca62959ccf"; // Not sure what this is, just keeping it here in case I need it later.

/*
 *  Displays the top artists for a particular country when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayCountryTopArtists(data) {
    console.log("DISPLAYING TOP ARTISTS FOR " + data.topartists["@attr"].country.toUpperCase());
}

/*
 *  Displays the top tracks for a particular country when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayCountryTopTracks(data) {
    console.log("DISPLAYING TOP TRACKS FOR " + data.tracks["@attr"].country.toUpperCase());
}

/*
 *  Displays the global top artists when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */

function displayGlobalTopArtists(artistData) {
    console.log("DISPLAYING TOP ARTISTS");
    var charts = document.getElementById("charts");
    var artist = document.getElementById("artistDisplay");
    artist.innerHTML = "";
    artist.innerText = "Top 10 Hottest Artist:";
    for (var i = 0; i < 10; i++) {
        var artistList = document.createElement("li");
        artistList.innerText = artistData.topartists.artist[i].name
        artistList.setAttribute("data-artist", "Top-" + (i + 1));
        // var artistPng = document.createElement("img")
        // artistPng.setAttribute("src", artistData.artists.artist[i].image[0].***#***text)
        // artistList.appendChild(artistPng);
        // ^^ Wasn't able to get the artist images, apparently due to API update? The Jason response had a "#" before the key to call the URL
        //if we want, we can use another API like musicbrainz or spotify to pull the artist ID and get the pic. maybe future planned features
        artist.appendChild(artistList);
    }
};

/*
 *  Displays the global top tracks when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */

function displayGlobalTopTracks(trackData) {
    console.log("DISPLAYING TOP TRACKS");
    var tracks = document.getElementById("tracksDisplay");
    tracks.innerHTML = "";
    tracks.innerText = "Top 10 Hottest Tracks:";
    for (var i = 0; i < 10; i++) {
        var trackList = document.createElement("li");
        trackList.innerText = trackData.tracks.track[i].name + " By: " + trackData.tracks.track[i].artist.name
        trackList.setAttribute("data-track", "Top-" + i);
        tracks.appendChild(trackList);
        // console.log(trackData.tracks.track[i].name);
        // console.log(trackData.tracks.track[i].artist.name);
    }
};

/*
 *  Fetches the top artists by country name.
 *  Inputs:
 *      countryName: The name of the country we are fetching data for as a string.
 */
function fetchCountryTopArtists(countryName) {
    var url = lastFMBaseURL + "?method=geo.gettopartists&country=" + countryName + "&api_key=" + lastFMApiKey + "&format=json";

    fetch(url)
        .then(function (response) {
            console.log("response", response);

            return response.json();
        })
        .then(function (data) {
            console.log("data", data);

            displayGlobalTopArtists(data);
        });
};
    fetch(url)
    .then(function (response) {
        console.log("response", response);

        return response.json();
    })
    .then(function (data) {
        console.log("data", data);

        displayCountryTopArtists(data);
    });
}

/*
 *  Fetches the top tracks by country name.
 *  Inputs:
 *      countryName: The name of the country we are fetching data for as a string.
 */
function fetchCountryTopTracks(countryName) {
    var url = lastFMBaseURL+"?method=geo.gettoptracks&country="+countryName+"&api_key="+lastFMApiKey+"&format=json";

    fetch(url)
    .then(function (response) {
        console.log("response", response);

        return response.json();
    })
    .then(function (data) {
        console.log("data", data);

    var url = lastFMBaseURL + "?method=geo.gettoptracks&country=" + countryName + "&api_key=" + lastFMApiKey + "&format=json";

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

/*
 *  Fetches the top tracks by country and city name.
 *  Inputs:
 *      countryName:    The name of the country we are fetching data for as a string.
 *      metroName:      The name of the city we are fetching data for as a string.
 */
function fetchMetroTopTracks(countryName, metroName) {
    var url = lastFMBaseURL + "?method=geo.gettoptracks&country=" + countryName + "&location=" + metroName + "&api_key=" + lastFMApiKey + "&format=json"

    fetch(url)
        .then(function (response) {
            console.log("response", response);

            return response.json();
        })
        .then(function (data) {
            console.log("data", data);

            displayMetroTopTracks(data);
        });
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
map.getPane('labels').style.zIndex = 650;//always in the front
map.getPane('labels').style.pointerEvents = 'none';
var countryName; //adding this so we can pass the city clicked to the fetch function
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

var geojson = L.geoJson(countriesDATA).addTo(map);//loading the containers and adding it to our map
geojson.eachLayer(function (layer) {
    layer.bindPopup(layer.feature.properties.name).on('click', function (e) { //adding leaflet event to zoom in at the countries
        map.setView([layer.feature.properties.label_y, layer.feature.properties.label_x], 4);
        countryName = layer.feature.properties.name;
        //name // iso_n3: 3 digit code // iso_a3: 3 character code//
        console.log(countryName);//sucessfully getting the country code
        var trackData = fetchCountryTopTracks(countryName);//fetchingTop Tracks using country code
        var artistData = fetchCountryTopArtists(countryName);//fetchingTop Artist using country code

    });
    // map.setView([layer.feature.properties.label_y, layer.feature.properties.label_x], 12);
    // console.log("test");
});

map.fitBounds(geojson.getBounds());
