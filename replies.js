var buttons = require('./button');

var reply = {
    send_code: [
        [buttons.eydi.label], // TODO: remove this!
        [buttons.send_code.label]
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