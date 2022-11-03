const mongoose = require('mongoose');

var cleanfoodDb     = mongoose.createConnection('mongodb://localhost/CleanFood');
var historyorderDb    = mongoose.createConnection('mongodb://localhost/HistoryOrder');

module.exports = {
    cleanfoodDb,
    historyorderDb,
};