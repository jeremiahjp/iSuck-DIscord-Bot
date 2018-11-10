const { Client, Attachment } = require('discord.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const OpenWeatherMapHelper = require("openweathermap-node");
const Chuck  = require('chucknorris-io'),chucky = new Chuck();

axios = require("axios");
var num;

const helper = new OpenWeatherMapHelper({
   APPID: 'XXX',
   units: 'imperial'
});
var fs = require('fs');
var regexoneormore = /^[!][a-z]+(\s[<][@][0-9]+[>])+$/igm;
var regexone =  /^[!][a-z]+(\s[<][@][0-9]+[>])$/igm;
var newsaltlevel;
var saltlevel;
var namearray;
var namearrayfix;
var unirest = require('unirest');

function capitalizeEachWord(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

console.log(client.channels.get("<504100914681085961>"));
client.on('message', msg => {
   //console.log(msg)
   //Trigger for bot communication
   //!urbandick

   if (msg.content.substring(0,12) === '!chucknorris') {
      chucky.getRandomJoke().then(function (response) {
         console.log(response)
         var joke = response.Joke.value
         console.log('chuck joke')
                  msg.channel.send({embed: {
            color: 4434130,
            description:joke
         }});
      }).catch(function (err) {

      })         
   }

   if (msg.content.substring(0,8) === '!weather') {
      var weather = msg.content.substring(9)
      var regex = new RegExp (/[0-9]+/)
      var regexname = new RegExp (/[A-Z\sa-z]+/)
      //if entered is numbers only
      console.log(regex.test(weather))
      console.log(regexname.test(weather))
      console.log(weather)
      if (regex.test(weather)) {
         helper.getCurrentWeatherByZipCode(weather, (err, currentWeather) => {
            if (typeof currentWeather.weather != 'undefined') {
               var main = currentWeather.weather[0].main
               var summary = currentWeather.weather[0].description
               var temp = currentWeather.main.temp // this is in kelvin
               var city = currentWeather.name
               var country = currentWeather.sys.country
               var coords = 'lon: ' + currentWeather.coord.lon + ', lat: ' + currentWeather.coord.lat
               var failure = currentWeather.message
               temp = Math.round((temp - 273.15) * 9/5 + 32) + 'F'
               summary = capitalizeEachWord(summary)
               //adding in emojis
               switch (summary) {
                  case 'Cloudy':
                  summary = summary + ' :cloud:'
                  break;

                  case 'Sunny':
      			   summary = summary + ' :sunny:'
      			   break;
                  case 'Moderate Rain':
      			   summary = summary + ' :cloud_rain:'
      			   break;
                  case 'Light Rain':
      			   summary = summary + ' :cloud_rain:'
      			   break;
               }
               var result = 'Location: '  + capitalizeEachWord(city) + ', ' + country + '\nCoordinants: ' + coords + '\nSummary: '  +  summary  + ' \nTemperature: '  + temp
               if(err){
                  msg.channel.send({embed: {
                     color: 16711680,
                     description:  "Unknown error."
                  }});
               }
               console.log('faulire valu:' + failure)
               if (failure === 'city not found') {
                  console.log('in city not cfound')
                  msg.channel.send({embed: {
                  color: 16711680,
                  description:  "City not found."
                  }});
               }
               else {
                  console.log('city:' + city)
                  console.log(currentWeather)
                  msg.channel.send({embed: {
                     color: 4434130,
                     description:  result
                  }});
               }
            }
            else {
               console.log('in city not cfound')
               msg.channel.send({embed: {
               color: 16711680,
               description:  "City not found."
               }});
            }
         });
	   }
      else if (regexname.test(weather)) {
         helper.getCurrentWeatherByCityName(weather, (err, currentWeather) => {
            console.log(currentWeather)
            if (typeof currentWeather.weather != 'undefined') {
               var main = currentWeather.weather[0].main
               var summary = currentWeather.weather[0].description
               var temp = currentWeather.main.temp // this is in kelvin
               var city = currentWeather.name
               var country = currentWeather.sys.country
               var coords = 'lon: ' + currentWeather.coord.lon + ', lat: ' + currentWeather.coord.lat
               var failure = currentWeather.message
               temp = Math.round(temp) + 'F'
               summary = capitalizeEachWord(summary)

               switch (summary) {
                  case 'Cloudy':
                  summary = summary + ' :cloud:'
                  break;

                  case 'Sunny':
                  summary = summary + ' :sunny:'
                  break;
                  case 'Moderate Rain':
                  summary = summary + ' :cloud_rain:'
                  break;
                  case 'Light Rain':
                  summary = summary + ' :cloud_rain:'
                  break;
               }
               var result = 'Location: '  + capitalizeEachWord(city) + ', ' + country + '\nCoordinants: ' + coords + '\nSummary: '  +  summary  + ' \nTemperature: '  + temp
               if(err) {
                  msg.channel.send({embed: {
                     color: 16711680,
                     description:  "Unknown error."
                  }});
               }
               console.log('faulire valu:' + failure)
               if (failure === 'city not found') {
                  console.log('in city not cfound')
                  msg.channel.send({embed: {
                  color: 16711680,
                  description:  "City not found."
                  }});
               }
               else {
                  console.log('cuntry:' + country)
                  console.log(currentWeather)
                  msg.channel.send({embed: {
                     color: 4434130,
                     description:  result
                  }});
               }
            }
            else {
               console.log('in city not cfound')
               msg.channel.send({embed: {
               color: 16711680,
               description:  "City not found."
               }});
            }
         });
      }
   }
   if (msg.content.substring(0,10) === '!urbandick') {
      var term = msg.content.substring(11);
      var token = msg.content.split(" ");
      var patt = /[0-9]/;
      var index = token[token.length-1];
      if (!patt.test(index)) {
         index = 0;
      }
      console.log('index' + index);
      if (term === 'random') {
         unirest.get("https://mashape-community-urban-dictionary.p.mashape.com/random?page=" + term)
         .header("X-Mashape-Key", "JtZL7jYd6jmshjdU4qiZAjCnY7Jyp1kDxFUjsnYzbudXKqRsWg")
         .header("X-Mashape-Host", "mashape-community-urban-dictionary.p.mashape.com")
         .end(function (result) {
            if (typeof result.body.list[index] != 'undefined') {
               var def = result.body.list[index].definition;
               var example = result.body.list[index].example;
               var word = result.body.list[index].word;
               var written_on = result.body.list[index].written_on; 
               var link = result.body.list[index].permalink;
               written_on = written_on.split(' ')[0]
			   written_on = written_on.substring(0,10)
               var total = def.length+example.length+word.length+written_on.length;
               console.log(result.body);
               console.log(def.lengh);
               console.log(example.length);
               var response = '__Random Word__\n\n' + '**Word:** ' + word + '\n\n**Written On:** ' + written_on + '\n\n' + '**Definition:** ' + def + '\n\n**Example: **' + example;
               var truncResponse = response.substring(response,1950) + '\n\n__**TRUNCATED**__\n\nSee more info here: ' + link;
               if (total <= 2048) {
                  msg.channel.send({embed: {
                     color: 32768,
                     description: response
                  }});
               //msg.reply(result.body.list[0].definition);
                  console.log(term);
               }
               else {
                  msg.channel.send({embed: {
                     color: 16711680,
                     description: truncResponse
                  }});
               }
            }
            else {
               msg.channel.send({embed: {
                  color: 16711680,
                  description: "¯\\_(ツ)_/¯ Sorry, we couldn't find: " + term
               }});
            }
         });
      }
      else {
         unirest.get("https://mashape-community-urban-dictionary.p.mashape.com/define?term=" + term)
         .header("X-Mashape-Key", "JtZL7jYd6jmshjdU4qiZAjCnY7Jyp1kDxFUjsnYzbudXKqRsWg")
         .header("X-Mashape-Host", "mashape-community-urban-dictionary.p.mashape.com")
         .end(function (result) {
            if (typeof result.body.list[index] != 'undefined') {
               var def = result.body.list[index].definition;
               var example = result.body.list[index].example;
               var word = result.body.list[index].word;
               var written_on = result.body.list[index].written_on;
               var link = result.body.list[index].permalink;
               written_on = written_on.split(' ')[0]
			   written_on = written_on.substring(0,10)
               var total = def.length+example.length+word.length+written_on.length;
               var response =  '**Word:** ' + word + '\n\n**Written On:** ' + written_on + '\n\n' + '**Definition:** ' + def + '\n\n**Example: **' + example;
               var truncResponse = response.substring(response,1950) + '\n\n__**TRUNCATED**__\n\nSee more info here: ' + link;
               console.log('total:'+total);
               console.log(result.body);
               console.log(def.lengh);
               console.log(example.length);
               if (total <= 2048) {
                  msg.channel.send({embed: {
                     color: 32768,
                     description: response
                  }});
               //msg.reply(result.body.list[0].definition);
                  console.log(term);
               }
               else {
                  msg.channel.send({embed: {
                     color: 16711680,
                     description: truncResponse
                  }});
               }
            }
            else {
               msg.channel.send({embed: {
                  color: 16711680,
                  description: "¯\\_(ツ)_/¯ Sorry, we couldn't find: " + term
               }});
            }
         });
      }
      //}
   }
   if (msg.content.substring(0,1) === '!') {
      console.log(msg.author.id);
      if (msg.author.id === '94220323628523520' || msg.author.id !== '94220323628523520') {
         //RNG trigger
         if (msg.content.substring(0,4) == '!rng' && msg.content.length >= 5) {
            var max = msg.content.substring(5);
            var random = Math.random() * (+max - +0) + +0; 
            msg.channel.send({embed: {
               color: 16711680,
               description: 'RNGod says: ' + Number(random).toFixed(0)
            }});
         }
         console.log(msg.content.substring(0,5));
         console.log(msg.content.substring(0,5));
         if (msg.content.substring(0,5) === '!salt' && msg.content.substring(0,6) !== '!saltp') {
            var foundoneormore = msg.content.match(regexoneormore);
            var foundone = msg.content.match(regexone);
            console.log('in salt');
            console.log('foundoneormore:'+foundoneormore);
            console.log('foundone:'+foundone);
            console.log('msg.content' + msg.content);
            if (foundoneormore != null || foundone != null) {
               if (foundone == '!salt <@268171740855664641>' || foundoneormore.includes('!salt <@268171740855664641>')) {
                  msg.channel.send({embed: {
                     color: 8388863,
                     description: 'IMMUNITY'
                  }});
                  console.log('immune');
               }
            }
            //when multiple names
            if (foundoneormore == msg.content) {
               console.log('msg.content' + msg.content);
               namearray = msg.content.substring(6).split(' ');
               console.log('namearray'+namearray);
               namearrayfix = namearray;
               for (var i = 0; i < namearray.length; i++ ) {
                  if (i != namearray.length - 1) {
                     namearrayfix[i] = ' ' + namearray[i] + '\'s :eyes:'
                  }
                  else
                     namearrayfix[i] = ' and ' +namearray[i] + '\'s :eyes:.'
               }
               console.log('namearrayfix'+namearrayfix);
               newsaltlevel = saltlevel+namearrayfix.length;
               msg.channel.send({embed: {
                  color: 8388863,
                  description: 'Poured salt into' + namearrayfix
               }});
               console.log('match');
            }
            //when one name
            else if (foundone = 'null') {
               msg.channel.send({embed: {
                  color: 8388863,
                  description: 'Y so :salt: tho?'
               }});
            }
      }
      if (msg.content.toLowerCase() === '=rip') {
         const attachment = new Attachment('https://i.imgur.com/w3duR07.png');
         msg.channel.send(attachment);
      }

      if (msg.content.toLowerCase() === '=caboosepride') {
         msg.channel.send({embed: {
            color: 16711680,
            description: ':gay_pride_flag:'
         }});
      }
     }
  }
});

client.login('XXX');