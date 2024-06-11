const express = require('express');
const router = express.Router();
const {
    join
} = require('path');

router.get('/', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'searcher.html'));
})

router.get('/xwc', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'xwc.html'));
})

router.get('/about', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'index.html'));
})

router.get('/price', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'price.html'));
})

router.get('/old', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'old.html'));
})

router.get('/databases', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'databases.html'));
})

router.get('/searcher', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'searcher.html'));
})

router.get('/dehash', (req, res) => {
    res.sendFile(join(__dirname, "..", "static", 'dehash.html'));
})

router.get('/login', (req, res) => {
    res.redirect("/auth/discord");
})

router.get('/discord', async (req, res) => {
    res.redirect("https://discord.gg/snusbase");
});

router.get('/logout', (req, res) => {
    req.logout(err => {
        if(err) return res.send({error: `An error as ocurred`})
    })
    
    res.redirect('/');
})

module.exports = router