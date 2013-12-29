var ticks = 0;
var m = 0;
var s = 0;
var ms = 0;
var t;
var linestime;
var index = 0;

//function beginPlay() {
//    //debugger;
//    t = setInterval(function () { startTime(); }, 10);
//    //launchMotion();
//    $('#stopBtn').removeAttr('disabled');
//    source1.start(0);
//}

function startTime() {
    ticks += 1;
    s = parseInt(s);
    m = parseInt(m);
    if (ticks > 60) {
        m = m + 1;
        ticks = 0;
    }
    
    s = ticks;
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    var format = '[' + m + ":" + s + ']';
    self.postMessage({ 'Time': format });
    //document.getElementById('txt').innerHTML = format;
    //if (linestime != undefined) {
    //    if (format == linestime[index].substring(0, 7)) {
    //        commandLine = linestime[index].substring(7, linestime[index].length - 1);
    //        //debugger;
    //        //$('#lyrics').text(commandLine);
    //        //annyang.playMusic(commandLine);
    //        var lyrics = linestime[index].length.toString();
    //        index = index + 1;
    //        self.postMessage({ 'Match': lyrics });
    //    }
    //}
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

//function stopPlay() {
//    clearInterval(t);
//    source1.stop(0);
//    landDrone();
//}

self.onmessage = function (e) {
    if (t == undefined) {
        t = setInterval(function () { startTime(); }, 1000); 
    }
}