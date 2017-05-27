var builder = require('botbuilder');
var config = require('../config/auth');

var connector = new builder.ChatConnector({
    appId: config.bot.appId,
    appPassword: config.bot.password
});

var bot = new builder.UniversalBot(connector);
// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("I am The Donald the gate keeper of TC, ask me a question...");
//     session.beginDialog('/intent');
// });

// LUIS recogniser that points to the model
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=';
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
    builder.DialogAction.send('TC is the greatest game, we\'re very proud of it')
]);

dialog.onDefault(builder.DialogAction.send('I don\'t understand, who\'d have thought answering questions would be so difficult'));


module.exports.connector = connector;
