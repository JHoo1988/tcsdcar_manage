/**
 * Created by Ryan on 2016/9/22.
 */
(function (win) {
    var baseUrl = 'http://wechat.shifendaojia.com:88/ha-wechat/v1/';
    // var baseUrl = 'http://120.76.101.218:89/ha-wechat/v1/';
    //var baseUrl = 'http://10.120.220.42:8088/ha-wechat/v1/';
    win.haUrl = {
        base: baseUrl,
        address: {
            province: baseUrl + 'repair/site/findAllSiteProvince',
            city: baseUrl + 'repair/site/findSiteCityByProvince',
            area: baseUrl + 'region/findAreaByCityId'
        }
    };
}(window));
