function SearchOld() {
    const information = document.getElementById("search");

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/old?text=' + information.value, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);

            if(json.result) addNotification("Information", json.result);

            if(json.list) {
                let list = document.querySelector(".oldresult");
                list.innerHTML = "";
                json.list.forEach(db => {
                    list.innerHTML += `<p>${db}</p>`;
                });
                
                document.getElementById('ok').classList.remove('hidden');
            }
        }
    }
};

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

document.getElementById('searchOldButton').addEventListener('click', event => {
    event.preventDefault();
    SearchOld();
});