/**
 * Created by Ryan on 2016/10/12.
 */
(function ($) {
    var url = 'http://125.93.53.91:31337/app/chat.html?appname=tenant_sfdj';

    //if (typeof global_website !== "undefined" && global_website === 'www.shifendaojia.com') {
    //    url = 'http://125.93.53.91:31337/app/chat.html?appname=tenant_APPshifen'; // home
    //}

    if (typeof global_chat_menukey !== "undefined") {
        url += '&menukey=' + global_chat_menukey;
    }

    var chatImg = __uri('../images/chat.png');
    var style = 'position:fixed;z-index: 9999; top: 45%; left: 5px;width: 48px;height:72px;_display: none;';
    var html = '<div style="' + style + '"><a href="' + url + '" target="_blank"><img width="48" height="72" src="' + chatImg + '" alt=""/></a></div>';
    $('body').prepend(html);
}(jQuery));