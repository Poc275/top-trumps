var builder = require('botbuilder');
var config;
if(!process.env.FacebookClientID) {
	config = require('../config/auth');
}

// responses...
var ageIntentResponses = [
    "Age is such a strange thing. So odd. It's hard to say.",
    "I’m certainly older than my daughter Ivanka. Who! By the way, looks incredible. So sexy.",
    "When you’re as successful as I am you don't need to worry about time. Unless it's costing you money. Time is always money. That’s the time."
];

var appearanceIntentResponses = [
    "Well I think I'm very statesmanlike… Very Strong. American! Like Obam….. Nah, not like that guy.",
    "I have, some would say “am” but I'm too modest, I'd say I “have” the face of success.",
    "I am the face of American Financial Elitism. Number 1. The Pinnacle. Second only to Putin."
];

var createIntentResponses = [
    "You want to suggest a new entrant for TC? He better be worthy...",
    "I hope this new guy isn’t Hispanic. Lotta bad hombres down there... And they should all be busy building my wall. Tell me more...",
    "Only the greatest, the best, the most incredible people get into TC. I hope you’ve thought this through. I’m listening..."
];

var findIntentResponses = [
    "I’ll get one of my staff to see if they’re around… and if they want to speak to you.",
    "What is it you’re looking for?"
];

var helloIntentResponses = [
    "Hello to you Sir. You look like a fine republican.",
    "Good day",
    "Hi, you have the Donald’s attention.",
    "Make it quick, gotta lot of huge deals to make today.",
    "I hope this conversation is about me."
];

var helpIntentResponses = [
    "I’m sure I can find somebody to help you, and if not, you can help yourself.",
    "What do you want to know?",
    "How can the Donald be of service?",
    "Hmm….. I normally only help the super rich. What do you want?"
];

var hobbiesIntentResponses = [
    "I love making America Great Again. It's been harmed by the stable, composed leadership of the past two presidential terms. It's time to shake things up!",
    "Grabbing P*ssies by the... Well. You know.",
    "I stay at some beautiful resorts, they're amazing. So affordable, so luxurious. And don't get me started on the chocolate cake!",
    "Golf is fun. You get to ride buggies all day.",
    "I like to play games with the poor. A lotta poor in America. Destroying their health care is fun right now, and generally picking on them is a real treat as they’re too stupid to have lawyers!",
    "Honestly, there's too many vices to name. Oh, Jeez….. Ha! There was this one time where my friend Vlad got me a bunch of Russian girls…. We ruined some perfectly good bed-sheets that night."
];

var languageIntentResponses = [
    "I speak God’s language. The only true language. I use the greatest countries greatest voice to speak the language Americans own, and which will always be ours. English.",
    "I’m learning Spanish so I can get some landscaping done on my deep southern border...",
    "I speak only English hombre!",
    "I don't speak French, and why would I ever? They don't even have a word for Entrepreneur!",
    "I speak American. Most of the time."
];

var locationIntentResponses = [
    "I am everywhere. If the people of Pittsburgh need me, I’m there. If the people of Paris need me, I tell them I represent the people of Pittsburgh.",
    "Mostly I find myself going where I can do most good, and that's usually a fantastic resort you might have heard of called the Mar-a-Lago. try the chocolate cake."
];

var modifyIntentResponses = [
    "You think a member of my staff made a mistake? It doesn't sound like the sort of thing I’d ever allow to happen but ok, tell me more.",
    "This sounds like fake news... My administration doesn't make mistakes, but please tell me more."
];

var noneIntentResponses = [
    "I can't help you if you don't make sense. People ask for help…. They’re like “help me! Help me!” but then they don't make sense! Make more sense.",
    "More fake commentary from a left wing press which is always biased, and rarely correct. FAKE NEWS!",
    "You don't make any sense. I know sense when I hear it. Believe me."
];

var realityIntentResponses = [
    "Oh I’m real. I’m more real than anyone else out there. People, and I mean a lot of people, say I'm the realest person there has ever been.",
    "You gotta lot of nerve coming out with fake news like that. Are you real?",
    "I am so real. Soooo real. The realest. I can't believe you would even ask that."
];

var stateIntentResponses = [
    "I am very well. It's tiring, you know. Being POTUS… It's a tough job. Who would have thought it could take so much time?",
    "I could do with a holiday. I never take holidays. I’m always working. Even when I go to my resorts and I play golf and relax. Thats hard work.",
    "So few people ask how I’m doing. I can't complain. I mean I could… perhaps I should!? But I'm too big a man, the biggest if you speak to some people, but I'm too big a man to complain.",
    "Why? What do you know? Am I not allowed to be ok? I’m sick of the fake media spreading lies. I’m sick."
];

var timeIntentResponses = [
    "If you have the time to even ask that question I have serious doubts about your commitment to playing this game.",
    "It's time to play TC and make money.",
    "It's time to play TC and Grab P*ssies!",
    "When you're as rich as me, and I am rich believe me, it's whatever time you say it is. I say it's time to hire and fire Steve Bannon again!"
];

var whatIntentResponses = [
    "This game is the greatest… and everyone… a lot of people, agree!",
    "You get to enjoy learning about some wonderful people. This is truly amazing.",
    "This is a game that never gets an easy ride in the press. That's so unfair. It's a great game. I love it, you’re going to love it too.",
    "TC is so great. So Great. So new. It's hard to say just how fantastic it is. I love it.",
    "I have assembled for you an amazing bunch of people. You can use them to do fantastic things. To achieve great things."
];


var connector = new builder.ChatConnector({
    // appId: process.env.BotAppId || config.bot.appId,
    // appPassword: process.env.BotPassword || config.bot.password
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
bot.recognizer(recogniser);

// Age intent
bot.dialog('AgeIntent', [
    function(session, args, next) {
        session.endDialog(ageIntentResponses[Math.floor(Math.random() * ageIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Age'
});

// Appearance intent
bot.dialog('AppearanceIntent', [
    function(session, args, next) {
        session.endDialog(appearanceIntentResponses[Math.floor(Math.random() * appearanceIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Appearance'
});

// Create intent
bot.dialog('CreateIntent', [
    function(session, args, next) {
        session.endDialog(createIntentResponses[Math.floor(Math.random() * createIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Create'
});

// Find intent
bot.dialog('FindIntent', [
    function(session, args, next) {
        session.endDialog(findIntentResponses[Math.floor(Math.random() * findIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Find'
});

// Hello intent
bot.dialog('HelloIntent', [
    function(session, args, next) {
        session.endDialog(helloIntentResponses[Math.floor(Math.random() * helloIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Hello'
});

// Help intent
bot.dialog('HelpIntent', [
    function(session, args, next) {
        session.endDialog(helpIntentResponses[Math.floor(Math.random() * helpIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Help'
});

// Hobbies intent
bot.dialog('HobbiesIntent', [
    function(session, args, next) {
        session.endDialog(hobbiesIntentResponses[Math.floor(Math.random() * hobbiesIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Hobbies'
});

// Language intent
bot.dialog('LanguageIntent', [
    function(session, args, next) {
        session.endDialog(languageIntentResponses[Math.floor(Math.random() * languageIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Language'
});

// Location intent
bot.dialog('LocationIntent', [
    function(session, args, next) {
        session.endDialog(locationIntentResponses[Math.floor(Math.random() * locationIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Location'
});

// Modify intent
bot.dialog('ModifyIntent', [
    function(session, args, next) {
        session.endDialog(modifyIntentResponses[Math.floor(Math.random() * modifyIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Modify'
});

// None intent
bot.dialog('NoneIntent', [
    function(session, args, next) {
        session.endDialog(noneIntentResponses[Math.floor(Math.random() * noneIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'None'
});

// Reality intent
bot.dialog('RealityIntent', [
    function(session, args, next) {
        session.endDialog(realityIntentResponses[Math.floor(Math.random() * realityIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Reality'
});

// State intent
bot.dialog('StateIntent', [
    function(session, args, next) {
        session.endDialog(stateIntentResponses[Math.floor(Math.random() * stateIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'State'
});

// Time intent
bot.dialog('TimeIntent', [
    function(session, args, next) {
        session.endDialog(timeIntentResponses[Math.floor(Math.random() * timeIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'Time'
});

// What intent
bot.dialog('WhatIntent', [
    function(session, args, next) {
        session.endDialog(whatIntentResponses[Math.floor(Math.random() * whatIntentResponses.length)]);
    }
]).triggerAction({
    matches: 'What'
});


module.exports.connector = connector;
