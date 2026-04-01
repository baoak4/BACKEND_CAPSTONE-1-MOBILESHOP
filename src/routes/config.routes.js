const express = require('express');
const KEY = require('../config/key');
const router = express.Router();

// Get Stripe Public Key (safe to expose publicly)
router.get('/stripe-public-key', (req, res) => {
    res.json({
        stripePublicKey: KEY.STRIPE_PUBLIC_KEY
    });
});

module.exports = router;
