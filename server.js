var express = require('express');
var bodyParser = require('body-parser');
var twilio = require('twilio')('AC6a5533386b6621270cf5a57c3b2c1b42', '730567e063a28debdf69c6d5c0f28a21');
var port = process.env.PORT || 5000;

var cityChosen = '';
var infoWanted = '';

var fullData = '';


request = require('request-json');
var client = request.createClient('https://api.everyblock.com/content/chicago/schemas/?token=2c88292e0bcf75f386db3ec06745fe6028cc74bb');

var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));


app.post('/message', function(req, res) {

	var msg = req.body.Body;
	var number = req.body.From;
	console.log(msg);

	if (msg.toLowerCase() === 'reset') {
		cityChosen = '';
		infoWanted = '';
	}
	 else {	
	 	if (cityChosen === '') {
			switch(msg.toLowerCase()) {
			    case 'philly' || 'philadelphia':
			    chooseCity('philly')
			    text(number, "Philly! You can ask something like \"What's happening?\" or \"Any events?\"");
					res.end();
			        break;
			    case 'chicago':
			        //chooseCity('chicago');
			        text(number, "Chicago! You can ask something like \"What's happening?\" or \"Any events?\"");
					res.end();
					cityChosen = 'chicago';
			        break;
			    case 'fresno':
			    	chooseCity('fresno');
			    	text(number, "Fresno! You can ask something like \"What's happening?\" or \"Any events?\"");
					res.end();
			    	break;
			    case 'hialeah':
			    	chooseCity('hialeah');
			    	text(number, "Hialeah! You can ask something like \"What's happening?\" or \"Any events?\"");
					res.end();
			    	break;
			    case 'houston':
			    	chooseCity('houston');
			    	text(number, "Houston! You can ask something like \"What's happening?\" or \"Any events?\"");
					res.end();
			    	break;
			    case 'boston':
			    	chooseCity('boston');
			    	text(number, "Boston! You can ask something like \"What's happening?\" or \"Any events?\"");
					res.end();
			    	break;
			    case 'denver':
			    	chooseCity('denver');
			    	text(number, "Denver! You can ask something like \"What's happening?\" or \"Any events?\"");
					res.end();
			    	break;
			    case 'medford':
			    	chooseCity('medford');
			    	text(number, "Medford! You can ask something like \"What's happening?\" or \"Any events?\"");
					res.end();
			    	break;
			    case 'nashville':
			    	chooseCity('nashville');
			    	text(number, "Nashville! You can ask something like \"What's happening?\" or \"Any events?\"");
					res.end();
			    	break;
			    default:
			        text(number, "Hello! Choose your city:\nChicago\nFresno\nHialeah\nPhiladelphia\nHouston\nBoston\nDenver\nMedford\nNashville");
				res.end();
			} 
		} 
		else if (infoWanted === '') {

			
			   	if (msg.toLowerCase() === "what\'s happening" || msg.toLowerCase() === 'whats happening' || msg.toLowerCase() === "what\'s happening?" || msg.toLowerCase() === 'what is happening?') {
			   		infoWanted = 'topnews/';
			   		phillyRequest(number, infoWanted);

		    	} else if (msg.toLowerCase() === "any events" || msg.toLowerCase() === 'any events?') {
		   	     	infoWanted = 'topnews/events/';
		   	     	phillyRequest(number, infoWanted);

		     	} else {
		     		text(number, "Sorry, I didn\'t get that. Please specify if you want to know \"What's happening\" or ask \"Any events?\"");
		     	}
			     
		} else if (infoWanted === "topnews/") {
			var foundID = false;
			for (var i = 0; i < 5; i++) {
				if (fullData.results[i].id.toString() === msg) {
					foundID = true;
					var description = ''
					if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
					description = fullData.results[i].attributes.excerpt;
				} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
					description = fullData.results[i].attributes.comment;
				} else {
					if( fullData.results[i].embed != null){ 
						description = fullData.results[i].embed.description;
					} else {
						description = fullData.results[i].attributes.excerpt;
					}
				}
					var fullArticle = fullData.results[i].title + '\n' + description + '\n' + fullData.results[i].url;
					text(number, fullArticle);
				} 
			} 


			if (!foundID) {
				text(number, "Invalid ID number. Please try another one.");

			}



		} else if (infoWanted === "topnews/events/") {
			var foundID = false;
			for (var i = 0; i < 5; i++) {
				if (fullData.results[i].id.toString() === msg) {
					foundID = true;
					var description = ''
					if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
					if ( fullData.results[i].attributes.description != null) {
						var description = fullData.results[i].attributes.description;
					} else {
						description = 'More info available...'
					}
				} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
					if ( fullData.results[i].attributes.description != null) {
						var description = fullData.results[i].attributes.description;
					} else {
						description = 'More info available...'
					}
				}
					var fullArticle = fullData.results[i].title + '\n' + description + '\n' + fullData.results[i].url;
					text(number, fullArticle);
				} 
			} 

			if (!foundID) {
				text(number, "Invalid ID number. Please try another one.");

			}



		} 

	}



});

function chooseCity(city) {

	cityChosen = city;
}

function phillyRequest(number, info) {

	var https = require("https");
	var url2 = "https://api.everyblock.com/content/";
	var token = "token=2c88292e0bcf75f386db3ec06745fe6028cc74bb";



	url = url2 + cityChosen + '/' + info + '.json?' + token;

	var request = https.get(url, function (response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event    
    var buffer = "", 
        data,
        title;

    response.on("data", function (chunk) {
        buffer += chunk;
    }); 

    response.on("end", function (err) {
        // finished transferring data
        // dump the raw data
        console.log(buffer);
        console.log("\n");
        data = JSON.parse(buffer);
        fullData = data;
        count = data.count;
		title = data.results[0].title;

		if (info === "topnews/") {

			var preArticle1Title =  data.results[0].title;
			if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
				var preArticle1Desc = data.results[0].attributes.excerpt;
			} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
				var preArticle1Desc = data.results[0].attributes.comment;
			} else {
				var preArticle1Desc = data.results[0].embed.description;
			}
			var preArticle1ID = data.results[0].id
			text(number, ((preArticle1Title + '\n' + preArticle1Desc).substring(0,200) + '\nID:' + preArticle1ID));

			var preArticle2Title = data.results[1].title;
			if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
				var preArticle2Desc = data.results[1].attributes.excerpt;
			} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
				var preArticle2Desc = data.results[1].attributes.comment;
			} else {
				var preArticle2Desc = data.results[1].embed.description;
			}
			if (data.results[1].id === 'undefined'){
				var preArticle2ID = 001001;
			} else {
				var preArticle2ID = data.results[1].id;
				console.log("ID::" + data.results[1].id);
			}		text(number, ((preArticle2Title + '\n' + preArticle2Desc).substring(0,200) + '\nID:' + preArticle2ID));

			var preArticle3Title = data.results[2].title;
			if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
				var preArticle3Desc = data.results[2].attributes.excerpt;
			} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
				var preArticle3Desc = data.results[2].attributes.comment;
			} else {
				if( data.results[2].embed != null){ 
					var preArticle3Desc = data.results[2].embed.description;
				} else {
					preArticle3Desc = data.results[2].attributes.excerpt;
				}
			}
			if (data.results[2].id === null){
				var preArticle3ID = 001001
			} else {
				var preArticle3ID = data.results[2].id
			}
			text(number, ((preArticle3Title + '\n' + preArticle3Desc).substring(0,200) + '\nID:' + preArticle3ID));

			var preArticle4Title = data.results[3].title;
			if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
				var preArticle4Desc = data.results[3].attributes.excerpt;
			} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
				var preArticle4Desc = data.results[3].attributes.comment;
			} else {
				if( data.results[3].embed != null){ 
					var preArticle4Desc = data.results[3].embed.description;
				} else {
					preArticle4Desc = data.results[3].attributes.excerpt;
				}
			}
			var preArticle4ID = data.results[3].id
			text(number, ((preArticle4Title + '\n' + preArticle4Desc).substring(0,200) + '\nID:' + preArticle4ID));
			

			var preArticle5Title =  data.results[4].title;
			if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
				var preArticle5Desc = data.results[4].attributes.excerpt;
			} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
				var preArticle5Desc = data.results[4].attributes.comment;
			} else {
				if( data.results[4].embed != null){ 
					var preArticle5Desc = data.results[4].embed.description;
				} else {
					preArticle5Desc = data.results[4].attributes.excerpt;
				}
			}
			var preArticle5ID = data.results[4].id
			text(number, ((preArticle5Title + '\n' + preArticle5Desc).substring(0,200) + '\nID:' + preArticle5ID));


		} else if (info === "topnews/events/") {

				var preArticle1Title =  data.results[0].title;
			if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston'  || cityChosen === 'hialeah') {
				if ( data.results[0].attributes.description != null) {
					var preArticle1Desc = data.results[0].attributes.description;
				} else {
					preArticle1Desc = 'More info available...'
				}
			} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
				if ( data.results[0].attributes.description != null) {
					var preArticle1Desc = data.results[0].attributes.description;
				} else {
					preArticle1Desc = 'More info available...'
				}
			} else {
				if( data.results[0].embed != null){ 
					var preArticle1Desc = data.results[0].attributes.description;
				} else {
					preArticle1Desc = data.results[0].attributes.description;
				}
			}
			var preArticle1ID = data.results[0].id
			text(number, ((preArticle1Title + '\n' + preArticle1Desc).substring(0,200) + '\nID:' + preArticle1ID));

			var preArticle2Title = data.results[1].title;
			if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
				if ( data.results[1].attributes.description != null) {
					var preArticle2Desc = data.results[1].attributes.description;
				} else {
					preArticle2Desc = 'More info available...'
				}
			} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
				if ( data.results[1].attributes.description != null) {
					var preArticle2Desc = data.results[1].attributes.description;
				} else {
					preArticle2Desc = 'More info available...'
				}
			} else {
				if( data.results[1].embed != null){ 
					var preArticle2Desc = data.results[1].attributes.description;
				} else {
					preArticle2Desc = data.results[1].attributes.excerpt;
				}
			}
				var preArticle2ID = data.results[1].id;
				text(number, ((preArticle2Title + '\n' + preArticle2Desc).substring(0,200) + '\nID:' + preArticle2ID));

			var preArticle3Title = data.results[2].title;
			if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
				if ( data.results[2].attributes.description != null) {
					var preArticle3Desc = data.results[2].attributes.description;
				} else {
					preArticle3Desc = 'More info available...'
				}
			} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
				if ( data.results[2].attributes.description != null) {
					var preArticle3Desc = data.results[2].attributes.description;
				} else {
					preArticle3Desc = 'More info available...'
				}
			} else {
				if( data.results[2].embed != null){ 
					var preArticle3Desc = data.results[2].attributes.description;
				} else {
					preArticle3Desc = data.results[2].attributes.description;
				}
			}
			if (data.results[2].id === null){
				var preArticle3ID = 001001
			} else {
				var preArticle3ID = data.results[2].id
			}
			text(number, ((preArticle3Title + '\n' + preArticle3Desc).substring(0,200) + '\nID:' + preArticle3ID));

			var preArticle4Title = data.results[3].title;
			if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
				if ( data.results[3].attributes.description != null) {
					var preArticle4Desc = data.results[3].attributes.description;
				} else {
					preArticle4Desc = 'More info available...'
				}
			} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
				if ( data.results[3].attributes.description != null) {
					var preArticle4Desc = data.results[3].attributes.description;
				} else {
					preArticle4Desc = 'More info available...'
				}
			} else {
				if( data.results[3].embed != null){ 
					var preArticle4Desc = data.results[3].attributes.description;
				} else {
					preArticle4Desc = data.results[3].attributes.description;
				}
			}
			var preArticle4ID = data.results[3].id
			text(number, ((preArticle4Title + '\n' + preArticle4Desc).substring(0,200) + '\nID:' + preArticle4ID));
			

			var preArticle5Title =  data.results[4].title;
			if(cityChosen === 'boston' || cityChosen === 'fresno' || cityChosen === 'nashville' || cityChosen === 'denver' || cityChosen === 'medford' || cityChosen === 'houston' || cityChosen === 'hialeah') {
				if ( data.results[4].attributes.description != null) {
					var preArticle5Desc = data.results[4].attributes.description;
				} else {
					preArticle5Desc = 'More info available...'
				}
			} else if (cityChosen === 'philly' || cityChosen === 'philadelphia' || cityChosen === 'chicago'){
				if ( data.results[4].attributes.description != null) {
					var preArticle5Desc = data.results[4].attributes.description;
				} else {
					preArticle5Desc = 'More info available...'
				}
			} else {
				if( data.results[4].embed != null){ 
					var preArticle5Desc = data.results[4].attributes.description;
				} else {
					preArticle5Desc = data.results[4].attributes.description;
				}
			}
			var preArticle5ID = data.results[4].id
			text(number, ((preArticle5Title + '\n' + preArticle5Desc).substring(0,200) + '\nID:' + preArticle5ID));
		}
		

		/*textArticles =  ((preArticle1Title + '\n' + preArticle1Desc).substring(0,200) + '\nID:' + preArticle1ID)
						+ '\n' + ((preArticle2Title + '\n' + preArticle2Desc).substring(0,200) + '\nID:' + preArticle2ID)
						+ '\n' +  ((preArticle3Title + '\n' + preArticle3Desc).substring(0,200) + '\nID:' + preArticle3ID)
						+ '\n' +  ((preArticle4Title + '\n' + preArticle4Desc).substring(0,200) + '\nID:' + preArticle4ID)
						+ '\n' + ((preArticle5Title + '\n' + preArticle5Desc).substring(0,200) + '\nID:' + preArticle5ID);
		
		text(number, textArticles);

		*/


	
		    setTimeout(function () {
		        text(number, "To get more information on what's going on with a specific article or event, reply with the corresponding ID at the bottom.");
		    }, 12000);
		
		//text(number, "To get more information on what's going on with a specific article or event, reply with the corresponding ID at the bottom.");
        // extract the distance and time
        console.log("Title: " + count);
    }); 

	

}); 

}



function text(to, msg) {
    twilio.messages.create({
        to: to,
        from: '+12155152516',
        body: msg
    }, function(err, msg) {
        if (err)
            console.log(err.message);
        if (!err) {
            console.log('\n The message with the ID: \n' +
                msg.sid +
                '\n was sucessfully sent to ' + msg.to);
            console.log('The message was: ' + msg.body + '\n')
        };
    });
}

app.post('/', function(req, res) {
    //text('+17182006654', 'ok fuc u');
    //res.end();

var https = require("https");
var url = "https://api.everyblock.com/content/chicago/topnews/.json?token=90fe24d329973b71272faf3f5d17a8602bff996b";

var request = https.get(url, function (response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event    
    var buffer = "", 
        data,
        title;

    response.on("data", function (chunk) {
        buffer += chunk;
    }); 

    response.on("end", function (err) {
        // finished transferring data
        // dump the raw data
        console.log(buffer);
        console.log("\n");
        data = JSON.parse(buffer);
        count = data.count;
	title = data.results[0].title;

        // extract the distance and time
        console.log("Title: " + count);
        text("+17182006654", count);
	text("+17182006654", title);
        res.end();
    }); 


}); 


}); 

app.post('/test', function(req, res) {
    text('+17182006654', 'works yo')
    res.end();
})

app.listen(port, function() {
    console.log("Server is up  running at port: " + port);
});