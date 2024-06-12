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

router.get('/smih', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'smih.html'));
})

router.get('/juma', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'juma.html'));
})

module.exports = router