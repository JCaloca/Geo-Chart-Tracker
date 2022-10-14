var chartTableHeaderElement = $("#chart-table-header");
var chartHeaderElement = $("#chart-header");
var topTracksButton = $("#top-tracks-button");
var topArtistsButton = $("#top-artists-button");

const lastFMApiKey = "7103ecc963d87a0eec25ce7ff0a3508b";
const lastFMBaseURL = "https://ws.audioscrobbler.com/2.0/";
const lastFMSharedSecret = "805e3e44ae25a3661eb4eaca62959ccf"; // Not sure what this is, just keeping it here in case I need it later.

const bandsInTownApiKey = "codingbootcamp";

const spotifyClientID = "27b52f6caffb4a35a8a4d0e4b70d0750";
const spotifyClientSecret = "c465fe59764440a79b727fd65af86bd9";

/* This variable is needed if we click on a country and want to switch tabs. We need someplace to refer to the country that was selected. */
var currentlySelectedCountry = "";

/* Because we are going to paginate the data and only display a chunk of it at a time, we need to save it somewhere. */
var trackData, artistData;

var global = true;

/*
 *  Displays the top artists for a particular country when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayCountryTopArtists() {
  var charts = document.getElementById("chart");
  var artist = document.getElementById("chart-table");
  var modal = document.getElementById("alert");
  artist.innerHTML = ""; //clearing the box ahead of time.
  modal.innerHTML =
    "<button id='close' class='modal-close is-large' aria-label='close'></button>"; //resetting modal box for next pop up with just the button
  // modal.style.zIndex = "650"; // our map ended up has to be set 649 to get this to layer on top

  //if artistData is returning a error
  if (artistData.error) {
    //not last.fm supported
    var modalCont = document.createElement("div");
    var modalBack = document.createElement("div");
    var mapCont = document.getElementById("map");
    mapCont.classList.add("is-invisible"); //hide map
    charts.classList.add("is-invisible"); //get rid of charts durring pop up
    modalCont.classList.add("modal-content"); // bulma modal content class
    modalBack.classList.add("modal-background", "has-background-dark");
    modalCont.innerHTML =
      "<p class= 'has-text-white-ter has-text-centered'>Apologies, we currently do not have access to this country's data. Feel free to click on another country! <p>";
    modal.prepend(modalCont); // add it to our hard-coded html box, before the button on 25
    modal.prepend(modalBack); // almost missed the background
    modal.classList.add("is-active");

    //function to be execute when close btn is clicked.
    //needed to delegate cuz generated btn
    document.addEventListener("click", function (e) {
      var modal = document.getElementById("alert");
      var mapCont = document.getElementById("map");
      if (e.target.id === "close") {
        modal.classList.remove("is-active");
        console.log("AlertClosed");
        mapCont.classList.remove("is-invisible");
        charts.classList.remove("is-invisible");
      }
    });
  } else {
    //if not error then

    console.log(
      "DISPLAYING TOP ARTISTS FOR " +
        artistData.topartists["@attr"].country.toUpperCase()
    );

    /* Set the header above the artist chart display. */
    var countryName = artistData.topartists["@attr"].country;
    countryName.charAt(0).toUpperCase(); // we want the first letter in the country name to be capitalized (Brazil instead of brazil).
    chartHeaderElement.text("Top Artists for " + countryName); // This is a jQuery Object, not a regular DOM element.

    var artistList = document.createElement("tbody");
    artist.appendChild(artistList);

    //artist.innerText = "Top 10 ARTISTS FOR " + artistData.topartists["@attr"].country.toUpperCase();
    for (var i = 0; i < 10; i++) {
      var artistRow = document.createElement("tr");

      // var thead = document.createElement("thead");
      artistRow.innerHTML =
        "<th>" +
        (i + 1) +
        "</th> <td> <p>" +
        artistData.topartists.artist[i].name +
        "</p> </td>";
      // artistList.innerText = artistData.topartists.artist[i].name;
      artistRow.setAttribute("data-artist", "Top-" + (i + 1));

      var artistName = artistData.topartists.artist[i].name;
      var dataCell = document.createElement("td");
      artistRow.appendChild(dataCell);

      var artistImage = document.createElement("img");
      fetchArtistImageURL(artistName, artistImage);
      $(artistImage).addClass("image is-24x24");
      dataCell.appendChild(artistImage);

      // var artistPng = document.createElement("img")
      // artistPng.setAttribute("src", artistData.artists.artist[i].image[0].***#***text)
      // artistList.appendChild(artistPng);
      // ^^ Wasn't able to get the artist images, apparently due to API update? The Jason response had a "#" before the key to call the URL
      //if we want, we can use another API like musicbrainz or spotify to pull the artist ID and get the pic. maybe future planned features
      artistList.appendChild(artistRow);
    }
  }
}

/*
 *  Displays the top tracks for a particular country when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayCountryTopTracks() {
  var tracks = document.getElementById("chart-table");
  tracks.innerHTML = ""; //emptying no matter what

  // catch error
  if (trackData.error) {
    console.log("Meow");
  } else {
    console.log(
      "DISPLAYING TOP TRACKS FOR " +
        trackData.tracks["@attr"].country.toUpperCase()
    );

    /* Set the header above the track chart display. */
    var countryName = trackData.tracks["@attr"].country;
    countryName.charAt(0).toUpperCase(); // we want the first letter in the country name to be capitalized (Brazil instead of brazil).
    chartHeaderElement.text("Top Tracks for " + countryName); // This is a jQuery Object, not a regular DOM element.

    var trackList = document.createElement("tbody");
    tracks.appendChild(trackList);

    //tracks.innerText = "Top 10 TRACKS FOR " + trackData.tracks["@attr"].country.toUpperCase();
    for (var i = 0; i < 10; i++) {
      var trackRow = document.createElement("tr");

      trackRow.innerHTML =
        "<th>" +
        (i + 1) +
        " </th> <td> <p>  " +
        trackData.tracks.track[i].name +
        "-by " +
        trackData.tracks.track[i].artist.name +
        "</p> </td>";
      // trackList.innerText = trackData.tracks.track[i].name + " By: " + trackData.tracks.track[i].artist.name
      trackRow.setAttribute("data-track", "Top-" + i);

      var artistName = trackData.tracks.track[i].artist.name;
      var dataCell = document.createElement("td");
      trackRow.appendChild(dataCell);

      var artistImage = document.createElement("img");
      fetchArtistImageURL(artistName, artistImage);
      $(artistImage).addClass("image is-24x24");
      dataCell.appendChild(artistImage);

      trackList.appendChild(trackRow);
    }
  }
}
/*
 *  Displays the global top artists when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayGlobalTopArtists(artistData) {
  console.log("DISPLAYING TOP ARTISTS");
  // var charts = document.getElementById("charts");
  // var artist = document.getElementById("artistDisplay");
  // artist.innerHTML = "";
  // artist.innerText = "Top 10 Hottest Artist:";
  // for (var i = 0; i < 10; i++) {
  //     var artistList = document.createElement("li");
  //     artistList.innerText = artistData.topartists.artist[i].name
  //     artistList.setAttribute("data-artist", "Top-" + (i + 1));
  //     // var artistPng = document.createElement("img")
  //     // artistPng.setAttribute("src", artistData.artists.artist[i].image[0].***#***text)
  //     // artistList.appendChild(artistPng);
  //     // ^^ Wasn't able to get the artist images, apparently due to API update? The Jason response had a "#" before the key to call the URL
  //     //if we want, we can use another API like musicbrainz or spotify to pull the artist ID and get the pic. maybe future planned features
  //     artist.appendChild(artistList);
  // }
}

/*
 *  Displays the global top tracks when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayGlobalTopTracks(trackData) {
  console.log("DISPLAYING TOP TRACKS");
  // var tracks = document.getElementById("tracksDisplay");
  // tracks.innerHTML = "";
  // tracks.innerText = "Top 10 Hottest Tracks:";
  // for (var i = 0; i < 10; i++) {
  //     var trackList = document.createElement("li");
  //     trackList.innerText = trackData.tracks.track[i].name + " By: " + trackData.tracks.track[i].artist.name
  //     trackList.setAttribute("data-track", "Top-" + i);
  //     tracks.appendChild(trackList);
  // console.log(trackData.tracks.track[i].name);
  // console.log(trackData.tracks.track[i].artist.name);
}

/*
 *  Displays the global top artists when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayGlobalTopArtists(artistData) {
  console.log("DISPLAYING TOP ARTISTS");
  // var charts = document.getElementById("charts");
  // var artist = document.getElementById("artistDisplay");
  // artist.innerHTML = "";
  // artist.innerText = "Top 10 Hottest Artist:";
  // for (var i = 0; i < 10; i++) {
  //     var artistList = document.createElement("li");
  //     artistList.innerText = artistData.topartists.artist[i].name
  //     artistList.setAttribute("data-artist", "Top-" + (i + 1));
  //     // var artistPng = document.createElement("img")
  //     // artistPng.setAttribute("src", artistData.artists.artist[i].image[0].***#***text)
  //     // artistList.appendChild(artistPng);
  //     // ^^ Wasn't able to get the artist images, apparently due to API update? The Jason response had a "#" before the key to call the URL
  //     //if we want, we can use another API like musicbrainz or spotify to pull the artist ID and get the pic. maybe future planned features
  //     artist.appendChild(artistList);
  // }
}

/*
 *  Displays the global top tracks when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayGlobalTopTracks(trackData) {
  console.log("DISPLAYING TOP TRACKS");
  // var tracks = document.getElementById("tracksDisplay");
  // tracks.innerHTML = "";
  // tracks.innerText = "Top 10 Hottest Tracks:";
  // for (var i = 0; i < 10; i++) {
  //     var trackList = document.createElement("li");
  //     trackList.innerText = trackData.tracks.track[i].name + " By: " + trackData.tracks.track[i].artist.name
  //     trackList.setAttribute("data-track", "Top-" + i);
  //     tracks.appendChild(trackList);
  // console.log(trackData.tracks.track[i].name);
  // console.log(trackData.tracks.track[i].artist.name);
}

/*
 *  Fetches the image URL of the image for the artist. Because it takes time to fetch the image for the artist, I need to pass on the image
 *  element as a parameter along with the artist name, so that I can set the source of the image as soon as I get it.
 *
 *  This function uses the Bands In Town API:
 *  https://rest.bandsintown.com/artists/
 *
 *  NOTE: We only need to use the Bands In Town API as the last.fm API does not include any images for the artist/track. All image links
 *  last.fm gives are just placeholder stars.
 *
 *  INPUTS:
 *      artistName:     The name of the artist in the form of a string.
 *      imageElement:   The vanilla JS DOM Element of the image whose source we need to set.
 */
function fetchArtistImageURL(artistName, imageElement) {
  var url =
    "https://rest.bandsintown.com/artists/" +
    artistName +
    "?app_id=" +
    bandsInTownApiKey;

  fetch(url)
    .then(function (response) {
      //console.log("response", response);

      return response.json();
    })
    .then(function (data) {
      //console.log("data", data);

      var imageURL = data.thumb_url;
      imageElement.setAttribute("src", imageURL);
    });
}

async function fetchCountryData(countryName) {
    /* 
     *  When a country is selected, we'll just get all the data at once, and then what is displayed just depends on the toggle and button that the user hits.
     */
    let first = fetchCountryTopTracks(countryName);
    let second = fetchCountryTopArtists(countryName);

    console.log("FETCHING COUNTRY DATA");

    Promise.all([first, second]).then(function() {
      console.log("DISPLAYING DATA");
      if (topTracksButton.parent().is(".is-active")) {
          displayCountryTopTracks();
      } else {
          displayCountryTopArtists();
      }
  });
}

/*
 *  Fetches the top artists by country name.
 *  Inputs:
 *      countryName: The name of the country we are fetching data for as a string.
 */
function fetchCountryTopArtists(countryName) {
  var url =
    lastFMBaseURL +
    "?method=geo.gettopartists&country=" +
    countryName +
    "&api_key=" +
    lastFMApiKey +
    "&format=json";

    var result =
  fetch(url)
    .then(function (response) {
      console.log("response", response);

      return response.json();
    })
    .then(function (data) {
      console.log("data", data);

      artistData = data;

      console.log("TOP ARTISTS SUCCESSFULLY FETCHED");

      return data;
    });

    return result;
}

/*
 *  Fetches the top tracks by country name.
 *  Inputs:
 *      countryName: The name of the country we are fetching data for as a string.
 */
function fetchCountryTopTracks(countryName) {
  var url =
    lastFMBaseURL +
    "?method=geo.gettoptracks&country=" +
    countryName +
    "&api_key=" +
    lastFMApiKey +
    "&format=json";

  var result =

  fetch(url)
    .then(function (response) {
      console.log("response", response);

      return response.json();
    })
    .then(function (data) {
      console.log("data", data);

      trackData = data;

      console.log("TOP TRACKS SUCCESSFULLY FETCHED");

      return data;
    });

    return result;
}

/*
 *  Fetches the top tracks by country and city name.
 *  Inputs:
 *      countryName:    The name of the country we are fetching data for as a string.
 *      metroName:      The name of the city we are fetching data for as a string.
 */
function fetchMetroTopTracks(countryName, metroName) {
  var url =
    lastFMBaseURL +
    "?method=geo.gettoptracks&country=" +
    countryName +
    "&location=" +
    metroName +
    "&api_key=" +
    lastFMApiKey +
    "&format=json";

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
  var url =
    lastFMBaseURL +
    "?method=chart.gettopartists&api_key=" +
    lastFMApiKey +
    "&format=json";

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
  var url =
    lastFMBaseURL +
    "?method=chart.gettoptracks&api_key=" +
    lastFMApiKey +
    "&format=json";

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
 *  This function contains the logic for when the top artists button is clicked.
 *  When the top artists button is clicked:
 *    1. If the top artists button isn't already active:
 *    2. Remove the active state from the top tracks button.
 *    3. Add the active state to the top artists button.
 *    4. Display the results for the top artists from the currently selected country.
 */
function topArtistsOnClick(event) {
    /* The active state is actually held in the parent of the top artists button. */
    liParent = topArtistsButton.parent();

    /* 1. If the top artists button isn't already active: */
    if (!liParent.is(".is-active")) {
        /* 2. Remove the active state from the top tracks button. */
        topTracksButton.parent().removeClass("is-active");

        /* 3. Add the active state to the top artists button. */
        liParent.addClass("is-active");

        /* 4. Display the results for the top artists from the currently selected country, or the globe if no country is selected. */
        if (!currentlySelectedCountry) {
            displayGlobalTopArtists();
        } else {
            displayCountryTopArtists(currentlySelectedCountry);
        }
    } else {
      //console.log("TOP ARTISTS BUTTON ALREADY ACTIVE");
    }
}

/*
 *  This function contains the logic for when the top tracks button is clicked.
 *  When the top tracks button is clicked:
 *    1.  If the top tracks button isn't already active:
 *    2.  Remove the active state from the top artists button.
 *    3.  Add the active state to the top tracks button.
 *    4.  Fetch and display the results for the top tracks from the currently selected country.
 */
function topTracksOnClick(event) {
    /* The active state is actually held in the parent of the top artists button. */
    liParent = topTracksButton.parent();

    /* 1.  If the top tracks button isn't already active: */
    if (!liParent.is(".is-active")) {
        /* 2.  Remove the active state from the top artists button. */
        topArtistsButton.parent().removeClass("is-active");

        /* 3.  Add the active state to the top tracks button. */
        liParent.addClass("is-active");

        /* 4. Fetch and display the results for the top tracks from the currently selected country, or the globe if no country is selected. */
        if (global) {
            displayGlobalTopTracks();
        } else {
            displayCountryTopTracks(currentlySelectedCountry);
        }
    }
}

// var worldjsonPath = "./assets/custom.geo.json"
// function getJSON(worldjsonPath) {
//     fetch(worldjsonPath)
//         .then(function (data) {
//             console.log(data);
//             worldJSON = JSON.parse(data);
//             console.log(worldJSON);
//         });
// }

// getJSON(worldjsonPath);

var map = L.map("map", {
  center: [0, 0],
  maxZoom: 4,
});
map.setMaxBounds([
  [-85.0511, -180],
  [85.0511, 180],
]);
map.fitWorld();
map.createPane("labels");
map.getPane("labels").style.zIndex = 650; //always in the front
map.getPane("labels").style.pointerEvents = "none";
L.control
  .scale({ position: "bottomleft", metric: true, imperial: false })
  .addTo(map);
var countryName; //adding this so we can pass the city clicked to the fetch function
// import { worldCountries } from "./custom.geo.js";
// var worldGeoJSON = "./assets/custom.geo.json";
//sample stree colored map
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);
var positron = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
  {
    attribution: "©OpenStreetMap, ©CartoDB",
    continuousWorld: false,
    // noWrap: true,
    // Bounds: [[-85.0511, -180], [85.0511, 180]],
    // maxZoom: 4
  }
).addTo(map);

var positronLabels = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  {
    attribution: "©OpenStreetMap, ©CartoDB",
    continuousWorld: false,
    // noWrap: true,
    // Bounds: [[-85.0511, -180], [85.0511, 180]],
    // maxZoom: 4,
    pane: "labels",
  }
).addTo(map);

var geojson = L.geoJson(countriesDATA).addTo(map); //loading the containers and adding it to our map
geojson.eachLayer(function (layer) {
  layer.bindPopup(layer.feature.properties.name).on("click", function (e) {
    //adding leaflet event to zoom in at the countries
    map.setView(
      [layer.feature.properties.label_y, layer.feature.properties.label_x],
      4
    );

    localStorage.setItem(layer.feature.properties.name, [
      layer.feature.properties.label_y,
      layer.feature.properties.label_x,
    ]);
    countryName = layer.feature.properties.name_long;
    //name // iso_n3: 3 digit code // iso_a3: 3 character code//
    console.log(countryName); //sucessfully getting the country code

    addingButtons();
    currentlySelectedCountry = countryName; // We need to set this when a country is clicked in case we switch tabs.
    fetchCountryData(countryName);
    global = false;

  });
  // map.setView([layer.feature.properties.label_y, layer.feature.properties.label_x], 12);
  // console.log("test");
});

// to generate a button of previously clicked on countries
function addingButtons() {
  var searchHistory = document.getElementById("search-history");
  var saveButton = document.createElement("button");
  saveButton.innerText = countryName;
  saveButton.setAttribute("id", countryName);
  saveButton.classList.add("recall");
  searchHistory.append(saveButton);
}

// created event listener for appended button to recall to countries coodinates
$(function recallCountry() {
  var searchHistory = document.getElementById("search-history");
  $(searchHistory).on("click", ".recall", function () {
    console.log(this.id);
    countryName = this.id;
    var previousCountry = localStorage.getItem(countryName);
    var coordinates = previousCountry.split(",");
    console.log(coordinates);
    map.setView([coordinates[0], coordinates[1]], 4);
    var trackData = fetchCountryTopTracks(countryName);
  });
});

map.fitBounds(geojson.getBounds());

topTracksButton.on("click", topTracksOnClick);
topArtistsButton.on("click", topArtistsOnClick);