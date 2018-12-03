var buttons = {
    hello: {
        label: 'Hello',
        command: '/hello'
    },
    send_code: {
        label: 'ارسال کد',
        command: '/send_code',
    },
    return_back: {
        label: 'لغو',
        command: '/cancel_code'
    },

    // SELFS -> should start with 'self'
    self_amirabad_down: {
        label: 'سلف فنی امیرآباد (طبقه اول، سلف کارشناسی آقایان)',
        command: '/self__fani_amirabad_down'
    },
    self_amirabad_up: {
        label: 'سلف فنی امیرآباد (طبقه دوم، سلف ارشد، دکتری و بانوان)',
        command: '/self_fani_amirabad_up'
    },
};

module.exports = buttons;