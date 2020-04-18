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
    return new Promise((resolve, reject) => {
        require('./db/db').init(err => {
            try {
                if (err) throw err;

                var planCmd = require('./commands/plan');
                planCmd(bot);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
}

function start() {
    if (info.hamvade_service) {
        startHamvadeService();
        console.log("hamvade service is up");
    } else {
        console.warn("hamvade service is disabled");
    }

    if (info.plan_service) {
        startPlanService().then(res => {
            console.log("plan service is up");
            bot.start();
        }).catch(err => {
            console.error("PLAN Service is not available: ", err);
            bot.start(); // FIXME: should we start it? or let it roll out?
        });
    }
    else {
        console.warn("plan service is disabled");
        bot.start();
    }
}

start();
