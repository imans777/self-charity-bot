var info = require('./info');
var buttons = require('./button');
var replies = require('./replies');
var messages = require('./messages');

const user = {
    id: 0,
    firstname: '',
    lastname: '',
    username: '',
    self: '',
    code: 0,
};


// TODO: empty this! (not delete!!)
const eyd_selfs = [
    ['دانشکده فنی امیرآباد (طبقه اول - آقایان)'],
    ['دانشکده فنی امیرآباد (طبقه دوم - دانشجویان ارشد دکتری و بانوان)'],
    [
        'دانشکده فنی انقلاب - آقایان',
        'دانشکده فنی انقلاب - بانوان'
    ],
    ['دانشکده فنی فومن'],
    ['دانشکده علوم و فنون نوین'],
    [
        'دانشکده فیزیک - آقایان',
        'دانشکده فیزیک - بانوان',
    ],
    [
        'دانشکده هنرهای زیبا - آقایان',
        'دانشکده هنرهای زیبا - بانوان',
    ],
    [
        'دانشکده دامپزشکی - آقایان',
        'دانشکده دامپزشکی - بانوان',
    ]
];

module.exports = (bot) => {
    users = [];

    bot.on('/check', msg => {
        console.log(users);
    });

    bot.on('/set_admin', msg => {
        console.log('@@@ admin info:', msg.from);
    });

    bot.on('/start', (msg) => {
        // console.log('replies:', replies);
        bot.sendMessage(msg.from.id, messages.normal.introduction, {
            replyMarkup: bot.keyboard(replies.send_code, {resize: true}),
        });
    });

    bot.on(buttons.send_code.command, msg => {
        // console.log('send code', msg.text);
        bot.sendMessage(msg.from.id, messages.normal.choose_self, {
            // TODO: revert this!
            replyMarkup: bot.keyboard([[buttons.eydi.label]].concat(replies.selfs), {resize: true})
        });
    });

    // TODO: comment this!
    bot.on(buttons.eydi.command, msg => {
        bot.sendMessage(msg.from.id, messages.normal.choose_self, {
            replyMarkup: bot.keyboard(eyd_selfs, {resize: true})
        });
    });

    bot.on(buttons.return_back.command, msg => {
        users = users.filter(el => el.id !== msg.from.id);
        bot.sendMessage(msg.from.id, messages.normal.introduction, {
            replyMarkup: bot.keyboard(replies.send_code, {resize: true}),
        });
    });

    bot.on('ask.get_code', msg => {
        if (msg.text === buttons.return_back.label) return;
        // console.log('final get code', msg.text);
        let validated = isCodeValidated(msg.text);

        if (validated) {
            users.find(el => el.id === msg.from.id)['code'] = msg.text;
            bot.sendMessage(msg.from.id, messages.normal.thank_you, {
                replyMarkup: bot.keyboard(replies.send_code, {resize: true})
            }).then(() => {
                // console.log("admin user id is : ", info, info.admin_user_id);
                bot.sendMessage(info.admin_user_id, decodeURI(getStatement(users.find(el => el.id === msg.from.id))))
                    .then(() => {
                        console.log('done');
                        users = users.filter(el => el.id !== msg.from.id);
                    });
            });
        } else {
            // get the code again!
            bot.sendMessage(msg.from.id, messages.normal.send_code, {
                ask: 'get_code'
            });
        }
    });

    bot.on('text', msg => {
        let self_found = false;

        let special_selfs = [].concat.apply([], eyd_selfs);
        let normal_selfs = [].concat.apply([], replies.selfs);
        let all_selfs = special_selfs.concat(normal_selfs);
        all_selfs.forEach(el => {
            if (self_found)
                return;
            if (el === msg.text) {
                self_found = true;
                // console.log('got self, get code', msg.text);
                users.push({
                    id: msg.from.id,
                    firstname: msg.from.first_name,
                    lastname: msg.from.last_name || '',
                    username: msg.from.username || '',
                    self: msg.text,
                    is_special: special_selfs.some(s => s === msg.text),
                });
                bot.sendMessage(msg.from.id, messages.normal.send_code, {
                    replyMarkup: bot.keyboard(replies.return_back, {resize: true}), ask: 'get_code'
                });
            }
        });
    });

    function isCodeValidated(code) {
        const inted = parseInt(code);
        if (typeof inted === 'number' && inted >= 1000 && inted <= 9999)
            return true;
        else if (typeof code === 'string' && code.length === 4) {
            let check = true;
            for (let i = 0; i < 3; i++) {
                const faNum = code[i].charCodeAt(0);
                if (!(faNum >= info['fa-ascii'].zero && faNum <= info['fa-ascii'].nine) && (check = false))
                    break;
            }
            return check;
        }
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
        if (user.is_special) {
            // TODO: change this for message occassions
            statement += encodeURI('\n🎁 مخصوص نیمه شعبان 🎁\n');
        }
        return statement;
    }
};