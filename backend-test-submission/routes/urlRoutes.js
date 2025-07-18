const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  redirectToOriginal,
  getStats
} = require('../controllers/urlController');

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getStats);
router.get('/:shortcode', redirectToOriginal);

module.exports = router;
