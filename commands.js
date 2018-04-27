var info = require('./info');
var replies = require('./replies');
var messages = require('./messages');

const user = {
    firstname: '',
    username: '',
    self: '',
    code: 0,
}

module.exports = (bot) => {
    users = [];

    // TODO: separate '/start' from '/send_code', so that the users can start the bot and send the code individually
    // TODO: check this bug that the second time that we send something, the 'ارسال کد' is sent as the self name!!!
    // TODO: upload the bot to the server
    // TODO: provide and present the bot and make necessary changes
    // TODO: set an API to get user_id for getting the admin_user_id

    bot.on('/start', (msg) => {
        console.log('replies:', replies);
        bot.sendMessage(msg.from.id, messages.normal.choose_self, {
            replyMarkup: bot.keyboard(replies.selfs, { resize: true }), ask: 'get_self'
        });
        // console.log('received message:', msg);
    });

    bot.on('/check', msg => {
        console.log(users);
    })

    bot.on('ask.get_self', (msg) => {
        users.push({
            firstname: msg.from.first_name,
            lastname: msg.from.last_name || '',
            username: msg.from.username || '',
            self: msg.text
        });
        bot.sendMessage(msg.from.id, messages.normal.send_code, {
            ask: 'get_code'
        });
    });

    bot.on('ask.get_code', (msg) => {
        let validated = isCodeValidated(parseInt(msg.text));

        if (validated) {
            users.find(el => el.firstname === msg.from.first_name)['code'] = msg.text;
            bot.sendMessage(msg.from.id, messages.normal.thank_you, {
                replyMarkup: bot.keyboard(replies.test, { resize: true })
            }).then(() => {
                bot.sendMessage(info.admin_user_id, decodeURI(getStatement(users.find(el => el.firstname === msg.from.first_name))))
                    .then(() => {
                        console.log('done');
                        users = users.filter(el => el.firstname !== msg.from.first_name);
                    });
            });
        } else {
            // get the code again!
            bot.sendMessage(msg.from.id, messages.normal.send_code, {
                ask: 'get_code'
            });
        }
    });

    function isCodeValidated(code) {
        if (typeof code === 'number' && code >= 1000 && code <= 9999)
            return true;
        return false;
    }

    function getStatement(user) {
        let statement = encodeURI("یک کد جدید رسید!\n");
        statement += encodeURI("سلف: ") + user.self + encodeURI("\n");
        statement += encodeURI("کد فراموشی: ") + user.code + encodeURI("\n");
        statement += encodeURI("از طرف: ") + user.firstname + (user.lastname ? ' ' + user.lastname : '') + encodeURI("\n");
        if (user.username) {
            statement += "@" + user.username + encodeURI("\n");
        }

        return statement;
    }
};