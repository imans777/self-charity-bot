var buttons = require('./button');

var reply = {
    test: [
        [buttons.send_code.label]
    ],
    selfs: [],
};

Object.keys(buttons).forEach(el => {
    if (el.includes('self')) {
        reply['selfs'].push([buttons[el].label]);
    }
})

module.exports = reply;