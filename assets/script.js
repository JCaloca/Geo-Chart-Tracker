var chartTableHeaderElement = $("#chart-table-header");
var chartHeaderElement = $("#chart-header");
var topTracksButton = $("#top-tracks-button");
var topArtistsButton = $("#top-artists-button");
var firstPaginationLinkElement = $("#first-pagination-link");
var globalToggleButton = $("#global-toggle-button");

const lastFMApiKey = "7103ecc963d87a0eec25ce7ff0a3508b";
const lastFMBaseURL = "https://ws.audioscrobbler.com/2.0/";
const lastFMSharedSecret = "805e3e44ae25a3661eb4eaca62959ccf"; // Not sure what this is, just keeping it here in case I need it later.

const bandsInTownApiKey = "codingbootcamp";

const spotifyClientID = "27b52f6caffb4a35a8a4d0e4b70d0750";
const spotifyClientSecret = "c465fe59764440a79b727fd65af86bd9";

/* The maximum amount of pages we will display */
const MAX_PAGES = 5;
const MAX_RESULTS_PER_PAGE = 10;

/* This variable is needed if we click on a country and want to switch tabs. We need someplace to refer to the country that was selected. */
var currentlySelectedCountry = "";

/*
 *  I need to keep track of the currently selected feature on the map so I can remove the class selected when a new country is selected.
 *  This variable needs to be updated everytime a country is selected.
 */
var currentlySelectedFeature;

/* Because we are going to paginate the data and only display a chunk of it at a time, we need to save it somewhere. */
var trackData, artistData;

/*
 *  This is the text for the region we are searching top artists/tracks for. It's easiest just to set it when we fetch data for a certain
 *  region (either a country or the globe) rather than have a boolean representing whether we are searching the globe or not and
 *  having a massive if-else statement to navigate through that.
 */
var regionText;

/*
 *  A boolean indicating we are doing a global search. This variable is used by the function generateArtistTablePage() as name of the list of
 *  top artists globally is different than the name of the top artists returned in a country top artists fetch within the data object.
 *  this variable needs to be updated appropriately after every fetch call.
 */
var global;

/* I'll just set this up here so I can refer to it in a function. */
var geojson, map;

/*
 *  Defines the style of the country on select. I'm defining it here as multiple functions use this style, so I only have to modify it here if
 *  I want to change it.
 */
var selectedStyle = {
  weight: 5,
  fillColor: "#fca943",
  color: "#465ED3",
  dashArray: "",
  fillOpacity: 0.7,
  className: "selected",
};

/*
 *  This function defines the default style of each polygon country on our map.
 *
 *  For reference to why the style is defined this way see:
 *  https://leafletjs.com/reference.html#geojson-style
 */
function countryStyle(feature) {
  return {
    fillColor: "transparent",
    weight: 2,
    opacity: 1,
    color: "#300948",
    dashArray: "3",
    fillOpacity: 0.7,
    className: "not-selected",
  };
}

/* Removes the is-active class from the toggle button only if it has that class. */
function deselectGlobalToggleButton() {
  if (globalToggleButton.parent().is(".is-active")) {
    globalToggleButton.parent().removeClass("is-active");
  }
}

/*
 *  This is the only function that should be called upon to display chart results to the page. Because we have toggle and pagination lists,
 *  it's hard to keep track of what to display. The logic for what information is displayed given which toggles and pages are active goes here.
 *
 *  In order to display the chart, we have to:
 *    1. Empty out the chart display element.
 *    2. See what page we are looking at.
 *    3. See what button is toggled.
 *      a. If the tracks button is toggled, we call displayTopTracks with the index of the page.
 *      b. If the artists button is toggled, we call displayTopArtists with the index of the page.
 */
function displayChart() {
  /* 1. Empty out the chart display element. */
  var chartTableElement = document.getElementById("chart-table");
  chartTableElement.innerHTML = "";

  /* 2. See what page we are looking at. */
  var activePaginationElement = $(".is-current");
  pageIndex = parseInt(activePaginationElement.text());

  /* 3. See what button is toggled. */
  /* 3. a. If the tracks button is toggled, we call displayTopTracks with the index of the page. */
  if (topTracksButton.parent().is(".is-active")) {
    displayTopTracks(pageIndex);
  } else {
    /* 3. b. If the artists button is toggled, we call displayTopArtists with the index of the page. */
    displayTopArtists(pageIndex);
  }
}

/*
 *  Displays the top artists when given the page we are on.
 *  This function uses the variable artistData to display the tracks, so that variable MUST be set by fetching the data beforehand.
 *
 *  Inputs:
 *      pageIndex:  The index of the page we are (either 1, 2, 3, 4, or 5)
 */
function displayTopArtists(pageIndex) {
  var charts = document.getElementById("chart");
  var artist = document.getElementById("chart-table");
  var modal = document.getElementById("alert");
  //artist.innerHTML = ""; //clearing the box ahead of time.
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
      "<p class= 'has-text-white-ter has-text-centered'>Apologies, we currently do not have access to " +
      countryName +
      "'s trending data. Feel free to click on another country! <p>";
    modal.prepend(modalCont); // add it to our hard-coded html box, before the button on 25
    modal.prepend(modalBack); // almost missed the background
    modal.classList.add("is-active");
    // additional feedback when country is not supported instead showing last searched
    chartHeaderElement.text("No Trending Data Available");

    //function to be execute when close btn is clicked.
    //needed to delegate cuz generated btn
    document.addEventListener("click", function (e) {
      var modal = document.getElementById("alert");
      var mapCont = document.getElementById("map");
      var errorBtn = document.getElementById(countryName);
      if (e.target.id === "close") {
        modal.classList.remove("is-active");
        console.log("AlertClosed");
        mapCont.classList.remove("is-invisible");
        charts.classList.remove("is-invisible");
        //chaning error city button to red on modal close
        errorBtn.classList.remove("is-primary");
        errorBtn.classList.remove("is-warning");
        errorBtn.classList.add("is-danger");
      }
    });
  } else {
    /* We need the if statement here if we want to have different text depending on whether you search globally or for a country. */
    if (global) {
      chartHeaderElement.text(regionText + " Artists:"); // This is a jQuery Object, not a regular DOM element.
    } else {
      chartHeaderElement.text("Top Artists " + regionText);
    }

    var artistList = generateArtistTablePage(pageIndex);
    artist.appendChild(artistList);
  }
}

/*
 *  Displays the top tracks when given the page we are on.
 *  This function uses the variable trackData to display the tracks, so that variable MUST be set by fetching the data beforehand.
 *
 *  Inputs:
 *      pageIndex:  The index of the page we want to display (either 1, 2, 3, 4, or 5)
 */
function displayTopTracks(pageIndex) {
  var charts = document.getElementById("chart");
  var tracks = document.getElementById("chart-table");
  var modal = document.getElementById("alert");
  modal.innerHTML =
    "<button id='close' class='modal-close is-large' aria-label='close'></button>";
  //resetting modal box for next pop up with just the button

  //if trackData is returning a error
  if (trackData.error) {
    //not last.fm supported
    var modalCont = document.createElement("div");
    var modalBack = document.createElement("div");
    var mapCont = document.getElementById("map");
    mapCont.classList.add("is-invisible"); //hide map
    charts.classList.add("is-invisible"); //get rid of charts durring pop up
    modalCont.classList.add("modal-content"); // bulma modal content class
    modalBack.classList.add("modal-background", "has-background-dark");
    modalCont.innerHTML =
      "<p class= 'has-text-white-ter has-text-centered'>Apologies, we currently do not have access to " +
      countryName +
      "'s trending data. Feel free to click on another country! <p>";
    modal.prepend(modalCont); // add it to our hard-coded html box, before the button on 25
    modal.prepend(modalBack); // almost missed the background
    modal.classList.add("is-active");
    // additional feedback when country is not supported instead showing last searched
    chartHeaderElement.text("No Trending Data Available");

    //function to be execute when close btn is clicked.
    //needed to delegate cuz generated btn
    document.addEventListener("click", function (e) {
      var modal = document.getElementById("alert");
      var mapCont = document.getElementById("map");
      var errorBtn = document.getElementById(countryName);
      if (e.target.id === "close") {
        modal.classList.remove("is-active");
        console.log("AlertClosed");
        mapCont.classList.remove("is-invisible");
        charts.classList.remove("is-invisible");
        errorBtn.classList.remove("is-primary");
        errorBtn.classList.remove("is-warning");
        errorBtn.classList.add("is-danger");
      }
    });
  } else {
    /* We need the if statement here if we want to have different text depending on whether you search globally or for a country. */
    if (global) {
      chartHeaderElement.text(regionText + " Tracks:"); // This is a jQuery Object, not a regular DOM element.
    } else {
      chartHeaderElement.text("Top Tracks " + regionText);
    }
    var trackList = generateTrackTablePage(pageIndex);
    tracks.appendChild(trackList);
  }
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

/*
 *  Fetches and displays the top chart data for a country with the given country name.
 *  The reason why I am fetching and displaying the data in the same function as opposed to separating that is that we need to wait for the
 *  data to be fetched first to display the data, so displaying the data is kind of dependant on the fetch functions.
 *
 *  When we fetch and display country data we need to:
 *    1. Set the global variable to false so generateArtistTablePage() knows the correct name for the artist list in the data we get back.
 *    2. Set the region text to display as the header above the chart table.
 *    3. Reset the pagination links as we have new data.
 *    4. We'll fetch both the top track and top artist data.
 *    5. Then, once both fetches are complete:
 *      a. We display the chart.
 */
function fetchAndDisplayCountryData(countryName) {
  /* 1. Set the global variable to false so generateArtistTablePage() knows the correct name for the artist list in the data we get back. */
  global = false;

  /* 2. Set the region text to display as the header above the chart table. */
  regionText = "for " + countryName;

  /* 3. Reset the pagination links as we have new data. */
  resetPaginationLinks();

  /* 4. We'll fetch both the top track and top artist data. */
  let first = fetchCountryTopTracks(countryName);
  let second = fetchCountryTopArtists(countryName);

  /* 5. Then, once both fetches are complete: */
  Promise.all([first, second]).then(function () {
    /* 5. a. We display the chart. */
    displayChart();
  });
}

/*
 *  Fetches and displays the global chart data.
 *  The reason why I am fetching and displaying the data in the same function as opposed to separating that is that we need to wait for the
 *  data to be fetched first to display the data, so displaying the data is kind of dependant on the fetch functions.
 *
 *  When we fetch and display global data we need to:
 *    1. Set the global variable to true so generateArtistTablePage() knows the correct name for the artist list in the data we get back.
 *    2. Set the region text to display as the header above the chart table.
 *    3. Reset the pagination links as we have new data.
 *    4. We'll fetch both the top track and top artist data.
 *    5. Then, once both fetches are complete:
 *      a. We display the chart.
 */
function fetchAndDisplayGlobalData() {
  /* 1. Set the global variable to true so generateArtistTablePage() knows the correct name for the artist list in the data we get back. */
  global = true;

  /* 2. Set the region text to display as the header above the chart table. */
  regionText = "Global Top";

  /* 3. Reset the pagination links as we have new data. */
  resetPaginationLinks();

  /* 4. We'll fetch both the top track and top artist data. */
  let first = fetchGlobalTopTracks();
  let second = fetchGlobalTopArtists();

  /* 5. Then, once both fetches are complete: */
  Promise.all([first, second]).then(function () {
    /* 5. a. We display the chart. */
    displayChart();
  });
}

/*
 *  Fetches the top artists by country name.
 *
 *  Inputs:
 *      countryName: The name of the country we are fetching data for as a string.
 *  Returns:
 *    result:  A promise that we will use later to wait for the fetch response before displaying the data.
 */
function fetchCountryTopArtists(countryName) {
  var url =
    lastFMBaseURL +
    "?method=geo.gettopartists&country=" +
    countryName +
    "&api_key=" +
    lastFMApiKey +
    "&format=json";

  var result = fetch(url)
    .then(function (response) {
      //console.log("response", response);

      return response.json();
    })
    .then(function (data) {
      //console.log("data", data);

      artistData = data;
    });

  return result;
}

/*
 *  Fetches the top tracks by country name.
 *
 *  Inputs:
 *      countryName: The name of the country we are fetching data for as a string.
 *  Returns:
 *    result:  A promise that we will use later to wait for the fetch response before displaying the data.
 */
function fetchCountryTopTracks(countryName) {
  var url =
    lastFMBaseURL +
    "?method=geo.gettoptracks&country=" +
    countryName +
    "&api_key=" +
    lastFMApiKey +
    "&format=json";

  var result = fetch(url)
    .then(function (response) {
      //console.log("response", response);

      return response.json();
    })
    .then(function (data) {
      //console.log("data", data);

      trackData = data;
    });

  return result;
}

/*
 *  Fetches the global top artists.
 *
 *  Returns:
 *    result:  A promise that we will use later to wait for the fetch response before displaying the data.
 */
function fetchGlobalTopArtists() {
  var url =
    lastFMBaseURL +
    "?method=chart.gettopartists&api_key=" +
    lastFMApiKey +
    "&format=json";

  let result = fetch(url)
    .then(function (response) {
      console.log("response", response);

      return response.json();
    })
    .then(function (data) {
      console.log("data", data);

      artistData = data;
    });

  return result;
}

/*
 *  Fetches the global top tracks and sets it to trackData so that we can use it to display portions of the data received later.
 *
 *  Returns:
 *    result:  A promise that we will use later to wait for the fetch response before displaying the data.
 */
function fetchGlobalTopTracks() {
  var url =
    lastFMBaseURL +
    "?method=chart.gettoptracks&api_key=" +
    lastFMApiKey +
    "&format=json";

  let result = fetch(url)
    .then(function (response) {
      console.log("response", response);

      return response.json();
    })
    .then(function (data) {
      console.log("data", data);

      trackData = data;
    });

  return result;
}

/*
 *  Generates one page of top track results, equivalent to 10 results.
 *
 *  Inputs:
 *    pageIndex:    The index of the page that we are creating. Page indexes start at 1 and end at five, so there is the valid inputs are 1, 2, 3, 4, or 5.
 *  Returns:
 *    artistList:   An HTML element representing a list of top artists that is ready to be inserted as the body of the table element.
 */
function generateArtistTablePage(pageIndex) {
  console.log(artistData);
  var artistList = document.createElement("tbody");

  /* The index we are using is pageIndex-1 as the pages start at index 1, but the array of data that we get back starts at 0, so we have to adjust for that. */
  var index = pageIndex - 1;

  /*
   *  If we are creating, say, page 1 of the results, we need to iterate from 0-10. For page 2, , we will need to iterate through indices 10-19, etc....
   *  So, we need to make a number that is equal to 10 * index, set i to that number, and then have the for loop iterate through the next 10 results.
   */
  var startIndex = index * MAX_RESULTS_PER_PAGE;
  for (var i = startIndex; i < startIndex + MAX_RESULTS_PER_PAGE; i++) {
    var artistRow = document.createElement("tr");
    var topArtistList;

    /* I need to add this if statement here as the list of top artists globally is called "artists" while the list of top artists for a country is called "topartists" */
    if (global) {
      topArtistList = artistData.artists;
    } else {
      topArtistList = artistData.topartists;
    }

    artistRow.innerHTML =
      "<th>" +
      (i + 1) +
      "</th> <td> <p>" +
      topArtistList.artist[i].name +
      "</p> </td>";
    artistRow.setAttribute("data-artist", "Top-" + (i + 1));

    var artistName = topArtistList.artist[i].name;
    var dataCell = document.createElement("td");
    artistRow.appendChild(dataCell);

    /* Link the image to the last.fm artist page. */
    var anchorElement = document.createElement("a");
    var artistURL = topArtistList.artist[i].url;
    anchorElement.setAttribute("href", artistURL);
    anchorElement.setAttribute("target", "_blank");
    dataCell.appendChild(anchorElement);

    var artistImage = document.createElement("img");
    fetchArtistImageURL(artistName, artistImage);
    $(artistImage).addClass("image is-24x24");
    anchorElement.appendChild(artistImage);

    artistList.appendChild(artistRow);
  }

  return artistList;
}

/*
 *  Generates one page of top track results, equivalent to 10 results.
 *
 *  Inputs:   pageIndex:    The index of the page that we are creating. Page indexes start at 1 and end at five, so the valid inputs are 1, 2, 3, 4, or 5.
 *  Returns:  trackList:    An HTML element representing a list of top tracks that is ready to be inserted as the body of the table element.
 *
 *  The html element returned is of the form:
 *  <tbody>
 *    <tr data-artist="Top-{artistListIndex+1}">
 *      <th>{artistListIndex+1}</th>
 *      <td><p>{artistName}</p></td>
 *      <td><img class="image is-24x24" src="{image path}"><td>
 *    </tr>
 *    <tr data-artist="Top-{artistListIndex+1}">
 *      <th>{artistListIndex+1}</th>
 *      <td><p>{artistName}</p></td>
 *      <td><img class="image is-24x24" src="{image path}"><td>
 *    </tr>
 *    ...
 *  </tbody>
 *  (Note that {variableName} means we pull that variable name from the data that we get and it will be different for every chunk of data we get)
 */
function generateTrackTablePage(pageIndex) {
  var trackList = document.createElement("tbody");

  /* The index we are using is pageIndex-1 as the pages start at index 1, but the array of data that we get back starts at 0, so we have to adjust for that. */
  var index = pageIndex - 1;

  /*
   *  If we are creating, say, page 1 of the results, we need to iterate from 0-10. For page 2, , we will need to iterate through indices 10-19, etc....
   *  So, we need to make a number that is equal to 10 * index, set i to that number, and then have the for loop iterate through the next 10 results.
   */
  var startIndex = index * MAX_RESULTS_PER_PAGE;
  for (var i = startIndex; i < MAX_RESULTS_PER_PAGE + startIndex; i++) {
    var trackRow = document.createElement("tr");

    trackRow.innerHTML =
      "<th>" +
      (i + 1) +
      " </th> <td> <p>  " +
      trackData.tracks.track[i].artist.name +
      " - <a href=\"" +
      trackData.tracks.track[i].url +
      "\" target=\"_blank\">" +
      trackData.tracks.track[i].name +
      "</a> </p> </td>";

    trackRow.setAttribute("data-track", "Top-" + (i + 1));

    var artistName = trackData.tracks.track[i].artist.name;
    var dataCell = document.createElement("td");
    trackRow.appendChild(dataCell);

    /* Link the image to the last.fm artist page. */
    var anchorElement = document.createElement("a");
    var artistURL = trackData.tracks.track[i].artist.url;
    anchorElement.setAttribute("href", artistURL);
    anchorElement.setAttribute("target", "_blank");
    dataCell.appendChild(anchorElement);

    var artistImage = document.createElement("img");
    fetchArtistImageURL(artistName, artistImage);
    $(artistImage).addClass("image is-24x24");
    anchorElement.appendChild(artistImage);

    trackList.appendChild(trackRow);
  }

  return trackList;
}

/*
 *  Houses all the logic for the global toggle button on click.
 *  
 *  When the toggle button is clicked we must:
 *    1. If the global toggle button isn't already active:
 *    2. Set the global toggle button to the active state.
 *    3. Remove the selected state from the currently selected feature.
 *    4. Set the currently selected feature to null.
 *    5. Zoom out on the map to the global view.
 *    6. Fetch and display the global top charts.
 */
function globalToggleButtonOnClick(event) {
  /* 1. If the global toggle button isn't already active: */
  if (!globalToggleButton.parent().is(".is-active")) {
    /* 2. Set the global toggle button to the active state. */
    globalToggleButton.parent().addClass("is-active");

    /* 3. Remove the selected state from the currently selected feature. */
    geojson.resetStyle(currentlySelectedFeature);

    /* 4. Set the currently selected feature to null. */
    currentlySelectedFeature = null;

    /* 5. Zoom out on the map to the global view. */
    map.fitWorld();

    /* 6. Fetch and display the global top charts. */
    fetchAndDisplayGlobalData();
  }
}



/*
 *  Defines the style of the country when the mouse hovers over it.
 */
function highlightCountry(e) {
  //console.log(e.target);
  var layer = e.target;

  layer.setStyle({
    weight: 3,
    fillColor: "#50468f",
    color: "#465ED3",
    dashArray: "",
    fillOpacity: 0.7,
  });

  if (!L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

/*
 *  This function defines the listeners that are attached to each country.
 */
function onEachCountry(feature, layer) {
  layer.on({
    mouseover: highlightCountry,
    mouseout: resetHighlight,
    click: setSelected,
  });
}

/*
 *  Logic for the pagination buttons on click.
 *
 *  When the pagination button is clicked we must:
 *    1. If the clicked element is not already active:
 *      a. Remove the active state from the active paginated element.
 *      b. Add the active state to the clicked element.
 *      c. Display the chart.
 */
function paginationButtonOnClick(event) {
  var clickedElement = $(event.target);

  /* 1. If the clicked element is not already active: */
  if (!clickedElement.is(".is-current")) {
    var currentPaginatedElement = $(".is-current");

    /* 1. a. Remove the active state from the current paginated element. */
    currentPaginatedElement.removeClass("is-current");

    /* 1. b. Add the active state to the clicked element. */
    clickedElement.addClass("is-current");

    /* c. Display the chart. */
    displayChart();
  }
}

/*
 *  Defines the mouseout event on a country.
 *
 *  On a mouseout event in a country, we must:
 *    1. If the class is not selected:
 *      a. Reset the style of the country.
 */
function resetHighlight(e) {
  var layer = e.target;

  if (layer.options.className != "selected") {
    geojson.resetStyle(layer);
  } else {
    layer.setStyle(selectedStyle);
  }
}

/*
 *  This function just resets the currently selected pagination link to page 1.
 *
 *  In order to set the currently selected page to page 1 we must:
 *    1. Remove the is-current class from the currently selected pagination link.
 *    2. Add the is-current class to the first pagination link.
 */
function resetPaginationLinks() {
  /* 1. Remove the is-current class from the currently selected pagination link. */
  currentlySelectedElement = $(".is-current");
  currentlySelectedElement.removeClass("is-current");

  /* 2. Add the is-current class to the first pagination link. */
  firstPaginationLinkElement.addClass("is-current");
}

/*
 *  Iterates through all of the features on the map and sets the feature as selected when layer.feature.properties.name_long matches
 *  the input string countryName.
 */
function setCountryAsSelectedAndStyle(countryName) {
  geojson.eachLayer(function (layer) {
    if (layer.feature.properties.name_long === countryName) {
      /*
       *  Now that we have the match, we need to set the style to the selected style, reset the style and state of the currently selected country,
       *  and set the currentlySelectedFeature to this feature.
       */
      geojson.resetStyle(currentlySelectedFeature);
      layer.setStyle(selectedStyle);
      currentlySelectedFeature = layer;
    }
  });
}

/*
 *  Sets the country as selected when the user clicks a country.
 */
function setSelected(e) {
  var layer = e.target;

  /* If there is a country that is currently selected. */
  if (currentlySelectedFeature) {
    /* We need to change the class to not-selected, and reset the style of the country. */
    geojson.resetStyle(currentlySelectedFeature);
  }

  currentlySelectedFeature = layer;

  /* We need to set the class of the feature to selected so that on a mouse out event the style isn't reset. */
  layer.setStyle(selectedStyle);
}

/*
 *  This function contains the logic for when the top artists button is clicked.
 *
 *  When the top artists button is clicked:
 *    1. If the top artists button isn't already active:
 *    2. Remove the active state from the top tracks button.
 *    3. Add the active state to the top artists button.
 *    4. Set the current pagination link to the first page.
 *    5. Display the results for the top artists from the currently selected country.
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

    /* 4. Set the current pagination link to the first page. */
    resetPaginationLinks();

    /* 5. Display the results for the top artists from the currently selected country, or the globe if no country is selected. */
    displayChart();
  }
}

/*
 *  This function contains the logic for when the top tracks button is clicked.
 *
 *  When the top tracks button is clicked:
 *    1.  If the top tracks button isn't already active:
 *    2.  Remove the active state from the top artists button.
 *    3.  Add the active state to the top tracks button.
 *    4.  Set the current pagination link to the first page.
 *    5.  Display the results for the top tracks from the currently selected country.
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

    /* 4. Set the current pagination link to the first page. */
    resetPaginationLinks();

    /* 5. Display the results for the top tracks from the currently selected country, or the globe if no country is selected. */
    displayChart();
  }
}

map = L.map("map", {
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
    // noWrap: true, would stop tiling but throws error when panning
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


geojson = L.geoJson(countriesDATA, {
  style: countryStyle,
  onEachFeature: onEachCountry,
}).addTo(map); //loading the containers and adding it to our map
geojson.eachLayer(function (layer) {
  layer.on("click", function (e) {
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

    addingButtons();
    currentlySelectedCountry = countryName; // We need to set this when a country is clicked in case we switch tabs.
    fetchAndDisplayCountryData(countryName);
    deselectGlobalToggleButton();
  });
  // map.setView([layer.feature.properties.label_y, layer.feature.properties.label_x], 12);
});

// to generate a button of previously clicked on countries
function addingButtons() {
  var searchHistory = document.getElementById("search-history");
  var saveButton = document.createElement("button");
  // var badge = document.createElement("span");

  if (!document.getElementById(countryName)) {
    saveButton.innerText = countryName;
    saveButton.setAttribute("id", countryName);
    saveButton.classList.add(
      "recall",
      "button",
      "is-primary",
      "is-rounded",
      "is-medium",
      "is-responsive",
      "mt-3",
      "mb-3",
      "mx-1"
    );
    searchHistory.append(saveButton);
  } else {
    var existsButton = document.getElementById(countryName);
    existsButton.classList.remove("is-primary");
    existsButton.classList.add("is-warning");
    console.log("test");
  }
}

// created event listener for appended button to recall to countries coodinates
$(function recallCountry() {
  var searchHistory = document.getElementById("search-history");
  $(searchHistory).on("click", ".recall", function () {
    console.log(this.id);
    countryName = this.id;

    /*
     *  Here, we need to get the feature that we are zooming to and set its state to selected
     */
    setCountryAsSelectedAndStyle(countryName);
    this.classList.remove("is-primary");
    this.classList.add("is-warning");
    var previousCountry = localStorage.getItem(countryName);
    var coordinates = previousCountry.split(",");
    console.log(coordinates);
    map.setView([coordinates[0], coordinates[1]], 4);
    fetchAndDisplayCountryData(countryName);
  });
});

topTracksButton.on("click", topTracksOnClick);
topArtistsButton.on("click", topArtistsOnClick);
$(".pagination-link").on("click", paginationButtonOnClick);
globalToggleButton.on("click", globalToggleButtonOnClick);

//fn to get anything form local storage and display the previous load's selections
function buttonOnRefresh() {
  var saved = localStorage;
  if (saved) {
    //if locastorage exist
    for (var i = 0; i < saved.length; i++) {
      var searchHistory = document.getElementById("search-history");
      var saveButton = document.createElement("button");
      saveButton.innerText = saved.key(i);
      saveButton.setAttribute("id", saved.key(i));
      saveButton.classList.add(
        "recall",
        "button",
        "is-primary",
        "is-rounded",
        "is-medium",
        "is-responsive",
        "mt-3",
        "mb-3",
        "mx-1"
      );
      searchHistory.append(saveButton);
    }
  } else return;
}
buttonOnRefresh();

$(function deleteStorage() {
  var deleteBtn = document.getElementById("delete-history");
  $(deleteBtn).click(function () {
    localStorage.clear();
    var searchHistory = document.getElementById("search-history");
    $(searchHistory).empty();
  });
});

fetchAndDisplayGlobalData();
