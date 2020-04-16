var Telebot = require('telebot');
var info = require('./info');
var button = require('./button');

var bot = new Telebot({
    token: info.token,
    polling: {
        interval: 100,
        retryTimeout: 500,
        proxy: info.proxy,
    },
    usePlugins: ['namedButtons', 'askUser'],
    pluginConfig: {
        namedButtons: {
            buttons: button
        },
    },
});

function startHamvadeService() {
    try {
        var hamvadeCmd = require('./commands/hamvade');
        hamvadeCmd(bot);
    } catch (error) {
        console.error("HAMVADE Service is not available: ", error);
        throw error;
    }
}

function startPlanService() {
    require('./db/db').init(err => {
        try {
            if (err) throw err;

            var planCmd = require('./commands/plan');
            planCmd(bot);
        } catch (error) {
            console.error("PLAN Service is not available: ", error);
            // throw error; // -> NOTE: can't use this because db/con HA is not assured!
        }
    });
}

function start() {
    startHamvadeService();
    console.log("hamvade service is up");

    if (info.plan_service) {
        startPlanService();
        console.log("plan service is up");
    }
    else
        console.log("plan service is disabled");

    bot.start();
}

start();
