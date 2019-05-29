function getTimeStamp() {
    var today = new Date();
    var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+(today.getYear()-100);
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var timeStamp = date+' '+time; 
    return timeStamp;
}

