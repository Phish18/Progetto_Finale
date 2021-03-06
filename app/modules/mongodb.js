const mongodb = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:admin1234@cluster0-jss0e.mongodb.net/Progetto_Finale?retryWrites=true{useNewUrlParser: true}";

module.exports = {
    insert: function(obj) {
        return new Promise((resolve, reject) => {
            mongodb.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("Progetto_Finale");
                dbo.collection("Utenti")
                    .insertOne(obj, function(err, res) {
                        if (err) reject(err);
                        db.close();
                        resolve(res);
                    });
            });
        });
    },

    login: function(obj) {
        return new Promise((resolve, reject) => {
            mongodb.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("Progetto_Finale");
                dbo.collection("Utenti")
                    .countDocuments(obj, function(err, res) {
                        if (err) reject(err);
                        db.close();
                        resolve(res);
                    });
            });
        });
    },

    getMonopattini: function() {
        return new Promise((resolve, reject) => {
            mongodb.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("Progetto_Finale");
                dbo.collection("Monopattini")
                    .find({ disponibilita: true }).toArray(function(err, res) {
                        if (err) reject(err);
                        db.close();
                        resolve(res);
                    });
            });
        });
    },

    prenota: (qr, username, data) => {
        return new Promise((resolve, reject) => {
            mongodb.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("Progetto_Finale");
                dbo.collection("Monopattini")
                    .updateOne({ qr: qr, disponibilita: true }, {
                        $push: {
                            "prenotazioni": {
                                username: username, data: data
                            }
                        },
                        $set: {
                            disponibilita: false
                        }
                    }, function(err, res) {
                        if (err) reject(err);
                        db.close();
                        resolve(res);
                    });
            });
        });
    },
    rilascia: (qr, username, data) => {
        return new Promise((resolve, reject) => {
            mongodb.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("Progetto_Finale");
                dbo.collection("Monopattini")
                    .updateOne({ qr: qr, disponibilita: false, "prenotazioni.data": data }, {
                        $set: {
                            disponibilita: true,
                            "prenotazioni.$.dataRilascio":new Date()
                        }
                    }, function(err, res) {
                        if (err) reject(err);
                        db.close();
                        resolve(res);
                    });
            });
        });
    },

    cancellaMacelloMontini: function() {
        mongodb.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("Progetto_Finale");
            dbo.collection("Utenti")
                .remove({}, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
        });
    }
}