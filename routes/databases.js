const express = require('express');
const router = express.Router();
const { join } = require('path');

const fs = require('fs');
const config = require('../config.json');


router.get('/api/databases', (req, res) => {
    let list = [];
    fs.readdirSync('./databases').forEach(db => {
        list.push(db.split(".").slice(0, db.split(".").length - 1));
    });
    
    res.json({
        list
    });
})
module.exports = router