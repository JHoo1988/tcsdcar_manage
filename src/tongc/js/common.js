layui.define(['jquery', 'layer', 'cookie', 'global'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        global = layui.global;
    var upmobui = {};
    upmobui.common = {
        pageFunc: function () {
            "use strict";
            var _this = this;
            /*
            * 根据窗口高度变化，隐藏和显示左侧导航栏的logo
            * */
            (function () {
                var diffH = $(window).height() - $('.layui-nav').height();
                if(diffH < 160){
                    $('.sf-logo').hide();
                }else{
                    $('.sf-logo').show();
                }
            })();

            /*
            * 监听窗口变化，判断左侧导航栏的logo是否显示
            * */
            $(window).resize(function () {
                var diffH = $(window).height() - $('.layui-nav').height();
                if(diffH < 160){
                    $('.sf-logo').hide();
                }else{
                    $('.sf-logo').show();
                }
            });

            /*
            * 点击左侧导航栏，iframe切换对应的页面
            * */
            $('.layui-nav-child').on('click', 'a', function () {
                $('.layui-nav-tree').find('dd').removeClass('layui-this');
                $(this).parents('.layui-nav-item').siblings().removeClass('layui-nav-itemed');
                $(this).parent().addClass('layui-this');
                $('#myIframe').attr('src', $(this).data('href'));
                $('#myIframe').load(function () {
                    setTimeout(function () {
                        $('#myIframe').height($('#myIframe').contents().find('body').height());
                    },0);
                });
            });

            /*
            * 点击左侧导航栏，iframe切换对应的页面
            * */
            $('.layui-nav-item').on('click', 'a', function () {
                $('.layui-nav-tree').find('dd').removeClass('layui-this');
                $(this).parents('.layui-nav-item').siblings().removeClass('layui-nav-itemed');
                $(this).addClass('layui-this');
                $('#myIframe').attr('src', $(this).data('href'));
                $('#myIframe').load(function () {
                    setTimeout(function () {
                        $('#myIframe').height($('#myIframe').contents().find('body').height());
                    },0);
                });
            });

            /*
            * 切换导航栏时， iframe加载的页面高度不同，可能会造成页面部分无法显示，因此需要重新设置iframe高度
            * */
            $('#myIframe').load(function () {
                setTimeout(function () {
                    $('#myIframe').height($('#myIframe').contents().find('body').height());
                },0);
            });

            /*
            * 点击主页面退出登录，返回到登录页面
            * */
            $('#user_quit').on('click', function () {
                layer.confirm('是否确定退出?', {
                    btn: ['是', '否']
                }, function () {
                    upmobui.common.userQuit();
                })
            });

            /*
            * iframe父级弹窗中对class带expleam-img的图片进行展示
            * */
            $(document).on('click', '.expleam-img', function () {
                var elem = $(this).parent('.track-img-list').find('img');
                var index = $(this).data('index');
                var dataArray = [];
                for(var i = 0; i < elem.length; i++){
                    var dataObj = {};
                    dataObj.src = elem.eq(i).attr('src');
                    dataArray[i] = dataObj;
                }
                var obj = {
                    "start": index, //初始显示的图片序号，默认0
                    "data": dataArray
                }
                parent.layer.photos({
                    photos: obj,
                    shift: 0
                    ,anim: 0 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                });
            });

        },

        //获取预警订单数量
        waitDealNums: function () {
            var _self = this;
            //监听订单预警
             _self.getOrderWran();
        },
        getOrderWran: function(){
            // var par = {};
            // par.token = $.cookie('userToken');
            // par.userId = $.cookie('userId');
            // $.post(global.url.waitDealNums, par, function (result) {
            //     if (result.flag == 'success') {
            //         var data = result.data;
            //         var waitDealNums = data.waitDealNums;
            //         if(waitDealNums > 0){
            //             $('.js-warnNum').show().html(waitDealNums);
            //         }else{
            //             $('.js-warnNum').hide();
            //         }
            //
            //     }else{
            //         layer.msg(result.msg, {time:1200});
            //     }
            // })
        },

        //初始化主页面数据， 可用余额、信用账户等信息
        initDataInPage: function () {
            //初始化数据 userMobile, companyName
            $('#user_mobile').html($.cookie('userMobile'));
            $('.company-name').html(decodeURIComponent($.cookie('companyName')));
            var userModel = decodeURIComponent($.cookie('userModel'));
            if(userModel=='0'){
                $('.salesman').css('display','block');
                $('.brand').css('display','block');
                $('.product').css('display','block');
                $('.carshop').css('display','block');
                $('.address').css('display','block');
                $('.product-category').css('display','block');
                $('.shican').css('display','block');
                $('.fours').css('display','block');
                // $('.category').css('display','block');
            }
            // (function () {
            //     var param = {};
            //     param.token = $.cookie('userToken');
            //     $.ajax({
            //         url: global.url.getUserWallet,
            //         type: 'post',
            //         dataType: 'json',
            //         data: param,
            //         async: 'false',
            //         success: function (result) {
            //             if (result.flag == 'success') {
            //                 var data = result.data;
            //                 if(data != null && data != undefined){
            //                     $.cookie('isOverdraft', data.isOverdraft);
            //                     if(data.isOverdraft == 1){
            //                         $('.user-ious').show();
            //                         $('#overdraftBalance').html(data.overdraftBalance);
            //                         $('#overdraftLimit').html(data.overdraftLimit);
            //                     }else{
            //                         $('.monthly-account').hide();
            //                     }
            //                     $('#wallet_balance').html(data.walletBalance);
            //                 }
            //             }
            //             else if(result.code == '510') {
            //                 layer.msg('登录已失效，请重新登录...',{time: 1200},function () {
            //                     // window.location.href = 'login.html?v131';
            //                 });
            //             }
            //         },
            //     });
            // })();
        },

        //iframe中涉及金额变动，子页面调用改方法来动态改变主页面中的金额
        findBalanceForParent: function () {
            // (function () {
            //     var param = {};
            //     param.token = $.cookie('userToken');
            //     $.ajax({
            //         url: global.url.getUserWallet,
            //         type: 'post',
            //         dataType: 'json',
            //         data: param,
            //         async: 'false',
            //         success: function (result) {
            //             if (result.flag == 'success') {
            //                 var data = result.data;
            //                 var isOverdraft = $.cookie('isOverdraft');
            //                 if(data != null && data != undefined){
            //                     if(isOverdraft == 1){
            //                         $('#overdraftBalance', parent.document).html(data.overdraftBalance);
            //                         $('#overdraftLimit', parent.document).html(data.overdraftLimit);
            //                     }else{
            //                         $('.user-ious').hide();
            //                     }
            //                 }
            //                 $('#wallet_balance', parent.document).html(data.walletBalance);
            //             }
            //             else if(result.code == '510') {
            //                 layer.msg('登录已失效，请重新登录...',{time: 1200},function () {
            //                     // window.parent.location.href = 'login.html';
            //                 });
            //             }
            //         },
            //     });
            // })();
        },

        //用户退出登录
        userQuit: function () {
            var _self = this;
            var param = {}
            param.token = $.cookie('userToken');
            if(param.token == null){
                window.location.href = 'login.html?v131';
            }
            $.ajax({
                url: global.url.userQuit+$.cookie('userToken'),
                type: 'GET',
                dataType: 'json',
                // data: param,
                async: 'false',
                success: function (result) {
                    if (result.code == 200) {
                        $.cookie('userMobile', null);
                        $.cookie('userId', null);
                        $.cookie('userToken', null);
                        $.cookie('companyName', null);
                        window.location.href = 'login.html?v131';
                    }else{
                        layer.msg('退出失败，请稍后重试！');
                    }
                },
                error: function () {
                    layer.msg('退出失败，请稍后重试！')
                }
            });
        },
        bindEvent: function(){

        }
    };
    exports('upmobui', upmobui);
})

