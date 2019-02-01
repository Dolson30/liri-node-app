require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var spot = new Spotify(keys.spotify);
var inquire = require('inquirer');
var choice = '';
var query1 ='';

runLiri = function(){

    if(choice.toLowerCase() === 'spotify-this-song')
    {
        if(query1 === undefined)
        {
            query1 = "The Sign";
        }
        spot
        .search({ type: 'track', query: query1, limit:1 })
        .then(function(response) {
            console.log("\n-----------------------");
            console.log("Artist: "+response.tracks.items[0].album.artists[0].name);
            console.log("Song: "+response.tracks.items[0].name);
            console.log("Preview: "+response.tracks.items[0].external_urls.spotify);
            console.log("Album: "+response.tracks.items[0].album.name);
            console.log("-----------------------\n");
            prompter();
        })
        .catch(function(err) {
            console.log("Oops, something broke. Try Again.");
            prompter();
        });
    }
    else if(choice.toLowerCase() === 'concert-this')
    {
        axios.get("https://rest.bandsintown.com/artists/" + query1 + "/events?app_id=codingbootcamp").then(function(response)
        {   
            for(var i = 0; i<5;i++)
            {
                console.log("\n-----------------------");
                console.log("Venue Name: "+response.data[i].venue.name);
                console.log("Venue Location: "+response.data[i].venue.city+", "+response.data[i].venue.region);
                console.log("Concert Date: "+moment(response.data[i].datetime).format('MMMM Do YYYY, h:mm:ss a'));
                console.log("-----------------------\n");
               
            }
            prompter();
            
        }).catch(function(err) {
            console.log("Oops, something broke. Try Again.");
            prompter();
        });
    }
    else if(choice.toLowerCase() === 'movie-this')
    {
        if(query1 === undefined)
        {
            query1 = "Mr. Nobody";

        }
        axios.get('http://www.omdbapi.com/?apiKey=trilogy'+ '&t='+ query1).then((response) => 
        {
            console.log("\n-----------------------");
            console.log("Title: "+response.data.Title);
            console.log("Year of Release: "+response.data.Year);
            console.log("Rating: "+response.data.Rated);
            console.log("Rotten Tomatoes: "+response.data.Ratings[1].Value);
            console.log("Country of Filming: "+response.data.Country);
            console.log("Language: "+response.data.Language);
            console.log("Plot: "+response.data.Plot);
            console.log("Cast: "+response.data.Actors);
            console.log("-----------------------\n");
            prompter();
        }).catch((err) => {
            console.log(err);
            prompter();
        });

    }

}

prompter = function()
{
    inquire.prompt([
        {name:'choice',
         message:"Choose which command to run!(concert-this, movie-this, spotify-this-song, or exit)"
        },{
            name:'query1',
            message:"Enter your query(Artist, Movie, Song, or exit)"
        }
    ]).then(function(answers)
    {
        choice = answers.choice;
        if(choice.toLowerCase()==='exit')
        {
            process.exit();
        }
        query1 = answers.query1;
        runLiri();
    })
}
prompter();