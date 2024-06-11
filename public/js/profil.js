function updateButton() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/getprofil', true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);

            if(json.result) return;

            if(json.user) {
                let button = document.getElementById('login');
                button.textContent = `${json.user.username.toUpperCase()}`;
                button.setAttribute('href', '/');
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', event => {
    updateButton();
});