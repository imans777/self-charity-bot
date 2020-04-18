var buttons = require('./button');
var info = require('./info');

var reply = {
    main_page: [],
    plan_return_back: [
        [buttons.plan_return.label],
    ],
    return_back: [
        [buttons.return_back.label]
    ],
    selfs: [],
};

Object.keys(buttons).forEach(el => {
    if (el.includes('self')) {
        reply['selfs'].push([buttons[el].label]);
    }
});

if (info['hamvade_service'])
    reply.main_page.push([buttons.send_code.label])
if (info['plan_service'])
    reply.main_page.push([buttons.plans.label]);

module.exports = reply;
