const express = require('express');
const router = express.Router();
const { join } = require('path');
const { searchLog, getSearchInfo, incrementSearchInfo, checkValidSearch, isHashOrIpSearch, isEmail, ContainSearched, isBlacklist, find} = require('../utils/searchUtils.js');

const bot = require('../bot.js');
const config = require('../config.json');


router.get('/api/search', async (req, res) => {
	if(req.isAuthenticated()) {
        let toSearch = req.query.text;
        searchLog(req.user.id, req.user.username, toSearch);

        let guild = bot.client.guilds.cache.get(config.server.id);
        let user = guild?.members.cache.get(req.user.id);

        if(!user || (!user.roles.cache.has(config.roles.customer) && !config.owners.includes(req.user.id))) {
            res.json({
                result: `Upgrade your plan`
            })
            return;
        }

        if(getSearchInfo(req.user.id)?.day > config.bot.maxSearchPerDay) {
            res.json({result: "Search per day limited"});
            return;
        }

        if (toSearch === undefined) {
            res.end()
            return
        }

        if (isBlacklist(toSearch)) {
            res.json({
                result: "User blacklisted"
            })
            return
        }

        if (!checkValidSearch(toSearch)) {
            res.json({
                result: "Invalid Search"
            })
            return
        }

        find(toSearch, function (result) {
            incrementSearchInfo(req.user.id);
            if (result === "Too Much Data") {
                res.json({
                    result: "Too Much Data"
                })
                return
            }
            if (result === "No Data") {
                res.json({
                    result: "No Data"
                })
                return
            }

            let RealResult = []
            toSearch = toSearch.trim().replace(/\s\s+/g, '')
            for (let i = 0; i < result.length; i++) {
                const splittedResult = result.at(i).trim().replace(/\s\s+/g, ' ').split(" ")
                for (let u = 0; u < splittedResult.length; u++) {
                    if (isHashOrIpSearch(toSearch)) {
                        if (ContainSearched(splittedResult.at(u), toSearch)) {
                            RealResult.push(result.at(i))
                        }
                    } else if (isEmail(toSearch)) {
                        if (ContainSearched(splittedResult.at(u), toSearch)) {
                            RealResult.push(result.at(i))
                        }
                    } else {
                        if (ContainSearched(splittedResult.at(u), toSearch) && splittedResult.at(u).length <= 16 && !(splittedResult.at(u).includes(".")) && !(splittedResult.at(u).includes("-"))) {
                            RealResult.push(result.at(i))
                        }
                    }
                }
            }

            let arrayResult = []
            for (let o = 0; o < RealResult.length; o++) {
                const splittedRealResult = RealResult.at(o).split(" ")
                const oneResult = {
                    ips: "",
                    emails: "",
                    passwords: "",
                    pseudos: "",
                    uuid: ""
                }
                for (let a = 0; a < splittedRealResult.length; a++) {
                    const text = splittedRealResult.at(a)
                    if (require('net').isIP(text)) {
                        oneResult.ips = text
                    } else if (text.match("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$") && !text.includes('$SHA256$')) {
                        oneResult.emails = text
                    } else if (text.includes("$") && text.length >= 16) {
                        oneResult.passwords = text
                    } else if (text.match("[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}")) {
                        oneResult.uuid = text
                    } else if (text.includes("-")) {
                        oneResult.ips = text
                    } else if (oneResult.pseudos.length === 0) {
                        oneResult.pseudos = text
                    } else {
                        oneResult.passwords = text
                    }
                }
                arrayResult.push(oneResult)
            }

            if (arrayResult.length > 200) {
                res.json({
                    result: "Too many results"
                })
                return
            }

            res.json(arrayResult)
        })
    } else {
        res.json({
            result: `Not connected`
        })
    }
})

module.exports = router