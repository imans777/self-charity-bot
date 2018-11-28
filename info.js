const info = {};

const app = require('express')();
const env = app.get('env');
info['isDev'] = false;

if (env === 'test')
    isDev = true;

if (isDev)
    require('dotenv').config();

info['token'] = process.env.TOKEN;
info['admin_user_id'] = process.env.ADMIN_USER_ID;

module.exports = info;