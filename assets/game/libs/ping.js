﻿$.ping = function(option) 
{
    var ping, requestTime, responseTime ;
    var getUrl = function(url){    //保证url带http://
        var strReg="^((https|http)?://){1}"
        var re=new RegExp(strReg); 
        return re.test(url)?url:"http://"+url;
    }
    $.ajax({
        url: getUrl(option.url)+'/',//+ (new Date()).getTime() + '.html',  //设置一个空的ajax请求
        type: 'GET',
        dataType: 'html',
        timeout: 10000,
        beforeSend : function() 
        {
            if(option.beforePing) option.beforePing();
            requestTime = new Date().getTime();
        },
        complete : function() 
        {
            responseTime = new Date().getTime();
            ping = Math.abs(requestTime - responseTime);
            if(option.afterPing) option.afterPing(ping);
        }
    });
 
    if(option.interval && option.interval > 0)
    {
        var interval = option.interval * 1000;
        setTimeout(function(){$.ping(option)}, interval);
//        option.interval = 0;        // 阻止多重循环
//        setInterval(function(){$.ping(option)}, interval);
    }
};

$.openPay = function(url){
  window.open(url, "_blank"); 	
}

$.copyStr = function(copyName){
    var div = window.document.getElementById("div1");
    div.innerHTML = "" + copyName;
    var o = window.getSelection();
    var i = window.document.createRange();
    i.selectNodeContents(div);
    o.removeAllRanges();
    o.addRange(i);
    var flag = window.document.execCommand("copy");
}