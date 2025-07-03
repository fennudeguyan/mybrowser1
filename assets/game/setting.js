window.jsSetting = '{"agent":"local","agentId":1000,"channelId":"4","serverId":1,"isOpenDebug":0,"isWechatShenheIOS":0,"showDebug":0,"centerServerHost":"http://192.168.1.251:9601","verFilePath":"","serverTabMaxNum":"100","gamePort":"8003","appResPath":"","gameVMODE":"FG","devUrl":""}';

//window.jsSetting = '{"agent":"local","agentId":1234,"gamePort":8611,"centerServerHost":"http://ywnet.viduan.com:9091/","verFilePath":"","serverTabMaxNum":"100","appResPath":"","gameVMODE":"FG","useNewModel":0,"devUrl":""}';
//window.jsSetting = '{"agent":"local","agentId":1234,"serverId":1,"centerServerHost":"http://192.168.1.201:9091/","verFilePath":"","serverTabMaxNum":"100","gamePort":"2091","appResPath":"","gameVMODE":"FG","devUrl":""}';
//����local
//window.jsSetting = '{"agent":"local","agentId":1000,"channelId":"4","serverId":1,"isOpenDebug":0,"isWechatShenheIOS":0,"showDebug":0,"centerServerHost":"http://192.168.1.251:9601","verFilePath":"","serverTabMaxNum":"100","gamePort":"8003","appResPath":"","gameVMODE":"FG","devUrl":""}';
//window.currServer= '{"serverindex":6,"opengId":"556"}';
//����
//window.jsSetting = '{"agent":"qn","agentId":1000,"channelId":"4","serverId":1,"centerServerHost":"http://192.168.1.251:9601","verFilePath":"","serverTabMaxNum":"100","gamePort":"6001","appResPath":"tanwan","gameVMODE":"FG","devUrl":""}';


function getHttpRequest(type, url, isAsyn, callBack,callProgress) {
    var xhr = null;
    if (window.XMLHttpRequest) {// code for IE7, Firefox, Opera, etc.
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {// code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.open(type, url, isAsyn);
    xhr.send(null);
    xhr.onload = function () {
        callBack(xhr.responseText);
    }
    // 处理进度事件
    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            var percentComplete = parseInt((event.loaded / event.total) * 100);
            callProgress(percentComplete)
            console.log('Progress: ' + percentComplete);
        } else {
            console.log('Progress: ' + 'unknown');
        }
    }
}


function onbodyclick(from) {
    var btn = window.document.getElementById("inputText");
    if (from == "index") {
        if (window.copyName && window.copyName != "" && !window.iscopy) {
            var div = window.document.getElementById("div1");
            div.innerHTML = "" + window.copyName;
            var o = window.getSelection();
            var i = window.document.createRange();
            i.selectNodeContents(div);
            o.removeAllRanges();
            o.addRange(i);
            window.iscopy = true;
        }
        if (window.openurl) {
            window.open(window.openurl, "_blank");
            window.openurl = null;
        }
    }

}