const fs = require("fs");
let searchInfos = require('../storage/searchInfos.json');
const child_process = require('child_process');

function checkValidSearch(text) {
    if (isHashOrIpSearch(text)) {
        return true
    } else if (isEmail(text)) {
        return true
    } else if (text.match("[^a-zA-Z0-9_]") || text === "" || text.length < 3) {
        return false
    } else {
        return true
    }
}

function isHashOrIpSearch(text) {
    if (require('net').isIP(text)) {
        return true
    } else if (text.match("[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}")) {
        return true
    } else {
        return false
    }
}

function isEmail(text) {
    if (text.match("\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}")) {
        return true
    } else {
        return false
    }
}

function ContainSearched(line, searched) {
    return line.toLowerCase().includes(searched.toLowerCase()) && Math.abs(line.length - searched.length) < 2
}

function absSearch(text, test) {
    if ((text.toLowerCase().includes(test.toLowerCase()) && Math.abs(text.length - test.length) < 2) || (test.toLowerCase().includes(text.toLowerCase()) && Math.abs(test.length - text.length) < 2)) {
        return true
    }

    return false
}

function isBlacklist(test) {
    const blacklist = fs.readFileSync("./storage/blacklist.txt", 'utf8').split("\n");
    for (let i = 0; i < blacklist.length; i++) {
        const bl = blacklist[i];
        if (bl.toLowerCase() == test.toLowerCase()) {
            return true
        }
        if (absSearch(test, bl)) {
            return true
        }
    }

    return false
}

function removeDbName(text) {
    return text.replace().replace(text.split(":")[0] + ":", '')
}

function findWithGrep(text, folder, done) {
    cmd = `egrep -i -r "${text}" ${folder}/`
    childProcessSearch = child_process.exec(cmd, {
        maxBuffer: 40000
    }, function (err, stdout, stderr) {
        if (err) {
            done(err)
        } else {
            done(stdout)
        }
    });
}

function find(text, done) {
    let resultToSort = []
    findWithGrep(text, 'databases', function (result) {
        if (result.code != undefined) {
            if (result.code === 1) {
                done("No Data")
            } else {
                done("Too Much Data")
            }
            return
        }
        const splitted = result.split("\n")
        for (let i = 0; i < splitted.length; i++) {
            const clear = removeDbName(splitted.at(i)).replace(/:/g, ' ').replace(/ - /g, ' ').replace(/,/g, ' ').replace(/\+/g, ' ').replace(/;/g, ' ').trim().replace(/\s\s+/g, ' ')
            resultToSort.push(clear)
        }
        done(resultToSort)
    })
}

function getSearchInfo(id) {
    return searchInfos[id];
}

function incrementSearchInfo(id) {
    let infos = getSearchInfo(id);
    let data;
    if(infos) {
        data = { total: infos.total+1, day: infos.day+1 };
    } else {
        data = { total: 1, day: 1 };
    }
    searchInfos[id] = data;
    let newInfos = JSON.stringify(searchInfos, null, 2);
    fs.writeFileSync('./storage/searchInfos.json', newInfos);
}

function cleanSearch() {
    for(let i in searchInfos) {
        searchInfos[i].day = 0;
    }
    let newInfos = JSON.stringify(searchInfos, null, 2);
    fs.writeFileSync('./storage/searchInfos.json', newInfos);
}

function searchLog(id, username, search) {
    let date = new Date();
    fs.appendFileSync("./storage/logs.txt", `${date.toDateString()} - ${username} (${id}) : ${search}\n`);
}

module.exports = {
    checkValidSearch, 
    isHashOrIpSearch, 
    isEmail, 
    ContainSearched, 
    absSearch, 
    isBlacklist, 
    removeDbName, 
    findWithGrep, 
    find,
    getSearchInfo,
    incrementSearchInfo,
    cleanSearch,
    searchLog
}