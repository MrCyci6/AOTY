const express = require('express');
const router = express.Router();
const { join } = require('path');

const config = require('../config.json');


router.get('/api/old', async (req, res) => {
	if(req.isAuthenticated()) {
        let toSearch = req.query.text

        if (toSearch === undefined) {
            res.json({ result: null });
            return
        }

        let uuid;
        const uuidReq = await fetch(`https://api.mojang.com/users/profiles/minecraft/${toSearch}`);
        if (uuidReq.status == 200) {
            const uuidText = await uuidReq.text();
            const data = JSON.parse(uuidText);
            if (data.id === undefined) {
                res.json({ result: null });
                return
            }

            uuid = data.id;
        } else {
            res.json({ result: null });
            return
        }

        const oldReq = await fetch(`https://laby.net/api/v2/user/${uuid}/get-profile`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:102.0) Gecko/20100101 Firefox/102.0' }
        });
        const oldText = await oldReq.text();

        const data = JSON.parse(oldText);

        let list = [];
        for (let i = 0; i < data.username_history.length; i++) {
            if (i == data.username_history.length - 1) {
                list.push(data.username_history[i].name);
                break
            }
            if(data.username_history[i].name != "－") list.push(data.username_history[i].name);
        }

        res.json({ list });
    } else {
        res.json({
            result: `Not connected`
        })
    }
})

module.exports = router