require("dotenv").config();

var fs = require("fs");

var request = require('request');
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var omdb = require('omdb');

var searchTerm = process.argv[3];
for (i = 4; i < process.argv.length; i++){
    searchTerm = searchTerm +  " " + process.argv[i];
}

var action = process.argv[2];

function tweets(){
    var params = {screen_name: 'papayapix'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }
    });
};

function spotifyFunction(searchTerm){
    spotify.search({ type: 'track', query: searchTerm }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        };

        console.log(data); 
    });
};

function omdbFunction(searchTerm){
    omdb.search(searchTerm, function(err, movies) {
        if(err) {
            return console.error(err);
        }

        if(movies.length < 1) {
            return console.log('No movies were found!');
        }

        movies.forEach(function(movie) {
            console.log('%s (%d)', movie.title, movie.year);
        });
    });
};

function doWhatItSays(){
// read the random text file
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
        return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        action = dataArr[0];
        searchTerm = dataArr[1];
        actuallyDoThis(dataArr[0], dataArr[1]);

    });
};

function actuallyDoThis(action, searchTerm){
    switch (action){
        case `my-tweets`:
            console.log("my tweets");
            tweets();
            break;
        case `spotify-this-song`:
            console.log("spotify searching");
            spotifyFunction(searchTerm);
            break;
        case `movie-this`:
            console.log("omdb searching");
            omdbFunction(searchTerm);
            break;
        case `do-what-it-says`:
            doWhatItSays();
            break;
    }
}