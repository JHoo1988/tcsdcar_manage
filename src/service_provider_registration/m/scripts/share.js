;
/* global reqwest:true */
/* global wx:true */
/* global pageResponse:true */
(function () {
    "use strict";

    var haUrl = window.haUrl;
    var haServiceUrl = haUrl.base;
    var config = {
        app: {
            appId: 'wxefe2041fd6eb765f'
        },
        url: {
            getWechatTicket: haServiceUrl + 'wechatOAuth2/getWechatTicket'
        }
    };

    var share = {
        "userName": '',
        "promoUserHeadImage": window.location.href.split('index')[0] + 'images/banner.jpg',
        "currentUrl": window.location.href.split('#')[0],
        "init": function () {
            this.loadWxConfig();
        },

        // 配置
        "loadWxConfig": function () {
            // 获取签名
            this.getSignature(function (result) {
                if (result.flag === 'success' && 'data' in result) {

                    if (typeof result.data === 'object') {
                        this.wxConfig(result.data);
                        this.wxReady();
                        this.wxError();
                    }

                }
            }.bind(this));
        },

        // 获取签名
        "getSignature": function (callback) {
            $.ajax({
                type: 'POST',
                url: config.url.getWechatTicket,
                data: {
                    param: JSON.stringify({currentUrl: this.currentUrl})
                },
                dataType: 'JSON',
                success: function (result) {
                    if (result) {
                        callback(result);
                    }
                }
            });
        },

        // 接口注入权限验证配置
        "wxConfig": function (data) {
            wx.config({
                debug: false,
                appId: config.app.appId,
                timestamp: data.timestamp, // 生成签名的时间戳
                nonceStr: data.nonceStr, // 生成签名的随机串
                signature: data.signature, // 签名
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ]
            });
        },

        // 处理成功验证
        "wxReady": function () {
            wx.ready(function () {

                var title = '携手十分到家，火爆财富赚回家！',
                    link = this.currentUrl,
                    imgUrl = this.promoUserHeadImage,
                    desc = '十分到家火热全国招募服务商！全网接单，轻松创业 零门槛，低投入，不收加盟费！',
                    shareTimeline = {
                        title: title,
                        link: link,
                        imgUrl: imgUrl
                    },
                    shareOther = {
                        title: title,
                        desc: desc,
                        link: link,
                        imgUrl: imgUrl
                    };

                // 分享到朋友圈
                wx.onMenuShareTimeline(shareTimeline);

                // 分享给朋友
                wx.onMenuShareAppMessage(shareOther);

                // 分享到QQ
                wx.onMenuShareQQ(shareOther);

                // 分享到微博
                wx.onMenuShareWeibo(shareOther);

                // 分享到QZone
                wx.onMenuShareQZone(shareOther);

            }.bind(this));
        },

        "wxError": function () {
            // 处理失败验证
            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
        }
    };

    share.init();

}());