/**
 * Created by lenovo on 2017/1/6.
 */
(function (win, $) {
    /***************************************
     由于Chrome、IOS10等已不再支持非安全域的浏览器定位请求，为保证定位成功率和精度，请尽快升级您的站点到HTTPS。
     ***************************************/
    var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('container', {
        resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000         //超过10秒后停止定位，默认：无穷大
        });
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
    //解析定位结果
    function onComplete(data) {
        if (data.addressComponent.city) {
            document.getElementById('current_city').innerHTML = data.addressComponent.city;
        } else {
            document.getElementById('current_city').innerHTML = '城市';
        }
    }

    //解析定位错误信息
    function onError(data) {
        document.getElementById('current_city').innerHTML = '城市';
    }
})(window, jQuery);
