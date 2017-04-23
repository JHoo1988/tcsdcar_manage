layui.define(['jquery', 'layer'],function(exports){
    var jQuery = $ = layui.jquery;
    layer = layui.layer;
    var obj = {
        ajax: function (url, param, callback, errMsgOrCallBack) {

            if (typeof(param) === 'function') {
                callback = param;
                param = {};
            }

            var config = {
                url: url,
                dataType: 'json',
                data: param,
                type: 'POST',
                cache: false,
                timeout: 60 * 1000,//60 秒请求超时
                crossDomain: true,
                error: function (result) {
                    var alertText = "";

                    if (typeof errMsgOrCallBack == 'string') {
                        alertText = errMsgOrCallBack;
                    } else if (result.statusText == "timeout") {
                        alertText = "请求数据超时，请稍后重试!";
                    } else if (result.statusText == "error") {
                        alertText = "网络异常，请稍后重试!";
                    } else if (result.statusText == "Not Found") {
                        alertText = "404！接口未定义<br/>" + url;
                    } else {
                        alertText = result.statusText;
                    }

                    layer.msg(alertText, {time: 1500});
                    typeof errMsgOrCallBack == 'function' && errMsgOrCallBack.call(null)
                }
            };

            $.ajax(config).then(function (result) {
                return result;
            }).done(callback);
        },
        getJson : function (url, param, callback, errMsgOrCallBack) {

            if (typeof(param) === 'function') {
                callback = param;
                param = {};
            };

            var config = {
                url: url,
                dataType: 'json',
                data: param,
                type: 'GET',
                cache: false,
                timeout: 60 * 1000,//60 秒请求超时
                //xhrFields: {
                //    withCredentials: true
                //},
                crossDomain: true,
                error: function (result) {
                    var alertText = "";

                    if (typeof errMsgOrCallBack == 'string') {
                        alertText = errMsgOrCallBack;
                    } else if (result.statusText == "timeout") {
                        alertText = "请求数据超时，请稍后重试!";
                    } else if (result.statusText == "error") {
                        alertText = "网络异常，请稍后重试!";
                    } else if (result.statusText == "Not Found") {
                        alertText = "404！接口未定义<br/>" + url;
                    } else {
                        alertText = result.statusText;
                    }
                    alert(alertText);

                    typeof errMsgOrCallBack == 'function' && errMsgOrCallBack.call(null)
                }
            };

            $.ajax(config).then(function (result) {
                return result;
            }).done(callback);
        },
        postJson : function (url, param, callback, errMsgOrCallBack) {

            if (typeof(param) === 'function') {
                callback = param;
                param = {};
            }
            ;

            var config = {
                url: url,
                dataType: 'json',
                data: param,
                type: 'POST',
                cache: false,
                timeout: 60 * 1000,//60 秒请求超时
                //xhrFields: {
                //    withCredentials: true
                //},
                crossDomain: true,
                error: function (result) {
                    var alertText = "";

                    if (typeof errMsgOrCallBack == 'string') {
                        alertText = errMsgOrCallBack;
                    } else if (result.statusText == "timeout") {
                        alertText = "请求数据超时，请稍后重试!";
                    } else if (result.statusText == "error") {
                        alertText = "网络异常，请稍后重试!";
                    } else if (result.statusText == "Not Found") {
                        alertText = "404！接口未定义<br/>" + url;
                    } else {
                        alertText = result.statusText;
                    }
                    alert(alertText);

                    typeof errMsgOrCallBack == 'function' && errMsgOrCallBack.call(null)
                }
            };

            $.ajax(config).then(function (result) {
                return result;
            }).done(callback);
        },
    }
    exports('spike', obj)
});