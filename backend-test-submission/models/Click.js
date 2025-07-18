const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: 'Url' },
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String
});

module.exports = mongoose.model('Click', ClickSchema);
