const Url = require('../models/Url');
const { generateBase62Alias } = require('../utils/base62');

const shortenUrl = async (req, res) => {
  const { originalUrl, customAlias } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  try {
    let alias = customAlias || generateBase62Alias();
    
    const newUrl = new Url({
      originalUrl,
      alias
    });

    await newUrl.save();
    
    const shortUrl = `${req.protocol}://${req.get('host')}/${alias}`;

    res.status(201).json({
      originalUrl,
      alias,
      shortUrl
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Alias already in use' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

const redirectUrl = async (req, res) => {
  const { alias } = req.params;

  try {
    const urlDoc = await Url.findOne({ alias });

    if (!urlDoc) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Fire-and-forget telemetry update per requirements
    Url.findOneAndUpdate({ alias }, { $inc: { clicks: 1 } }).exec().catch(err => console.error('Telemetry update failed:', err));

    // Redirect immediately without waiting for DB operation
    return res.redirect(302, urlDoc.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { shortenUrl, redirectUrl };
