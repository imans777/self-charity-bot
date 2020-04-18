var buttons = {
    hello: {
        label: 'Hello',
        command: '/hello',
    },
    send_code: {
        label: 'ارسال کد',
        command: '/send_code',
    },
    plans: {
        label: "💝 انتخاب طرح 💝",
        command: '/plans',
    },
    return_back: {
        label: 'لغو',
        command: '/cancel_code',
    },
    plan_return: {
        label: 'بازگشت',
        command: '/plan_cancel_code',
    },

    // SELFS -> should start with 'self'
    // NOTE: THESE SHOULD NOT HAVE CONFLICTS WITH "readable_name" IN DATABASE!!!
    self_amirabad_down: {
        label: 'سلف فنی امیرآباد (طبقه اول، سلف کارشناسی آقایان)',
        command: '/self__fani_amirabad_down'
    },
    self_amirabad_up: {
        label: 'سلف فنی امیرآباد (طبقه دوم، سلف ارشد، دکتری و بانوان)',
        command: '/self_fani_amirabad_up'
    },
    self_fanni_16_azar_men: {
        label: 'سلف برادران دانشکده فنی ۱۶ آذر',
        command: '/self_fanni_16_azar_men'
    },
    // self_fanni_16_azar_women: {
    //     label: 'سلف خواهران دانشکده فنی ۱۶ آذر',
    //     command: '/self_fanni_16_azar_women'
    // },
    self_pardis_oloom_women: {
        label: 'سلف پردیس علوم (بانوان)',
        command: '/self_pardis_oloom_women'
    },
};

module.exports = buttons;