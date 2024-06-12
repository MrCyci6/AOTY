const express = require('express');
const passport = require('passport');
const session = require('express-session');
const fs = require("fs");
const {
    join
} = require('path');

const bot = require('./bot.js');
const config = require('./config.json');

const app = express();

app.use(express.static('public'));
app.use(session(
	{ 
		secret: 'Llmbuqzemoùqzdqih5qeùm#', 
		resave: false, 
		saveUninitialized: false 
	}
));
app.use(passport.initialize());
app.use(passport.session());


require('./utils/passportUtils.js')(passport);

fs.readdirSync("./routes").forEach(file => {
	
	if(!file.endsWith('.js')) return;  
    
    app.use('/', require(`./routes/${file}`)); 
    console.log(`>>> route : ${file}`);
})

app.use('*', (req, res) => {
    res.sendFile(join(__dirname, "static", 'searcher.html'));
})


try {
	bot.startBot();
    let port = config.bot.port || 80;
    app.listen(port, () => console.log(`- Panel enabled on ${config.bot.callbackUrl}`));

	setInterval(() => {
		let date = new Date();
		if((date.getHours() == 0 || date.getHours() == '00') && (date.getMinutes() == 0 || date.getMinutes() == '00')) {
			require('./utils/searchUtils.js').cleanSearch();
		}
	}, 30000);
} catch (e) {
	console.log(`[API ERROR][START] - ${e}`);
}
