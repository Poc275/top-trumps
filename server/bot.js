var builder = require('botbuilder');
var config;
if(!process.env.FacebookClientID) {
	config = require('../config/auth');
}

// responses...
var whatIntentResponses = [
    "This game is the greatest… and everyone… a lot of people, agree!",
    "You get to enjoy learning about some wonderful people. This is truly amazing.",
    "This is a game that never gets an easy ride in the press. That's so unfair. It's a great game. I love it, you’re going to love it too.",
    "TC is so great. So Great. So new. It's hard to say just how fantastic it is. I love it.",
    "I have assembled for you an amazing bunch of people. You can use them to do fantastic things. To achieve great things."
];

var connector = new builder.ChatConnector({
    appId: process.env.BotAppId || config.bot.appId,
    appPassword: process.env.BotPassword || config.bot.password
});

var bot = new builder.UniversalBot(connector);
// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("I am The Donald the gate keeper of TC, ask me a question...");
//     session.beginDialog('/intent');
// });

// LUIS recogniser that points to the model
var model = 
    'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=';
var recogniser = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({
    recognizers: [recogniser]
});

// bot.on('conversationUpdate', function (message) {
//     if (message.membersAdded && message.membersAdded.length > 0) {
//         bot.send(new builder.Message()
//             .address(message.address)
//             .text('I am The Donald, leader of TC, ask me a question...'));
//     }
// });

bot.dialog('/', dialog);

// bot.dialog('/', [
//     function(session, args, next) {
//         if(!session.userData.name) {
//             session.beginDialog('/profile');
//         } else {
//             next();
//         }
//     },
//     function(session, results) {
//         session.send('Hello %s!', session.userData.name);
//     }
// ]);

// bot.dialog('/profile', [
//     function(session) {
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     },
//     function(session, results) {
//         session.userData.name = results.response;
//         session.endDialog();
//     }
// ]);

// LUIS intent handlers
// dialog.matches('What', builder.DialogAction.send('TC is the greatest game, we\'re very proud of it'));

dialog.matches('What', [
    function(session, args, next) {
        session.sendTyping();
        next();
    },
    builder.DialogAction.send(whatIntentResponses[Math.floor(Math.random() * whatIntentResponses.length)])
]);


dialog.onDefault(builder.DialogAction.send('I don\'t understand, who\'d have thought answering questions would be so difficult'));


module.exports.connector = connector;
