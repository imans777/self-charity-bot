var Telebot = require('telebot');
var info = require('./info');
var button = require('./button');

var bot = new Telebot({
    token: info.token,
    polling: {
        interval: 100,
        retryTimeout: 500,
    },
    usePlugins: ['namedButtons', 'askUser'],
    pluginConfig: {
        namedButtons: {
            buttons: button
        },
    },
});

var commands = require('./commands');
commands(bot);
bot.start();