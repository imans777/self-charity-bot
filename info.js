const info = {};


const env = 'test'; // currently no need
info['isDev'] = false;

if (env === 'test')
    isDev = true;

if (isDev)
    require('dotenv').config();

info['token'] = process.env.TOKEN;
info['admin_user_id'] = process.env.ADMIN_USER_ID;
info['channel_id'] = process.env.CHANNEL_ID;
info['proxy'] = process.env.PROXY;

info['fa-ascii'] = {
    zero: 1776,
    nine: 1785
};

module.exports = info;