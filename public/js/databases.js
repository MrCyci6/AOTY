document.addEventListener('DOMContentLoaded', event => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/databases', true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
            
            if(json.list) {
                let list = document.querySelector(".card");
                json.list.forEach(db => {
                    list.innerHTML += `<p>${db}</p>`;
                });
            }
        }
    }
});