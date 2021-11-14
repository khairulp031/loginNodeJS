const mongoose = require("mongoose");
const Sekolah = new mongoose.Schema({
    nama: String,
    SD: String,
    SMP: String,
    SMA: String,
    S1: String,
    S2: String,
    S3: String
});

const upsertConfig = { returnNewDocument: true, upsert: true, new: true, passRawResult: true }

Sekolah.statics.upsert_ = function (data) {
    return new Promise((resolve, reject) => {
        this.findOneAndUpdate(
            { "nama": data.nama },
            { $set: data },
            upsertConfig,
            (err, data) => {
                if (err) return resolve(null);
                resolve(data);
            }
        );
    })
}
Sekolah.statics.findByNama = function (nama) {
    return new Promise((resolve, reject) => {
        this.find({ nama: nama })
            //.limit(limit)
            //.skip((page - 1) * limit)
            //.sort({ epoch: -1 })
            .exec((err, doc) => {
                if (err) return resolve(null);
                resolve(doc);
            });
    });
}
Sekolah.statics.findBy_id = function (id) {
    return new Promise((resolve, reject) => {
        this.findById({ _id: id })
            .exec((err, doc) => {
                if (err) return resolve(null);
                resolve(doc);
            });
    });
}
Sekolah.statics.count_ = function () {
    return new Promise((resolve, reject) => {
        this.countDocuments({ SD: 'Cintakarya' })
            .exec((err, doc) => {
                if (err) return resolve(null);
                resolve(doc);
            });
    });
}
Sekolah.statics.aggregate_ = function () {
    return new Promise((resolve, reject) => {
        this.aggregate(
            [
                { $match: {} },
                {
                    $group:
                    {
                        _id: "$SD",
                        count: { $sum: 1 }
                    }
                }
            ]
        ).exec((err, doc) => {
            if (err) return resolve(null);
            resolve(doc);
        });
    });
}
Sekolah.index({ nama: 1 });
module.exports = mongoose.model('Sekolah', Sekolah);

