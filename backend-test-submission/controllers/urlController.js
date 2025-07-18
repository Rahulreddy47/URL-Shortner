const dotenv = require('dotenv');
dotenv.config(); 

const Url = require('../models/Url');
const Click = require('../models/Click');
const generateShortcode = require('../utils/generateShortcode');
const geoip = require('geoip-lite');

const { HOSTNAME } = process.env;

exports.createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required' });

    let finalCode = shortcode || generateShortcode();

    const exists = await Url.findOne({ shortcode: finalCode });
    if (exists) return res.status(409).json({ message: 'Shortcode already exists' });

    const expiry = new Date(Date.now() + validity * 60000);

    const newUrl = await Url.create({
      originalUrl: url,
      shortcode: finalCode,
      expiry
    });

    return res.status(201).json({
      shortLink: `${HOSTNAME}/${finalCode}`,
      
      expiry: expiry.toISOString()

    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.redirectToOriginal = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = await Url.findOne({ shortcode });

    if (!urlDoc) return res.status(404).json({ message: 'Shortcode not found' });
    if (new Date() > urlDoc.expiry)
      return res.status(410).json({ message: 'Short link has expired' });

    const location = geoip.lookup(req.ip)?.country || 'unknown';

    const click = await Click.create({
      urlId: urlDoc._id,
      referrer: req.get('Referrer') || 'direct',
      location
    });

    urlDoc.clicks.push(click._id);
    await urlDoc.save();

    return res.redirect(urlDoc.originalUrl);
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = await Url.findOne({ shortcode }).populate('clicks');

    if (!urlDoc) return res.status(404).json({ message: 'Shortcode not found' });

    return res.status(200).json({
      url: urlDoc.originalUrl,
      createdAt: urlDoc.createdAt.toISOString(),
      expiry: urlDoc.expiry.toISOString(),
      totalClicks: urlDoc.clicks.length,
      clicks: urlDoc.clicks.map(click => ({
        timestamp: click.timestamp.toISOString(),
        referrer: click.referrer,
        location: click.location
      }))
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
