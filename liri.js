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
            
            for (var i = 0; i < tweets.length; i++) {
                var tweetContent = tweets[i].text;
                console.log("Tweet Text: " + tweetContent);
                var tweetDate = tweets[i].created_at;
                console.log("Tweet Creation Date: " + tweetDate);
            };
        };
        if (error){
            console.log(error);
        };
    });
};


function spotifyFunction(searchTerm){
    spotify.search({ type: 'track', query: searchTerm, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        };

        console.log(data.tracks.items[0]); 
    });
};

function omdbFunction(searchTerm){

    // Then run a request to the OMDB API with the movie specified
    request("https://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=1bb4c85e", function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
      
            console.log("The movie is: " + movie.Title +
            "\nRelease year: " + movie.Year +
            "\nIMDB rating: " + movie.imdbRating +
            "\nRotten Tomatoes: " + movie.Ratings[2].Value +
            "\nCountry: " + movie.Country +
            "\nLanguage: " + movie.Language +
            "\nPlot: " + movie.Plot +
            "\nActors: " + movie.Actors
            );
        }
        else if (err) return err;
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
            if (!searchTerm){
                spotifyFunction("The Sign Ace of Base");
            }
            else {
            spotifyFunction(searchTerm);
            }
            break;
        case `movie-this`:
            console.log("omdb searching");
            if (!searchTerm){
                omdbFunction("Mr. Nobody");
            }
            else {
            omdbFunction(searchTerm);
            }
            break;
        case `do-what-it-says`:
            doWhatItSays();
            break;
    }
};
actuallyDoThis(action, searchTerm);
