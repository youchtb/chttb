var version = 1;
var url = 'https://youchtb.github.io/chttb/';

var timestamp;
var currentBundle;
var bundle;
currentBundle = document.createElement('div');
currentBundle.style = 'position:absolute;bottom:0;';
currentBundle.textContent = 'loading';
document.getElementsByTagName('body')[0].appendChild(currentBundle);

function init(){
    nodes = document.querySelectorAll('html, body, object');
    for (var i = 0; i < nodes.length; i++){
        nodes[i].style.height = nodes[i].style.width = '100%';
    }
}

function inject(ver, bundle, forced) {
    // if (ver != version) {
    //     alert('Версия лоадера устарела, пересоздайте закладки.');
    //     window.location.href = url;
    // }
    localStorage.setItem('bundle', bundle);
    var flashApp = document.getElementById('flash-app');
    if (!forced && (window.inWatch || flashApp.data.indexOf("loader") != -1)){
        observe();
        return;
    }
    if (bundle == undefined) return;
    if (window.bundle == undefined){
        init();
        flashApp.data = url + 'client' + bundle + '.swf';
        flashApp.parentNode.replaceChild(flashApp.cloneNode(true), flashApp);
        flashApp = document.getElementById('flash-app');
    }else{
        flashApp.data = url + 'client' + bundle + '.swf';
    }
    window.bundle = bundle ? bundle.substring(1) : 'main';
    setCurrent(window.bundle);
}

function setCurrent(bundle){
    currentBundle.textContent = bundle;
}

function observe(){
    if (!window.oldLoadSwf){
        window.oldLoadSwf = LoadSwf;
    }
    window.inWatch = true;
    var lastVer = localStorage ? localStorage.getItem('bundle') : null;
    lastVer = lastVer ? lastVer : '';
    setCurrent(lastVer ? lastVer.substring(1) : 'main');
    window.LoadSwf = function(swfUrl, flashvars){
        oldLoadSwf(swfUrl, flashvars);
        window.inWatch = false;
        setTimeout(function () {
            inject(version, lastVer);
        }, 300);
    };
}

function reload(withTime) {
    if (withTime && Date.now() - timestamp < 60000){
        console.error('Пропуск перезапуска, timeStampDelta < 60 сек.');
        return;
    }else{
        timestamp = Date.now();
    }
    var flashApp = document.getElementById('flash-app');
    flashApp.data = flashApp.data;
}

function setSession() {
    var lastVer = localStorage ? localStorage.getItem('bundle') : null;
    lastVer = lastVer == null ? '_noCheat' : lastVer;
    setCurrent(lastVer ? lastVer.substring(1) : 'main');
    newSession = prompt('Вставьте сохраненную сессию.');
    if (newSession == null) return;
    document.getElementById('flash-app').childNodes[1].value = newSession;
    inject(version, lastVer, true);
}