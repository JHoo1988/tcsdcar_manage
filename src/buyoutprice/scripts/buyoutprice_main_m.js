/**
 * Created by 焦红 on 2016/12/29.
 */
(function (win, $) {

    //显示更多价格信息
    $('.show_more').on('click', function () {
        $('.price_table').css('height', 'auto');
        $(this).hide();
        $('.close_more').show();
    });
    //隐藏更多价格信息
    $('.close_more').on('click', function () {
        $('.price_table').css('height', '16rem');
        $(this).hide();
        $('.show_more').show();
    });
    //关闭客服图标
    $('.close_chat').on('click', function () {
        $('.customerservice').css('display', 'none');
    });

    // 通过IP地址定位城市名称
    // var getCityByIP= function (successCallback){
    //     $.ajax({
    //         type: 'GET',
    //         url: 'http://restapi.amap.com/v3/ip?output=json&key=17eb7d180404c4a067d213db1a5d9b28',
    //         dataType: 'JSON',
    //         success : function(res){
    //             if(res==undefined||res=='undefined' || res=='' || res==null){
    //                 return '';
    //             }
    //             if(res.city==undefined||res.city=='undefined' || res.city=='' || res.city==null){
    //                 return '';
    //             }
    //             if (typeof successCallback === "function") {
    //                 successCallback(res.city);
    //             }
    //
    //         },
    //         error: function (xhr) {
    //             console.log(xhr);
    //             return '';
    //         }
    //     });
    // };
    // getCityByIP(function(cityName){
    //   console.log(cityName);
    //     document.getElementById('current_city').innerHTML = cityName;
    // });

})(window, jQuery);