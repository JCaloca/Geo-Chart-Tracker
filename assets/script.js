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
    var url = lastFMBaseURL+"?method=chart.gettopartists&api_key="+lastFMApiKey+"&format=json";

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
    var url = lastFMBaseURL+"?method=chart.gettoptracks&api_key="+lastFMApiKey+"&format=json";

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