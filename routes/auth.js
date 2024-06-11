const express = require('express');
const passport = require('passport')
const fs = require('fs');
const router = express.Router();

const config = require('../config.json')

router.get('/auth/discord', passport.authenticate('discord', { scope: config.bot.scope }) )

router.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/auth/discord', successRedirect: '/' }) )

router.get('/api/getprofil', async (req, res) => {
	if(req.isAuthenticated()) {
        res.json({
            user: req.user
        });

        let ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
        let ips = fs.readFileSync('./aoty_ips.txt', 'utf-8').replace(/\r/, "").split("\n");
        let ok = false;
        ips.map(i => {
            let splitted = i.split(" - ");
            if(splitted[1] == req.user.id) {
                ok = true;
                return `${req.user.username} - ${req.user.id} - ${splitted[2]} - ${ip}`;
            }
        });
        if(!ok) ips.push(`${req.user.username} - ${req.user.id} - ${ip} - ${ip}`);
        fs.writeFileSync('./aoty_ips.txt', ips.join("\n"));
    } else {
        res.json({
            result: `Not connected`
        })
    }
});

module.exports = router