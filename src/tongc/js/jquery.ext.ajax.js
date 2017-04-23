/**
 * Ajax跨域请求封装
 * @param url
 * @param param
 * @param callback
 */
define(['jquery'], function ($) {
    return {
        ajax: function (url, param, callback, errMsgOrCallBack) {

            if (typeof(param) === 'function') {
                callback = param;
                param = {};
            }

            var config = {
                url: url,
                dataType: 'json',
                data: {
                    param: JSON.stringify(param)
                },
                type: 'POST',
                cache: false,
                timeout: 60 * 1000,//60 秒请求超时
                xhrFields: {
                    withCredentials: true
                },
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

                    $.hideLoading();
                    $.alert(alertText);
                    typeof errMsgOrCallBack == 'function' && errMsgOrCallBack.call(null)
                }
            };

            $.ajax(config).then(function (result) {
                if (result.flag == 'fail') {
                    $.hideLoading();
                    $.alert(result.msg);
                    return false;
                }
                return result;
            }).done(callback);
        },
        get: function (url, param, callback, errMsgOrCallBack) {

            if (typeof(param) === 'function') {
                callback = param;
                param = {};
            }

            var config = {
                url: url,
                dataType: 'json',
                data: param,
                type: 'GET',
                cache: true,
                timeout: 60 * 1000,//60 秒请求超时
                //xhrFields : {
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

                    $.hideLoading();
                    $.alert(alertText);
                    typeof errMsgOrCallBack == 'function' && errMsgOrCallBack.call(null)
                }
            };

            $.ajax(config).then(function (result) {
                if (result.flag == 'fail') {
                    $.hideLoading();
                    $.alert(result.msg);
                }
                return result;
            }).done(callback);
        },
        post: function (url, param, callback, errMsgOrCallBack) {

            if (typeof(param) === 'function') {
                callback = param;
                param = {};
            }

            var config = {
                url: url,
                dataType: 'json',
                data: param,
                type: 'POST',
                cache: true,
                timeout: 60 * 1000,//60 秒请求超时
                //xhrFields : {
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
                    $.hideLoading();
                    $.alert(alertText);
                    typeof errMsgOrCallBack == 'function' && errMsgOrCallBack.call(null)
                }
            };

            $.ajax(config).then(function (result) {
                if (result.flag == 'fail') {
                    $.hideLoading();
                    $.alert(result.msg);
                    return false;
                }
                return result;
            }).done(callback);
        },
        jsonp: function (url, data, callback) {
            $.ajax({
                async: false,
                url: url,
                data: {
                    param: JSON.stringify(data)
                },
                dataType: "jsonp",
                success: callback,
                error: function () {
                    $.hideLoading();
                    $.alert('服务器繁忙，请稍后重试！');
                }
            });
        }
    };
});