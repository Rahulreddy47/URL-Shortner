const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clicks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Click' }]
});

module.exports = mongoose.model('Url', UrlSchema);
