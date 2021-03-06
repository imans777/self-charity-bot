const info = {};


const env = 'test'; // currently no need
info['isDev'] = false;

if (env === 'test')
    isDev = true;

if (isDev)
    require('dotenv').config();

info['token'] = process.env.TOKEN;

info['hamvade_service'] = process.env.HAMVADE_SERVICE && process.env.HAMVADE_SERVICE.toLowerCase() == "true" || false;
info['admin_user_id'] = process.env.ADMIN_USER_ID;
info['channel_id'] = process.env.CHANNEL_ID;

info['proxy'] = process.env.PROXY;

info['plan_service'] = process.env.PLAN_SERVICE && process.env.PLAN_SERVICE.toLowerCase() == "true" || false;
info['db_url'] = process.env.DB_URL;
info['db'] = process.env.DB;

info['plan_group_id'] = []
const PLAN_BASE = "PLAN_GROUP_ID_"
let i = 1;
for (i; process.env[PLAN_BASE + i]; i++) {
    info['plan_group_id'].push(process.env[PLAN_BASE + i]);
}

info['fa-ascii'] = {
    zero: 1776,
    nine: 1785
};

module.exports = info;
