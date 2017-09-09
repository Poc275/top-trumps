/**
 * Store module that handles the purchasing of card packs.
 * @module server/store
 */
var config;
if(!process.env.FacebookClientID) {
	config = require('../config/auth');
}

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var options = {
	user: process.env.MongoUsername || config.mongo.username,
	pass: process.env.MongoPassword || config.mongo.password
};

var db = mongoose.createConnection('ds062919.mlab.com:62919/tc', options);
var cardSchema = require('../models/Card.js').CardSchema;
var card = db.model('cards', cardSchema);
var userSchema = require('../models/User.js').UserSchema;
var user = db.model('users', userSchema);

// class member variables
var PACK_SIZE = 5;

var store = {
    nBronze: 0,
    nSilver: 0,
    nGold: 0,
    nBrownPlatinum: 0
};

// class functions
store.purchaseBronze = function(cb) {
    store.initialiseQuantities(function(err) {
        if(err) {
            console.log(err);
            return cb(err, null);
        }

        // get all bronze
        store.getCards("Bronze", 100, function(err, bronzeCards) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            // 20% chance of silver
            store.getCards("Silver", 20, function(err, silverCards) {
                if(err) {
                    console.log(err);
                    return cb(err, null);
                }

                // 5% chance of brown platinum
                store.getCards("Brown Platinum", 5, function(err, brownPlatinumCards) {
                    if(err) {
                        console.log(err);
                        return cb(err, null);
                    }

                    var cards = bronzeCards.concat(silverCards, brownPlatinumCards);
                    var pack = store.pickRandomCards(cards);
                    return cb(null, pack);
                });
            });
        });
    });
};

store.getCards = function(order, percentage, cb) {
    if(percentage === 100) {
        card.aggregate([
            { $match: { cuntal_order: order }},
            { $project: { _id: true }}
        ], function(err, results) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            var cards = results.map(function(card) {
                return mongoose.Types.ObjectId(card._id);
            });

            return cb(null, cards);
        });
    } else {
        var amount;

        if(order === "Bronze") {
            amount = Math.ceil(store.nBronze * percentage / 100);
        } else if(order === "Silver") {
            amount = Math.ceil(store.nSilver * percentage / 100);
        } else if(order === "Gold") {
            amount = Math.ceil(store.nGold * percentage / 100);
        } else {
            amount = Math.ceil(store.nBrownPlatinum * percentage / 100);
        }

        card.aggregate([
            { $match: { cuntal_order: order }},
            { $project: { _id: true }},
            { $sample: { size: amount }}
        ], function(err, results) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            var cards = results.map(function(card) {
                return mongoose.Types.ObjectId(card._id);
            });

            return cb(null, cards);
        });
    }
};

// function that picks random cards from an array
// that will make the user's new pack (duplicates allowed)
store.pickRandomCards = function(cards) {
    var pack = [];

    for(var i = 0; i < PACK_SIZE; i++) {
        pack.push(cards[Math.floor(Math.random() * cards.length)]);
    }

    return pack;
};

// function that initialises the count of each cuntal order
// so we can work out the percentages
store.initialiseQuantities = function(cb) {
    card.aggregate([
        { $group: {
            _id: "$cuntal_order",
            total: { $sum: 1 }
        }}
    ], function(err, results) {
        if(err) {
            console.log(err);
            return cb(err);
        }

        results.forEach(function(category) {
            switch(category._id) {
                case "Bronze":
                    store.nBronze = category.total;
                    break;
                case "Silver":
                    store.nSilver = category.total;
                    break;
                case "Gold":
                    store.nGold = category.total;
                    break;
                case "Brown Platinum":
                    store.nBrownPlatinum = category.total;
                    break;
                default:
                    break;
            }
        });

        return cb(null);
    });
};

module.exports = store;