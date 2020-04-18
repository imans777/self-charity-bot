var buttons = require('./button');

var reply = {
    main_page: [
        // [buttons.send_code.label], // TODO: disable this for hamvade
        [buttons.plans.label],
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

module.exports = reply;