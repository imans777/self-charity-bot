info = require('../info');

let dbObject;
let dbClient;

function initialize(errcb) {
    const MongoClient = require('mongodb').MongoClient;

    let dburl = info.db_url + '/' + info.db; // FIXME: how to use proxy?
    MongoClient.connect(dburl, (err, client) => {
        if (err) return errcb(err);

        dbClient = client;
        dbObject = client.db(info.db);
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
