var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    // id and password go here once registered
    // but for emulator usage they're not required
});

var bot = new builder.UniversalBot(connector);

// LUIS recogniser that points to the model
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=';
var recogniser = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({
    recognizers: [recogniser]
});

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
dialog.matches('What', builder.DialogAction.send('TC is the greatest game, we\'re very proud of it'));

dialog.onDefault(builder.DialogAction.send('I don\'t understand, who\'d have thought answering questions would be so difficult'));


module.exports.connector = connector;
