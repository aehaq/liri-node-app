require("dotenv").config()

var fs = require('fs')
var keys = require('./keys.js')
var request = require("request")
var moment = require('moment')
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify)

var command = process.argv[2];

function spotifyThis() {

    var input;
    var array = process.argv
    if (process.argv[3]) {
        input = process.argv[3];
        //If the user writes a track name with multiple words, they will be appended here.
        for (let i = 4; i < array.length; i++) {
            input += " " + array[i]
        }
    } else {
        //If the user fails to write an artist name, we return "The Sign" by Ace is Base..
        input = "the sign Ace"
    }
    //Search the spotify api 
    spotify.search({ type: 'track', query: input }, function(err, data) {

        if (err) {
          return console.log('Error occurred: ' + err);
        }

        // Return the desired results to the console
        var result = data.tracks.items[0]

        // If multiple artists, we return each one.
        var artist = result.artists
        for (let i = 0; i < artist.length; i++) {
            console.log(artist[i].name)
        }
        // If preview url is available we return it, otherwise we note its unavailability.
        console.log(result.name)
        if (result.preview_url) {
            console.log("Preview URL: "+result.preview_url)
        } else {
            console.log("No Preview Available")
        }
        console.log(result.album.name)
    });

}

function concertThis() {
    //Set up artist input for bandsintown call url
    var artist;
    var array = process.argv
    if (process.argv[3]) {
        artist = process.argv[3];
        //If the user writes an artist name with multiple words, they will be appended here.
        for (let i = 4; i < array.length; i++) {
            artist += "+" + array[i]
        }
        
        //Create the api request url
        var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        
        //Run the api request
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("--------------")
                var results = JSON.parse(body);
                
                for (let i = 0; i < results.length; i++) {
                    var event = results[i];
                    console.log(event.venue.name)
                    console.log(event.venue.city +", "+ event.venue.country)
                    var time = event.datetime
                    // Grab the necessary parts of the date to convert it into a moment date
                    var date = time.substring(0,10)
                    date = moment(date, "YYYY-MM-DD")
                    // Print a reformatted date to the console.
                    console.log(date.format("MM/DD/YYYY"))
                    console.log("--------------")
                }
            } else {
                console.log(error)
            }
        })
        
    } else {
        //If the user fails to write an artist name, we notify them we needed the input..
        console.log("You forgot to ask for an artist!")
    }
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
            console.log("--------------")
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
    var input;
    // Pull the information from the random.txt file
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        // Reformat the pulled input so that it works with our spotify call.
        var song = data.split(',')[1];
        input = song.replace(/['"]+/g, '')

        spotify.search({ type: 'track', query: input }, function(err, data) {
    
            if (err) {
              return console.log('Error occurred: ' + err);
            }
    
            var result = data.tracks.items[0]
    
            var artist = result.artists
            for (let i = 0; i < artist.length; i++) {
                console.log(artist[i].name)
            }
            console.log(result.name)
            if (result.preview_url) {
                console.log(result.preview_url)
            } else {
                console.log("No Preview Available")
            }
            console.log(result.album.name)
        });
    })

}

// Run the corresponding functions based off of the user input
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