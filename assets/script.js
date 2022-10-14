var artistChartHeaderElement = $("#artist-chart-header");
var trackChartHeaderElement = $("#tracks-chart-header");
var tracksTableHeaderElement = $("#tracks-table-header");
var artistTableHeaderElement = $("#artist-table-header");

const lastFMApiKey = "7103ecc963d87a0eec25ce7ff0a3508b";
const lastFMBaseURL = "https://ws.audioscrobbler.com/2.0/";
const lastFMSharedSecret = "805e3e44ae25a3661eb4eaca62959ccf"; // Not sure what this is, just keeping it here in case I need it later.

const bandsInTownApiKey = "codingbootcamp";

const spotifyClientID = "27b52f6caffb4a35a8a4d0e4b70d0750";
const spotifyClientSecret = "c465fe59764440a79b727fd65af86bd9";

/*
 *  Displays the top artists for a particular country when given the data from a JSON request.
 *  Inputs:
 *      data:   A JSON object representing the data we get back from the last.fm API
 */
function displayCountryTopArtists(artistData) {
  var charts = document.getElementById("charts");
  var artist = document.getElementById("artistDisplay");
  var modal = document.getElementById("alert");
  artist.innerHTML = ""; //clearing the box ahead of time. 
  modal.innerHTML = "<button id='close' class='modal-close is-large' aria-label='close'></button>";//resetting modal box for next pop up with just the button
  // modal.style.zIndex = "650"; // our map ended up has to be set 649 to get this to layer on top

  //if artistData is returning a error
  if (artistData.error) { //not last.fm supported
    var modalCont = document.createElement("div");
    var modalBack = document.createElement("div");
    var mapCont = document.getElementById("map");
    mapCont.classList.add("is-invisible"); //hide map
    charts.classList.add("is-invisible"); //get rid of charts durring pop up
    modalCont.classList.add("modal-content"); // bulma modal content class
    modalBack.classList.add("modal-background", "has-background-dark");
    modalCont.innerHTML = "<p class= 'has-text-white-ter has-text-centered'>Apologies, we currently do not have access to this country's data. Feel free to click on another country! <p>";
    modal.prepend(modalCont); // add it to our hard-coded html box, before the button on 25
    modal.prepend(modalBack); // almost missed the background
    modal.classList.add("is-active");

    //function to be execute when close btn is clicked.
    //needed to delegate cuz generated btn
    document.addEventListener('click', function (e) {
      var modal = document.getElementById("alert");
      var mapCont = document.getElementById("map");
      if (e.target.id === "close") {
        modal.classList.remove("is-active");
        console.log("AlertClosed");
        mapCont.classList.remove("is-invisible");
        charts.classList.remove("is-invisible");
      }
    }
    );

  } else { //if not error then

    console.log(
      "DISPLAYING TOP ARTISTS FOR " +
      artistData.topartists["@attr"].country.toUpperCase()
    );

    /* Set the header above the artist chart display. */
    var countryName = artistData.topartists["@attr"].country;
    countryName.charAt(0).toUpperCase();  // we want the first letter in the country name to be capitalized (Brazil instead of brazil).
    artistChartHeaderElement.text("Top Artists for " + countryName); // This is a jQuery Object, not a regular DOM element.

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
function displayCountryTopTracks(trackData) {
  var tracks = document.getElementById("tracksDisplay");
  tracks.innerHTML = ""; //emptying no matter what

  // catch error
  if (trackData.error) {
    console.log("Meow")
  } else {

    console.log("DISPLAYING TOP TRACKS FOR " + trackData.tracks["@attr"].country.toUpperCase());

    /* Set the header above the track chart display. */
    var countryName = trackData.tracks["@attr"].country;
    countryName.charAt(0).toUpperCase();  // we want the first letter in the country name to be capitalized (Brazil instead of brazil).
    trackChartHeaderElement.text("Top Tracks for " + countryName); // This is a jQuery Object, not a regular DOM element.

    var trackList = document.createElement("tbody");
    tracks.appendChild(trackList);

    //tracks.innerText = "Top 10 TRACKS FOR " + trackData.tracks["@attr"].country.toUpperCase();
    for (var i = 0; i < 10; i++) {
      var trackRow = document.createElement("tr");

      trackRow.innerHTML = "<th>" + (i + 1) + "</th> <td> <p>" + trackData.tracks.track[i].name + "-by " + trackData.tracks.track[i].artist.name + "</p> </td>"
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
};

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
  var url = "https://rest.bandsintown.com/artists/" + artistName + "?app_id=" + bandsInTownApiKey;

  fetch(url)
    .then(function (response) {
      console.log("response", response);

      return response.json();
    })
    .then(function (data) {
      console.log("data", data);

      var imageURL = data.thumb_url;
      imageElement.setAttribute("src", imageURL);
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
  var url =
    lastFMBaseURL +
    "?method=geo.gettoptracks&country=" +
    countryName +
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

      displayCountryTopTracks(data);
    });
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
    countryName = layer.feature.properties.name_long;
    //name // iso_n3: 3 digit code // iso_a3: 3 character code//
    console.log(countryName); //sucessfully getting the country code
    var trackData = fetchCountryTopTracks(countryName); //fetchingTop Tracks using country code
    var artistData = fetchCountryTopArtists(countryName); //fetchingTop Artist using country code
  });
  // map.setView([layer.feature.properties.label_y, layer.feature.properties.label_x], 12);
  // console.log("test");
});

map.fitBounds(geojson.getBounds());
