/**
 * Created by 焦红 on 2017/3/7.
 * tel:18971057583
 */
layui.use(['form', 'layer', 'global'], function () {
    var $ = layui.jquery, layer = layui.layer,
        global = layui.global;
    var openId;
    function hideLoadin() {
        $('#loadingToast').css('display', 'none');
    }

    function showLoadin(content) {
        $('#loadingToast').css('display', 'block');
        if (content) {
            $('.weui_toast_content').text(content);
        }
    }

    function showContent() {
        $('.sh').css('display', 'block');
    }

    function isEmpty(value) {
        if (value === '' || !value) {
            return true;
        }
        return /^\s+$/.test(value);
    }

    // 是否为手机号码
    function isMobile(value) {
        return /^1[34578]\d{9}$/.test(value);
    }

    // 判断是否在微信中打开的
    function isWeChat() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    /**
     * emoji表情转换为字符
     * @param {string} str emoji表情
     */
    function emoji2Str(str) {
        return unescape(escape(str).replace(/\%uD(.{3})/g, '*'));
    }

    $(document).on('click', '.closedialog', function () {
        layer.closeAll();
    });

    // var codeNameHash = location.hash;
    // if (codeNameHash) {
    //     var codeName = codeNameHash.substring(1);
    //     var cn = codeName.split(',');
    //     var shopCode = cn[0];
    //     var shopName = cn[1];
    //     var sc = shopCode.split('=')[1];//店铺编码
    //     var sn = shopName.split('=')[1];//店铺名称
    //     if (sn) {
    //         $('header h1').text(sn);
    //     }
    // }

    function closedialog() {
        layer.closeAll();
    }

    var tablevue = new Vue({
        el: '.content',
        data: {
            types: [],
            show: false,
            error: true,
            logdin: '',
            price: '0',
            pricetype: 3,
            price1: 0,
            price2: 0,
            price3: 0,
            productId: ''
        },
        methods: {
            checkedon: function (ex) {
                for (var k = 0; k < this.types.length; k++) {
                    var t = this.types[k].lines;
                    for (var i = 0; i < t.length; i++) {
                        var items = t[i];
                        for (var j = 0; j < items.length; j++) {
                            var item = items[j];
                            if (item.id == ex) {
                                item.isActive = true;
                                tablevue.price1 = item.twelveCyclePrice;
                                tablevue.price2 = item.twentyFourCyclePrice;
                                tablevue.price3 = item.thirtySixCyclePrice;
                                tablevue.productId = item.id;
                                switch (tablevue.pricetype) {
                                    case 1:
                                        tablevue.price = tablevue.price1;
                                        break;
                                    case 2:
                                        tablevue.price = tablevue.price2;
                                        break;
                                    case 3:
                                        tablevue.price = tablevue.price3;
                                        break;
                                }

                            } else {
                                item.isActive = false
                            }
                        }
                    }
                }
            },
            getData: function () {
                // var par = {};
                // par.pageIndex = 1;

                // par.pagesize = 999;
                $.ajax({
                    url: global.url.mfindProductList,
                    type: 'GET',
                    dataType: 'json',
                    // data: par,
                    success: function (data) {
                        showContent();
                        hideLoadin();
                        if (undefined != data.data && null != data.data && data.code == 200) {
                            var typeList = data.data;
                            var typeLen = typeList.length;
                            if (typeLen > 0) {
                                tablevue.show = true;
                                tablevue.error = false;
                                for (var k = 0; k < typeLen; k++) {
                                    var typeName = typeList[k].attributionName;
                                    var dataList = typeList[k].content.content;
                                    var len = typeList[k].content.totalSize;
                                    if (len > 0) {
                                        var lines = new Array();
                                        var carlines = new Array();
                                        for (var i = 0; i < len; i++) {
                                            var productName = dataList[i].productName;
                                            var id = dataList[i].id;
                                            var imageUrl = dataList[i].imageUrl;
                                            var twelveCyclePrice = dataList[i].twelveCyclePrice;
                                            var twentyFourCyclePrice = dataList[i].twentyFourCyclePrice;
                                            var thirtySixCyclePrice = dataList[i].thirtySixCyclePrice;
                                            carlines.push({
                                                isActive: false,
                                                productName: productName,
                                                imageUrl: imageUrl,
                                                id: id,
                                                twelveCyclePrice: twelveCyclePrice,
                                                twentyFourCyclePrice: twentyFourCyclePrice,
                                                thirtySixCyclePrice: thirtySixCyclePrice
                                            });
                                            if (carlines.length > 1 && carlines.length % 3 == 0) {
                                                lines.push(carlines);
                                                carlines = new Array();
                                            }

                                        }
                                        if (carlines.length > 0) {
                                            lines.push(carlines);
                                            carlines = new Array();
                                        }
                                        tablevue.types.push({ typename: typeName, lines: lines });
                                    }
                                }
                            }
                        } else {
                            layer.msg("服务器异常", { time: 500 });
                        }
                    }
                    , error: function (e) {
                        hideLoadin();
                        // layer.msg('获取数据失败，请稍后重试！', { time: 500 });
                        tablevue.logdin = '获取数据失败，请稍后重试！'
                    }
                })
            },
            selectPrice: function (selectedid) {
                tablevue.pricetype = selectedid;
                switch (tablevue.pricetype) {
                    case 1:
                        tablevue.price = tablevue.price1;
                        break;
                    case 2:
                        tablevue.price = tablevue.price2;
                        break;
                    case 3:
                        tablevue.price = tablevue.price3;
                        break;
                }
            },
            // 根据code获取openid
            getOpenIdByCode:function (code) {
                $.ajax({
                    url: global.url.getWeiXinOpenIdByCode+code,
                    type: 'GET',
                    dataType: 'json',
                    // data: par,
                    success: function (data) {
                        hideLoadin();
                        if (undefined != data && null != data && data.code == 200) {
                            layer.msg('openid='+data.data, { time: 1500 });
                        } else {
                            layer.msg('openid获取失败', { time: 1200 });
                        }
                    }
                    // ,error: function (xhr) {
                    //             // 获取openId失败则重进一次页面
                    //             url = tablevue.getClearCodeUrl();
                    //             authUrl = tablevue.handleUrlToWxOauth(url, 'base');
                    //             console.log('555', authUrl);
                    //             window.location.href = authUrl;
                    //             return false;
                    // }
                });
            },
            /**
             * @func
             * @desc 获取微信用户openid
             * @param  {function} callback - 回调方法
             */
            getWechatUserOpenId: function (callback) {
                //仅获取新公众号的openId
                var self = this;
                var code = this.getParam('code');
                var authUrl;
                var url;
                if (code) {
                    console.log(544, window.location.href);
                    console.log('getWechatUserOpenId()-code='+code);
                    // self.getOpenIdByCode(code);

                    $.ajax({
                        url: global.url.getWeiXinOpenIdByCode+code,
                        type: 'GET',
                        dataType: 'json',
                        // data: par,
                        success: function (data) {
                            hideLoadin();
                            if (undefined != data && null != data && data.code == 200) {
                                openId = data.data;
                                console.log('getWechatUserOpenId()-openId='+openId);
                                callback();
                            } else {
                                layer.msg('openid获取失败', { time: 1200 });
                            }
                        }
                        // ,error: function (xhr) {
                        //             // 获取openId失败则重进一次页面
                        //             url = tablevue.getClearCodeUrl();
                        //             authUrl = tablevue.handleUrlToWxOauth(url, 'base');
                        //             console.log('555', authUrl);
                        //             window.location.href = authUrl;
                        //             return false;
                        // }
                    });

                    // jea.jsonp(config.wechat.getNewWechatOpenId, {
                    //     wechatCode: code
                    // }, function (result) {
                    //     console.log(JSON.stringify(result));
                    //     var openId = result.data.openid;
                    //     if (!!openId) {
                    //         callback(openId);
                    //     } else {
                    //         // 获取openId失败则重进一次页面
                    //         url = tablevue.getClearCodeUrl();
                    //         authUrl = tablevue.handleUrlToWxOauth(url, 'base');
                    //         console.log('555', authUrl);
                    //         window.location.href = authUrl;
                    //         return false;
                    //     }
                    // });
                } else {
                    url = self.getClearCodeUrl();
                    authUrl = self.handleUrlToWxOauth(url, 'base');
                    console.log('563', authUrl);
                    window.location.href = authUrl;
                }
            },
            // 发起微信支付
            wxPayOrderById: function (orderCode, wechatOpenId, callback, fail, fn, orderType) {
                var param = { orderCode: orderCode, payWay: 0, openId: wechatOpenId };
                if (orderType != null) {
                    param.orderType = orderType;
                }
                // var url = 'http://third.5ujd.net:88/ha-thirdpart/v1/tbase/online/wechat/pay';
                // jea.post(url, param, function (result) {
                //     hideLoadin();
                //     if (result) {
                //         var payConfig = result.data;
                //         wx.chooseWXPay({
                //             appId: payConfig.appId, // 必填，公众号的唯一标识
                //             timestamp: payConfig.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                //             nonceStr: payConfig.nonceStr, // 支付签名随机串，不长于 32 位
                //             package: payConfig.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                //             signType: payConfig.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                //             paySign: payConfig.paySign, // 支付签名
                //             success: function (res) {
                //                 if (typeof callback === 'function') {
                //                     callback();
                //                 }
                //             },
                //             fail: function (res) {
                //                 if (typeof fail === 'function') {
                //                     fail();
                //                 }
                //             }
                //         });
                //     }
                // });
            },
            /**
             * @func
             * @desc 微信支付
             * @param {string} orderNo 订单号
             * @param {string} wechatOpenId
             * @param {string} successBackUrl 支付成功跳转地址
             */
            weChatPay: function (orderNo, wechatOpenId, successBackUrl) {
                var orderType = 1;
                tablevue.wxPayOrderById(orderNo, wechatOpenId, function () {
                    layer.msg('支付成功', { time: 1500 });
                    window.location.href = successBackUrl;
                }, function () {
                    layer.msg('支付失败', { time: 1500 });
                }, function () {
                    // 支付信息接口请求成功之后
                    // apiWechat.processOrderPayType(orderNo, 1);
                }, orderType);
            },
            handleUrlToWxOauth: function (url, type) {
                var url = encodeURIComponent(url);
                var wxOauth2 = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=1#wechat_redirect";
                wxOauth2 = wxOauth2.replace("APPID", "wx6d8daf3b1d3821cc");
                wxOauth2 = wxOauth2.replace("REDIRECT_URI", url);
                if (type == null || type == 'base') {
                    //默认静默授权
                    wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_base");
                } else if (type == 'userinfo') {
                    //弹出授权页面
                    wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_userinfo");
                } else {
                    wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_base");
                }
                console.log('handleUrlToWxOauth()-wxOauth2='+wxOauth2);
                return wxOauth2;
            },
            getParam: function (param) {
                var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },
            getClearCodeUrl: function () {
                var url = window.location.href;
                var code = this.getParam('code');
                if (code) {
                    url = url.replace('code=' + code, '');
                }
                return url;
            },
            payment: function () {
                if (isWeChat()) {
                    // 使用微信支付


                    layer.msg('微信中打开', { time: 1500 });
                    var b_version = navigator.appVersion;
                    var version = parseFloat(b_version);
                    if (version >= 5.0) {
                        tablevue.weChatPay();
                    } else {
                        layer.msg('微信版本过低，请升级您的微信客户端', { time: 2000 });
                    }
                } else {
                    // 使用支付宝支付
                    layer.msg('手机浏览器打开', { time: 1500 });
                }
                return
                // var type = this.data('type');
                if (tablevue.price == 0) {
                    layer.msg('请选择产品', { time: 1500 });
                    return;
                }
                layer.open({
                    type: 1
                    , title: false
                    , closeBtn: false
                    // ,offset: 'auto' //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                    ,
                    id: 'LAY_demo' //防止重复弹出
                    ,
                    content: '<div id="get-value"><div class="order-tips-title" style="cursor: move;"><p class="title">登记车辆信息</p><button class="closedialog"> X </button></div><p class="description">为了给您提供更完善更优质的服务，请您务必填写以下信息。</p><form class="form_sub"><div> <p> 手机号码： </p> <input class="ipt" id="phoneNum" type="tel" placeholder="请输入手机号码" autocomplete="off" name="phoneNum" maxlength="11"/></div><div class="car-num"> <p> 车辆编号： </p> <input class="ipt" id="carNum" type="text" placeholder="请输入车辆编号" autocomplete="off" name="carNum"/></div></form></div>',
                    btn: '确定'
                    ,
                    shadeClose: true
                    ,
                    area: ['80%', '55%']
                    ,
                    btnAlign: 'c' //按钮居中
                    ,
                    shade: 0.5 //不显示遮罩
                    ,
                    yes: function () {
                        // var areaname = $('.layui-layer-content [name=areaName]').val();
                        // if (!areaname) {
                        //     layer.msg('区/县名称不能为空！', { time: 1200 });
                        //     return false;
                        // }
                        var par = {};
                        var phonen = $("#phoneNum").val();
                        if (isEmpty(phonen)) {
                            layer.msg('请填写手机号码', { time: 1200 });
                            return false;
                        } else if (!isMobile(phonen)) {
                            layer.msg('请填写正确的手机号码', { time: 1200 });
                            return false;
                        }
                        par.mobile = phonen;
                        var carn = $("#carNum").val();
                        if (isEmpty(carn)) {
                            layer.msg('请填写车辆编码', { time: 1200 });
                            return false;
                        }
                        par.carBodyNo = carn;
                        par.totalAmount = tablevue.price;
                        par.shop = sc;
                        par.statu = 1;
                        switch (tablevue.pricetype) {
                            case 1:
                                par.timeLimit = 12;
                                break;
                            case 2:
                                par.timeLimit = 24;
                                break;
                            case 3:
                                par.timeLimit = 36;
                                break;
                        }
                        par.token = 'sfdj-d18c1bea67944579b1bba2c888daedc1';
                        par.product = tablevue.productId;
                        layer.closeAll();
                        showLoadin('等待支付');
                        tablevue.submit(par);
                    }
                });
            },
            submit: function (par) {
                $.ajax({
                    url: global.url.addOrder,
                    type: 'POST',
                    dataType: 'json',
                    data: par,
                    success: function (data) {
                        hideLoadin();
                        if (undefined != data && null != data && data.code == 200) {
                            layer.msg('恭喜你，下单成功！', { time: 1500 });
                        } else {
                            layer.msg('下单失败', { time: 1200 });
                        }
                    }
                });
            }
        }
    });
    // 店铺编码
    var shopCode = tablevue.getParam('shopCode');
    console.log('shopCode:'+shopCode);
    if (isWeChat()) {
        tablevue.getWechatUserOpenId(function () {
            tablevue.getData();
        });
    } else {
        tablevue.getData();
    }

});

$(function () {
    $(':input').labelauty();
});


