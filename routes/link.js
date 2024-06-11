const express = require('express');
const router = express.Router();
const {
    join
} = require('path');

router.get('/xwc', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'xwc.html'));
})

router.get('/cloud', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'cloud.html'));
})

module.exports = router