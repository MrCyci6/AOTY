function Search() {
    const information = document.getElementById("search").value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/search?text=' + information, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);

            const results = document.querySelector('#tbody-result');
            while (results.firstChild && results.childNodes.length != 3) {
                results.removeChild(results.lastChild);
            }


            if (json.length === undefined || json.length === 0) {
                if (json.length == 0) {
                    addNotification("Information", "No Data")
                    return;
                }

                addNotification("Information", json.result);
            } else {

                for (var i = 0; i < json.length; i++) {
                    const value = json[i];

                    const tr = document.createElement('tr');
                    appendToTr(tr, value.pseudos);
                    appendToTr(tr, value.passwords);
                    appendToTr(tr, value.emails);
                    appendToTr(tr, value.uuid);
                    appendToTr(tr, value.ips);

                    results.appendChild(tr);
                }
                
                document.getElementById("formdiv").classList.replace('nosearch', 'searched');
                document.getElementById('form').classList.remove('form');
                document.getElementById('searchButton').classList.add('hidden');
                document.getElementById('res').classList.remove('hidden');
                document.getElementById('text').classList.add('hidden');
                
            }
        }
    }
}

function appendToTr(tr, str) {
    const td = document.createElement('td');
    td.innerText = str;
    tr.appendChild(td);
}

function sanitize(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function addNotification(name, message) {
    var notification = document.createElement('div');
    notification.classList.add('notification');
    
    notification.innerHTML = `<div class="notification-name">${sanitize(name)}</div><div class="notification-message">${sanitize(message)}</div>`;

    var notifications = document.getElementById('notifications');
    notifications.appendChild(notification);
    notification.classList.add('slide-in');

    setTimeout(function () {
        notification.style.opacity = 0;
        setTimeout(function () {
            notifications.removeChild(notification);
        }, 500);
    }, 5000);
}

document.getElementById('searchButton')?.addEventListener('click', event => {
    event.preventDefault();
    Search();
})

///////////////////////////////////////////////////////////////////

const phrases = [
    "_Aoty X mc",
    "Best minecraft data leaks",
    "Check out your data leaks"
];

let currentPhraseIndex = 0;
let currentLetterIndex = 0;
const typingSpeed = 100;
const erasingSpeed = 50;
const delayBetweenPhrases = 2000;

const animatedTextElement = document.querySelector('.animated-text');

function typePhrase() {
    if (currentLetterIndex < phrases[currentPhraseIndex].length) {
        animatedTextElement.textContent += phrases[currentPhraseIndex].charAt(currentLetterIndex);
        currentLetterIndex++;
        setTimeout(typePhrase, typingSpeed);
    } else {
        setTimeout(erasePhrase, delayBetweenPhrases);
    }
}

function erasePhrase() {
    if (currentLetterIndex > 0) {
        animatedTextElement.textContent = phrases[currentPhraseIndex].substring(0, currentLetterIndex - 1);
        currentLetterIndex--;
        setTimeout(erasePhrase, erasingSpeed);
    } else {
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        setTimeout(typePhrase, typingSpeed);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typePhrase, delayBetweenPhrases);
});