const db = require('./db').object;

class Query {
    getActivePlans() {
        return new Promise((resolve, reject) => {
            if (!db()) return reject("db not ready");

            return db().collection("plans").find({active: true}).toArray((err, docs) => {
                if (err)
                    return reject(err);

                if (!docs.length)
                    return reject("no active plans");

                return resolve(docs);
            });
        })
    };

    getPlan(readable_name) {
        return new Promise((resolve, reject) => {
            if (!db()) return reject("db not ready");

            return db().collection("plans").findOne({
                readable_name,
                active: true,
            }, (err, doc) => {
                if (err)
                    return reject(err);

                if (!doc)
                    return reject("no such doc");

                return resolve(doc);
            });
        })
    };

    saveUser(msg) {
        return new Promise((resolve, reject) => {
            if (!db()) return reject("db not ready");

            return db().collection("users").update({
                _id: msg.from.id,
            }, {
                $set: {
                    username: msg.from.username,
                    first_name: msg.from.first_name,
                    last_name: msg.from.last_name,
                }
            }, {
                upsert: true,
            }, (err, res) => {
                if (err)
                    return reject(err);

                return resolve(res);
            });
        })
    };

    makeDonation(donation) {
        return new Promise((resolve, reject) => {
            if (!db()) return reject("db not ready");

            return db().collection("donations").insertOne({
                ...donation,
                date: new Date().toString(),
            }, (err, res) => {
                if (err)
                    return reject(err);

                return resolve(res);
            });
        })
    };

    getRemainingStocksForPlan(plan_id) {
        return new Promise((resolve, reject) => {
            if (!db()) return reject("db not ready");

            return db().collection("plans").findOne({_id: plan_id}, (err, res) => {
                if (err)
                    return reject(err);

                if (!res)
                    return reject("no such plan");

                return db().collection("donations").find({plan_id}).toArray((err, docs) => {
                    if (err)
                        return reject(err);

                    const donated = docs.map(doc => doc.stock).reduce((a, b) => a + b, 0);
                    let stocksLeft = res["stocks"] - donated;

                    if (stocksLeft < 0) {
                        return this.deactivatePlan(plan_id).then(r => {
                            return resolve({
                                plan_name: res["readable_name"],
                                remaining_stocks: stocksLeft,
                            });
                        }).catch(e => reject(e));
                    } else {
                        return resolve({
                            plan_name: res["readable_name"],
                            remaining_stocks: stocksLeft,
                        });
                    }
                });
            });
        })
    };

    deactivatePlan(plan_id) {
        return new Promise((resolve, reject) => {
            if (!db()) return reject("db not ready");

            return db().collection("plans").update({
                _id: plan_id,
                active: true,
            }, {
                $set: {
                    active: false,
                }
            }, (err, res) => {
                if (err)
                    return reject(err);

                resolve(res);
            })
        })
    };
}

module.exports = Query;