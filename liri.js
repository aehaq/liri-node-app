require("dotenv").config()

var keys = require('./keys.js')
var request = require("request")

// var spotify = new Spotify(keys.spotify)

var command = process.argv[2];

function spotifyThis() {

}

function concertThis() {

}

function movieThis() {
    //Set up movie input for omdb call url
    var movie;
    var array = process.argv
    if (process.argv[3]) {
        movie = process.argv[3];
        //If the user writes a movie name with multiple words, they will be appended here.
        for (let i = 4; i < array.length; i++) {
            movie += "+" + array[i]
        }
    } else {
        //If the user fails to write a movie name, it will return results for mr. nobody.
        movie = "Mr+Nobody"
    }

    //Create the api request url
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

    //Run the api request
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            omdb = JSON.parse(body);
            console.log(omdb.Title)
            console.log(omdb.Year)
            console.log("IMDB Rating: " + omdb.imdbRating)
            console.log("Rotten Tomatoes Score: " + omdb.Ratings[1].Value)
            console.log("Country: " + omdb.Country)
            console.log("Languages: " + omdb.Language)
            console.log(omdb.Plot)
            console.log("Starring: " + omdb.Actors)
        }
    })
}

function doIt() {

}

if (command === "concert-this") {
    concertThis();
}
if (command === "spotify-this-song") {
    spotifyThis();
}
if (command === "movie-this") {
    movieThis();
}
if (command === "do-what-it-says") {
    doIt();
}