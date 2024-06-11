const fs = require('fs');

function incrementCounter() {
    fs.readFile('data.json', 'utf8', (err, data) = {
        if (err) {
            console.error(err);
            return;
        }
        const counter = JSON.parse(data);
        counter.visits++;
        fs.writeFile('data.json', JSON.stringify(counter), 'utf8', (err) = {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Counter incremented');
        });
    });
}

module.exports = {
    incrementCounter
};
