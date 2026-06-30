const express = require('express');
const { shortenUrl, redirectUrl } = require('../controllers/urlController');

const router = express.Router();

router.post('/api/shorten', shortenUrl);
router.get('/:alias', redirectUrl);

module.exports = router;
