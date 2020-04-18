const info = require('../info');
const buttons = require('../button');
const messages = require('../messages');
const replies = require('../replies');
const DBQuery = require('../db/queries');
const numConverter = require('../utility/number_converter');

const donation = {
    user_id: "msg.from.id",
    plan_id: "getFromDB",
    stock: 0,
};

module.exports = (bot) => {
    const dbQuery = new DBQuery();
    donations = []

    bot.on('/dbcon', msg => {
        console.log("db object is: ", db());
    });

    bot.on("/plancheck", msg => {
        console.log(donations);
        console.log("me: ", msg.from);
    })

    bot.on("/set_group", msg => {
        try {
            console.log("@@@ group info: ", msg, ">>> GROUP_ID=", msg.chat.id);
        } catch (error) {
            console.error("NOT A GROUP!", error);
        }
    })

    // FIXME: ok so there's been a bit messing up from commit "6b048a3d09b9a796441c5f662e3964bd29fe8a49"! consider fixing those!

    function showMainPage(msg) {
        bot.sendMessage(msg.from.id, decodeURI(messages.advanced.start_intro), {
            replyMarkup: bot.keyboard(replies.main_page, {resize: true}),
        }).catch(err => {
            console.log("error showing main page: ", err);
        });
    }

    // FIXME: consider removing "/start" from here
    bot.on([buttons.plan_return.command, "/start"], msg => {
        donations = donations.filter(el => el.user_id !== msg.from.id);
        showMainPage(msg);
    });

    bot.on(buttons.plans.command, msg => {
        dbQuery.saveUser(msg).then(() => {
            return dbQuery.getActivePlans().then(res => {
                planNames = res.map(res => [res['readable_name']]);
                planNames.push([buttons.plan_return.label]);
                bot.sendMessage(msg.from.id, decodeURI(messages.advanced.plans_intro), {
                    replyMarkup: bot.keyboard(planNames, {resize: true}),
                    ask: 'choose_plan',
                });
            }).catch(err => Promise.reject(err));
        }).catch(err => {
            console.error("error in getting plans: ", err);
            return showMainPage(msg);
        });
    });

    bot.on('ask.choose_plan', msg => {
        if (msg.text === buttons.plan_return.label)
            return;

        dbQuery.getPlan(msg.text).then(res => {
            donations.push({
                user_id: msg.from.id,
                plan_id: res["_id"],
                stock: 0,
            });
            return bot.sendMessage(msg.from.id, decodeURI(messages.advanced.send_stock), {
                replyMarkup: bot.keyboard(replies.plan_return_back, {resize: true}),
                ask: 'get_stock',
            });
        }).catch(err => {
            console.error("error in choosing plan: ", err);
            return showMainPage(msg);
        });
    });

    bot.on('ask.get_stock', msg => {
        if (msg.text === buttons.plan_return.label)
            return;

        if (!isStockValid(msg.text)) {
            bot.sendMessage(msg.from.id, decodeURI(messages.advanced.send_stock_considering_max_number), {
                replyMarkup: bot.keyboard(replies.plan_return_back, {resize: true}),
                ask: 'get_stock',
            });
            return;
        }

        don = donations.find(el => el.user_id === msg.from.id);
        if (!don) {
            showMainPage(msg);
            return;
        }
        don['stock'] = parseInt(numConverter.toEnglishNumber(msg.text));

        bot.sendMessage(msg.from.id, decodeURI(messages.advanced.send_mobile_number), {
            replyMarkup: bot.keyboard([
                [bot.button('contact', 'ارسال شماره همراه')],
                replies.plan_return_back[0],
            ], {resize: true}),
        });
    });

    bot.on('contact', msg => {
        if (msg.text === buttons.plan_return.label)
            return;

        don = donations.find(el => el.user_id === msg.from.id);
        if (!don) {
            showMainPage(msg);
            return;
        }
        don['mobile'] = msg.contact.phone_number;

        dbQuery.makeDonation(don).then(() => {
            return bot.sendMessage(msg.from.id, decodeURI(messages.advanced.submitted_thanks), {
                replyMarkup: bot.keyboard(replies.main_page, {resize: true}),
            }).then(() => {
                return dbQuery.getRemainingStocksForPlan(don["plan_id"]).then(obj => {
                    return bot.sendMessage(info['plan_group_id'],
                        decodeURI(getStatement(obj["plan_name"], don['stock'], obj["remaining_stocks"]))
                    ).then(() => {
                        console.log("done");
                        donations = donations.filter(el => el.user_id !== msg.from.id);
                    }).catch(err => Promise.reject(err));
                }).catch(err => Promise.reject(err))
            }).catch(err => Promise.reject(err));
        }).catch(err => {
            console.error("err in plan final step: ", err);
            return showMainPage(msg);
        });
    });

    function isStockValid(stock) {
        const INT = parseInt(stock);
        if (typeof INT === "number" && INT > 0 && INT <= 50)
            return true;
        else if (typeof stock === "string" && stock.length > 0) {
            for (let i in stock) {
                const faNum = stock[i].charCodeAt(0);
                if (!(faNum >= info['fa-ascii'].zero && faNum <= info['fa-ascii'].nine))
                    return false;
            }

            if (numConverter.toEnglishNumber(stock) > 50)
                return false;

            return true;
        }
        return false;
    }

    function getStatement(plan_name, donated_stocks, remaining_stocks) {
        let st = '';
        // st += encodeURI("📔 ") + encodeURI(plan_name); // TODO: should be "button_name" and "showing_name"
        st += encodeURI(plan_name);
        st += encodeURI("\n\n");

        st += encodeURI("تعداد ") + numConverter.toPersianNumber(donated_stocks) + encodeURI(" سهم تقبل شد 🙏");
        st += encodeURI("\n\n");

        if (remaining_stocks > 0)
            st += encodeURI("💢 تعداد سهم‌های باقی‌مانده: ") + numConverter.toPersianNumber(remaining_stocks) + encodeURI(" سهم");
        else
            st += encodeURI("❗️ سهم‌ها به پایان رسید ❗️");
        st += encodeURI("\n\n");

        st += encodeURI("#سهم_مهربانی");
        st += encodeURI("\n");

        st += encodeURI("#هم_وعده");
        st += encodeURI("\n");

        st += encodeURI("#اهدای_ارزاق");
        st += encodeURI("\n");

        return st;
    }
}