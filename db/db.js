info = require('../info');

let dbObject;
let dbClient;

function initialize(cb) {
    const MongoClient = require('mongodb').MongoClient;

    let dburl = info.db_url + '/' + info.db; // FIXME: how to use proxy?
    MongoClient.connect(dburl, (err, client) => {
        if (err) return cb(err);

        dbClient = client;
        dbObject = client.db(info.db);
        cb(null);
    });
}

function closeConnection() {
    dbClient.close();
}

module.exports = {
    init: initialize,
    object: () => dbObject,
    close: closeConnection,
};
