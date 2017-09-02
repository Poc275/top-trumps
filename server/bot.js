var builder = require('botbuilder');
var request = require('request');
var uuid = require('uuid');
var botResponses = require('./botResponses.js');
var config;

if(!process.env.FacebookClientID) {
	config = require('../config/auth');
}

var connector = new builder.ChatConnector({
    appId: process.env.BotAppId || config.bot.appId,
    appPassword: process.env.BotPassword || config.bot.password
});

var bot = new builder.UniversalBot(connector);

// LUIS recogniser that points to the model
var model = process.env.BotLuisModel;
var recogniser = new builder.LuisRecognizer(model);

// using intent dialogs instead of global dialogs, this
// prevents dialogs from exiting when a new intent is matched
// and we're still waiting for user input
// bot.recognizer(recogniser);
var intents = new builder.IntentDialog({
    recognizers: [recogniser]
});

intents.matches('Age', 'AgeIntent');
intents.matches('Appearance', 'AppearanceIntent');
intents.matches('Create', 'CreateIntent');
intents.matches('Feedback Donald', 'FeedbackDonaldIntent');
intents.matches('Feedback TC', 'FeedbackTCIntent');
intents.matches('Find', 'FindIntent');
intents.matches('Hello', 'HelloIntent');
intents.matches('Help', 'HelpIntent');
intents.matches('Hobbies', 'HobbiesIntent');
intents.matches('Language', 'LanguageIntent');
intents.matches('Location', 'LocationIntent');
intents.matches('Modify', 'ModifyIntent');
intents.matches('None', 'NoneIntent');
intents.matches('Reality', 'RealityIntent');
intents.matches('State', 'StateIntent');
intents.matches('Time', 'TimeIntent');
intents.matches('What', 'WhatIntent');
intents.matches('Who', 'WhoIntent');

bot.dialog('/', intents).onDefault(function(session) {
    // null intent
    session.endDialog(botResponses.noneIntentResponses[Math.floor(Math.random() * botResponses.noneIntentResponses.length)]);
});

// Age intent
bot.dialog('AgeIntent', [
    function(session, args) {
        session.endDialog(botResponses.ageIntentResponses[Math.floor(Math.random() * botResponses.ageIntentResponses.length)]);
    }
]);

// Appearance intent
bot.dialog('AppearanceIntent', [
    // ask user what they think of the bot's appearance
    function(session, args) {
        session.send(botResponses.appearanceIntentResponses[Math.floor(Math.random() * botResponses.appearanceIntentResponses.length)]);
        session.send({
            attachments: [{
                contentType: "image/jpeg",
                contentUrl: botResponses.appearanceImageResponses[Math.floor(Math.random() * botResponses.appearanceImageResponses.length)],
                name: "DonaldBotAppearance.jpg"
            }]
        });
        builder.Prompts.text(session, botResponses.appearancePromptResponses[Math.floor(Math.random() * botResponses.appearancePromptResponses.length)]);
    },
    function(session, results) {
        // send response to sentiment analysis API and respond accordingly
        getSentimentAnalysis(results.response, function(err, response) {
            if(err) {
                session.send("You are fake news").endDialog();
            }

            if(response.documents[0].score < 0.5) {
                // negative
                session.send(botResponses.donaldFeedbackNegativeResponses[Math.floor(Math.random() * botResponses.donaldFeedbackNegativeResponses.length)])
                    .endDialog();
            } else {
                // positive
                session.send(botResponses.donaldFeedbackPositiveResponses[Math.floor(Math.random() * botResponses.donaldFeedbackPositiveResponses.length)])
                    .endDialog();
            }
        });
    }
]);

// Create intent
bot.dialog('CreateIntent', [
    function(session, args) {
        session.endDialog(botResponses.createIntentResponses[Math.floor(Math.random() * botResponses.createIntentResponses.length)]);
    }
]);

// Feedback Donald intent
bot.dialog('FeedbackDonaldIntent', [
    function(session, args) {
        getSentimentAnalysis(session.message.text, function(err, response) {
            if(err) {
                session.send("You are fake news").endDialog();
            }

            if(response.documents[0].score < 0.5) {
                // negative
                session.send(botResponses.donaldFeedbackNegativeResponses[Math.floor(Math.random() * botResponses.donaldFeedbackNegativeResponses.length)])
                    .endDialog();
            } else {
                // positive
                session.send(botResponses.donaldFeedbackPositiveResponses[Math.floor(Math.random() * botResponses.donaldFeedbackPositiveResponses.length)])
                    .endDialog();
            }
        });
    }
]);

// Feedback TC intent
bot.dialog('FeedbackTCIntent', [
    function(session, args) {
        getSentimentAnalysis(session.message.text, function(err, response) {
            if(err) {
                session.send("You are fake news").endDialog();
            }

            if(response.documents[0].score < 0.5) {
                // negative
                session.send(botResponses.gameFeedbackNegativeResponses[Math.floor(Math.random() * botResponses.gameFeedbackNegativeResponses.length)])
                    .endDialog();
            } else {
                // positive
                session.send(botResponses.gameFeedbackPositiveResponses[Math.floor(Math.random() * botResponses.gameFeedbackPositiveResponses.length)])
                    .endDialog();
            }
        });
    }
]);

// Find intent
bot.dialog('FindIntent', [
    function(session, args) {
        session.endDialog(botResponses.findIntentResponses[Math.floor(Math.random() * botResponses.findIntentResponses.length)]);
    }
]);

// Hello intent
bot.dialog('HelloIntent', [
    function(session, args) {
        session.endDialog(botResponses.helloIntentResponses[Math.floor(Math.random() * botResponses.helloIntentResponses.length)]);
    }
]);

// Help intent
bot.dialog('HelpIntent', [
    function(session, args) {
        session.endDialog(botResponses.helpIntentResponses[Math.floor(Math.random() * botResponses.helpIntentResponses.length)]);
    }
]);

// Hobbies intent
bot.dialog('HobbiesIntent', [
    function(session, args) {
        session.endDialog(botResponses.hobbiesIntentResponses[Math.floor(Math.random() * botResponses.hobbiesIntentResponses.length)]);
    }
]);

// Language intent
bot.dialog('LanguageIntent', [
    function(session, args) {
        session.endDialog(botResponses.languageIntentResponses[Math.floor(Math.random() * botResponses.languageIntentResponses.length)]);
    }
]);

// Location intent
bot.dialog('LocationIntent', [
    function(session, args) {
        session.endDialog(botResponses.locationIntentResponses[Math.floor(Math.random() * botResponses.locationIntentResponses.length)]);
    }
]);

// Modify intent
bot.dialog('ModifyIntent', [
    function(session, args) {
        session.endDialog(botResponses.modifyIntentResponses[Math.floor(Math.random() * botResponses.modifyIntentResponses.length)]);
    }
]);

// None intent
bot.dialog('NoneIntent', [
    function(session, args, next) {
        session.endDialog(botResponses.noneIntentResponses[Math.floor(Math.random() * botResponses.noneIntentResponses.length)]);
    }
]);

// Reality intent
bot.dialog('RealityIntent', [
    function(session, args) {
        session.endDialog(botResponses.realityIntentResponses[Math.floor(Math.random() * botResponses.realityIntentResponses.length)]);
    }
]);

// State intent
bot.dialog('StateIntent', [
    function(session, args) {
        session.endDialog(botResponses.stateIntentResponses[Math.floor(Math.random() * botResponses.stateIntentResponses.length)]);
    }
]);

// Time intent
bot.dialog('TimeIntent', [
    function(session, args) {
        session.endDialog(botResponses.timeIntentResponses[Math.floor(Math.random() * botResponses.timeIntentResponses.length)]);
    }
]);

// What intent
bot.dialog('WhatIntent', [
    function(session, args) {
        session.endDialog(botResponses.whatIntentResponses[Math.floor(Math.random() * botResponses.whatIntentResponses.length)]);
    }
]);

// Who intent
bot.dialog('WhoIntent', [
    function(session, args) {
        session.endDialog(botResponses.whoIntentResponses[Math.floor(Math.random() * botResponses.whoIntentResponses.length)]);
    }
]);


// sentiment analysis api call
function getSentimentAnalysis(text, cb) {
    var key = process.env.BotCognitiveServiceKey || config.bot.cognitiveServiceKey;
    var document = {
        "documents": [
            {
                "language": "en",
                "id": uuid().toString(),
                "text": text
            }
        ]
    };
    var options = {
        url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
        headers: {
            "Ocp-Apim-Subscription-Key": key,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(document)
    };

    request.post(options, function(error, response, body) {
        if(!error && response.statusCode === 200) {
            cb(null, JSON.parse(body));
        } else {
            cb(error, null);
        }
    });
}


module.exports.connector = connector;
