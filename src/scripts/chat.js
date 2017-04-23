/**
 * Created by Ryan on 2016/10/12.
 */
(function ($) {
    var url = 'http://125.93.53.91:31337/app/chat.html?appname=tenant_sfdj';

    if (typeof global_chat_menukey !== "undefined") {
        url += '&menukey=' + global_chat_menukey;
    }

    if (typeof global_website !== "undefined" && global_website === 'www.shifendaojia.com') {
        url = 'http://125.93.53.91:31337/app/chat.html?appname=tenant_APPshifen'; // home
    }

    var chatImg = __uri('../images/chat.png');
    var style = 'position:fixed;z-index: 9999; top: 45%; left: 5px;width: 144px;height: 217px;_display: none;';
    var html = '<div class="sfdj-chat-m" style="' + style + '"><a href="' + url + '" target="_blank"><img src="' + chatImg + '" alt=""/></a></div>';
    $('body').prepend(html);
}(jQuery));