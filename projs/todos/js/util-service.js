function makeId(length=5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i=0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function saveToStorage(key, value) {
    var strValue = JSON.stringify(value);
    localStorage.setItem(key, strValue);
}

function loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

function getTimeStamp() {
    var today = new Date();
    var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+(today.getYear()-100);
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var timeStamp = date+' '+time; 
    return timeStamp;
}

function getCheckedRadioValue(name) {
    var radios = document.getElementsByName(name);
    var checkedRadio = []; 
    radios.forEach(function(radio) {
        if (radio.checked) {checkedRadio.push(radio)}
    })
    if (checkedRadio[0]) {
        return checkedRadio[0].value;
    } else {
        return 1;
    }
}

