/**
 * Created by Administrator on 2016/8/24.
 */
(function(win,$){

    $.support.cors = true;
    var DEFAULT_VERSION = "8.0";
    var ua = navigator.userAgent.toLowerCase();
    var isIE = ua.indexOf("msie")>-1;
    var safariVersion;
    var isOldIE = false;
    if(isIE){
        safariVersion =  ua.match(/msie ([\d.]+)/)[1];
        if(safariVersion <= DEFAULT_VERSION ){
            isOldIE = true;
            $('input, textarea').placeholder();
        }
    }

    $(".product_items ul li,.connect").mouseover(function(){
        $(this).css("background-color","#F3F4F8");
        $(this).css("cursor","pointer");
    });
    $(".product_items ul li,.connect").mouseout(function(){
        $(this).css("background-color","#FFFFFF");
        $(this).css("cursor","default");
    });
    $(".product_items ul li:first").addClass("seleced_item");
    var bookingNote = '空调挂机';
    $(".product_items ul li").on('click',function(){
        $(".product_items ul li").removeClass("seleced_item");
        $(this).addClass("seleced_item");
       switch ($(this).index()){
           case 0:
               changeProductInfo(4,"images/wash/product/sj_yyj.png","油烟机",108,148,">60");
               break;
           case 1:
               changeProductInfo(5,"images/wash/product/sj_yyj.png","油烟机拆洗",148,198,">60");
               break;
           case 2:
               changeProductInfo(0,"images/wash/product/ktgj.png","空调挂机",75,88,"45");
               break;
           case 3:
               changeProductInfo(1,"images/wash/product/ktguij.png","空调柜机",128,138,"60");
               break;
           case 4:
               changeProductInfo(2,"images/wash/product/ptbx.png","普通冰箱",108,138,">60");
               break;
           case 5:
               changeProductInfo(3,"images/wash/product/dmbx.png","对开门冰箱",138,168,">60");
               break;
           case 6:
               changeProductInfo(6,"images/wash/product/rsq.png","热水器",78,88,"45");
               break;
           case 7:
               changeProductInfo(7,"images/wash/product/blxyj.png","波轮洗衣机",78,88,"45");
               break;
           case 8:
               changeProductInfo(8,"images/wash/product/blxyj.png","波轮洗衣机拆洗",108,128,">60");
               break;
           case 9:
               changeProductInfo(9,"images/wash/product/gtxyj.png","滚筒洗衣机",88,98,"45");
               break;
           case 10:
               changeProductInfo(10,"images/wash/product/zykt.png","家用中央空调",85,98,"45");
               break;
           case 11:
               changeProductInfo(11,"images/wash/product/thj.png","天花机",138,168,">60");
               break;
           case 12:
               changeProductInfo(12,"images/wash/product/xdg.png","消毒柜",88,98,"45");
               break;
           case 13:
               changeProductInfo(13,"images/wash/product/wbl.png","微波炉",58,68,"60");
               break;
           case 14:
               changeProductInfo(14,"images/wash/product/rqz.png","灶台",48,58,"60");
               break;
           case 15:
               changeProductInfo(15,"images/wash/product/bgl.png","壁挂炉",88,118,"60");
               break;
           case 16:
               changeProductInfo(16,"images/wash/product/ztcf.png","整体厨房",198,358,">60");
               break;
           case 17:
               changeProductInfo(17,"images/wash/product/dn.png","地暖",30,50,">60");
               break;
       }
    });

    function changeProductInfo(index,imgsrc,productName,price1,price2,time){
        $(".product_detail .product_detail_content .product_detail_img").attr("src",imgsrc);
        $(".product_detail .product_detail_content .product_detail_des .product_detail_content_title").text(productName);
        if(index==10){
            $(".product_detail .product_detail_content .product_detail_des .yyjg .yyjg_v").text("￥"+price1+"/风口");
        }else if(index==16){
            $(".product_detail .product_detail_content .product_detail_des .yyjg .yyjg_v").text("￥"+price1+"/套");
        }else if(index==17){
            $(".product_detail .product_detail_content .product_detail_des .yyjg .yyjg_v").text("￥"+price1+"/管");
        }else{
            $(".product_detail .product_detail_content .product_detail_des .yyjg .yyjg_v").text("￥"+price1+"/台");
        }
        $(".product_detail .product_detail_content .product_detail_des .yj .yj_v").text("￥"+price2);
        $(".product_detail .product_detail_content .product_detail_des .fwsj .fwsj_v").text(time+"分钟");
        bookingNote=productName;

        switch (index){
            case 0:
            case 1:
            case 10:
            case 11:
            case 17:
                $("#clean_before").attr("src","images/wash/constrast/air_conditioner1.png");
                $("#clean_after").attr("src","images/wash/constrast/air_conditioner2.png");
                break;
            case 2:
            case 3:
                $("#clean_before").attr("src","images/wash/constrast/bx1.png");
                $("#clean_after").attr("src","images/wash/constrast/bx2.png");
                break;
            case 4:
            case 5:
                $("#clean_before").attr("src","images/wash/constrast/yyj1.png");
                $("#clean_after").attr("src","images/wash/constrast/yyj2.png");
                break;
            case 6:
            case 15:
                $("#clean_before").attr("src","images/wash/constrast/rsq1.png");
                $("#clean_after").attr("src","images/wash/constrast/rsq2.png");
                break;
            case 7:
            case 8:
            case 9:
                $("#clean_before").attr("src","images/wash/constrast/xyj1.png");
                $("#clean_after").attr("src","images/wash/constrast/xyj2.png");
                break;
            case 12:
                $("#clean_before").attr("src","images/wash/constrast/xdg1.png");
                $("#clean_after").attr("src","images/wash/constrast/xdg2.png");
                break;
            case 13:
                $("#clean_before").attr("src","images/wash/constrast/wbl1.png");
                $("#clean_after").attr("src","images/wash/constrast/wbl2.png");
                break;
            case 14:
            case 16:
                $("#clean_before").attr("src","images/wash/constrast/rqz1.png");
                $("#clean_after").attr("src","images/wash/constrast/rqz2.png");
                break;

        }
    }

    /*预约表单*/
    function ReserveForm(){
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        this.form = $('.zxyy');
        this.formAction = haServiceUrl + 'userBooking/addBookingInfo';
        this.codeUrl = haServiceUrl + 'mms/sendMsg';
        this.timeCountDown = 60;

    }
    ReserveForm.prototype = {
        init : function(){
            this.initForm();
            this.bind();
            this.vcodeInit();
        },
        initForm : function(){
            var $form = this.form;
            $form.find('[name="name"]').val('');
            $form.find('[name="phoneNumber"]').val('');
            $form.find('[name="verCode"]').val('');
            $form.find('[name="faultDesc"]').val('');
            $form.find('.sui-check-box .check-item').removeClass('checked');
        },
        bind : function(){
            var $form = this.form;
            var _self = this;
            $form.find('.btn-submit').on('click',function(){
                if(_self.verify()){
                    _self.submit();
                }
            });
            $form.find('.sui-check-box .check-item').on('click',function(){
                $(this).toggleClass('checked');
            });
        },
        vcodeInit : function(){
            var _self = this;
            var $form = this.form;
            var codeLoading = false;
            $form.find('.js-get-vcode').on('click',function(){
                var $btn = $(this);
                if(codeLoading){
                    return false;
                }
                var phoneNum = $form.find('[name="phoneNumber"]').val();
                if(!UtilBase.isMobile(phoneNum)){
                    layer.tips('请输入正确的手机号', '.zxyy [name="phoneNumber"]', {
                        tips: [1, '#f00']
                    });
                    return false;
                }else{
                    var url = _self.codeUrl;
                    var param = {};
                    param.mobile = phoneNum;
                    codeLoading = true;
                    param = {
                        param : JSON.stringify(param)
                    }
                    $btn.html('发送中...');
                    clearInterval(_self.timerTicket);
                    $btn.addClass('disabled');
                    _self.timerTicket = setInterval(function(){
                        if(_self.timeCountDown <= 0){
                            clearInterval(_self.timerTicket);
                            _self.timeCountDown = 60;
                            codeLoading = false;
                            $btn.html('获取验证码');
                            $btn.removeClass('disabled');
                            return false;
                        }
                        $btn.html('获取验证码[' + _self.timeCountDown + ']');
                        _self.timeCountDown--;
                    },1000);


                    $.ajax({
                        type: 'POST',
                        crossdomain : true,
                        url: url,
                        data: param,
                        dataType: 'JSON',
                        success : function(res){
                            if(res.flag != 'success'){
                                layer.alert('短信发送失败', 9);
                                clearInterval(_self.timerTicket);
                                _self.timeCountDown = 60;
                                codeLoading = false;
                                $btn.html('获取验证码');
                                $btn.removeClass('disabled');
                            }
                        },
                        error: function (xhr) {
                            console.log(JSON.stringify(xhr));
                            layer.alert('短信发送失败', 9);
                            clearInterval(_self.timerTicket);
                            _self.timeCountDown = 60;
                            codeLoading = false;
                            $btn.html('获取验证码');
                            $btn.removeClass('disabled');
                        }
                    });

                }
            });
        },
        verify : function(){
            var $form = this.form;
            var userAppellation = $form.find('[name="name"]').val();
            if(UtilBase.isEmpty(userAppellation)){
                layer.tips('请输入姓名', '.zxyy [name="name"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            if(!UtilBase.isMobile(phoneNum)){
                layer.tips('请输入正确的手机号', '.zxyy [name="phoneNumber"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var code = $form.find('[name="verCode"]').val();
            if(UtilBase.isEmpty(code)){
                layer.tips('请输入验证码', '.zxyy [name="verCode"]', {
                    tips: [1, '#f00']
                });
                return false;
            }


            return true;

        },
        submit : function(){
            var _self = this;
            var $form = this.form;

            var userAppellation = $form.find('[name="name"]').val();
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            var code = $form.find('[name="verCode"]').val();
            var bookingDesc = $form.find('[name="bookingDesc"]').val();

            var url = _self.formAction;
            var param = {
                userAppellation : userAppellation,
                phoneNum : phoneNum,
                code : code,
                bookingNote : bookingNote,
                bookingDesc : "家电清洗",
                sourceType : 1
            };

            $.ajax({
                type: 'POST',
                url: url,
                data: param,
                dataType: 'JSON',
                success : function(res){
                    if(res.flag != 'success'){
                        layer.alert(res.msg, 9);
                    }else{
                        layer.alert('预约成功，客服稍后将会与您取得联系', 9);
                        _self.initForm();
                    }
                },
                error: function (xhr) {
                    layer.alert('发送请求失败', 9);

                }
            });
        }
    }
    var reserveForm = new ReserveForm();
    reserveForm.init();

    /*预约表单*/
    function DialogForm(){
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        this.form = $('.js-form-subscribe');
        this.formAction = haServiceUrl + 'userBooking/addBookingInfo';
        this.codeUrl = haServiceUrl + 'mms/sendMsg';
        this.timeCountDown = 60;

    }
    DialogForm.prototype = {
        init : function(){
            this.initForm();
            this.bind();
            this.vcodeInit();
        },
        initForm : function(){
            var $form = this.form;
            $form.find('[name="name"]').val('');
            $form.find('[name="phoneNumber"]').val('');
            $form.find('[name="verCode"]').val('');
            $form.find('[name="productname"]').val(0);
            $form.find('.price').text('-');
        },
        bind : function(){
            var $form = this.form;
            var _self = this;
            $form.find('.submit').on('click',function(){
                if(_self.verify()){
                    _self.submit();
                }
            });
            $form.find('.seleced_product').on('change',function () {
                var $this = $(this);
                var value = $this.val();
                var selectedName = $this.find("option:selected").text();
                if (value != '0') {
                    var price='-';
                    if(selectedName=='油烟机'){
                        price='128 /台'
                    }else if(selectedName=='油烟机拆洗'){
                        price='168 /台'
                    }else if(selectedName=='空调挂机'){
                        price='75 /台'
                    }else if(selectedName=='空调柜机'){
                        price='128 /台'
                    }else if(selectedName=='普通冰箱'){
                        price='108 /台'
                    }else if(selectedName=='对开门冰箱'){
                        price='138 /台'
                    }else if(selectedName=='热水器'){
                        price='78 /台'
                    }else if(selectedName=='波轮洗衣机'){
                        price='78 /台'
                    }else if(selectedName=='波轮洗衣机拆洗'){
                        price='108 /台'
                    }else if(selectedName=='滚筒洗衣机'){
                        price='88 /台'
                    }else if(selectedName=='家用中央空调'){
                        price='85 /风口'
                    }else if(selectedName=='天花机'){
                        price='138 /台'
                    }else if(selectedName=='消毒柜'){
                        price='88 /台'
                    }else if(selectedName=='微波炉'){
                        price='55 /台'
                    }else if(selectedName=='灶台'){
                        price='48 /台'
                    }else if(selectedName=='壁挂炉'){
                        price='88 /台'
                    }else if(selectedName=='整体厨房'){
                        price='198 /套'
                    }else if(selectedName=='地暖'){
                        price='30 /管'
                    }
                    $form.find('.price').text('￥'+price);
                } else {
                    // $form.find('.seleced_product').html('<option value ="0">请选择清洗项目</option>');
                    $form.find('.price').text('-');
                }

            })
        },
        vcodeInit : function(){
            var _self = this;
            var $form = this.form;
            var codeLoading = false;
            $form.find('.js-get-vcode').on('click',function(){
                var $btn = $(this);
                if(codeLoading){
                    return false;
                }
                var phoneNum = $form.find('[name="phoneNumber"]').val();
                if(!UtilBase.isMobile(phoneNum)){
                    layer.tips('请输入正确的手机号', '.js-form-subscribe [name="phoneNumber"]', {
                        tips: [1, '#f00']
                    });
                    return false;
                }else{
                    var url = _self.codeUrl;
                    var param = {};
                    param.mobile = phoneNum;
                    codeLoading = true;
                    param = {
                        param : JSON.stringify(param)
                    }
                    $btn.html('发送中...');
                    clearInterval(_self.timerTicket);
                    $btn.addClass('disabled');
                    _self.timerTicket = setInterval(function(){
                        if(_self.timeCountDown <= 0){
                            clearInterval(_self.timerTicket);
                            _self.timeCountDown = 60;
                            codeLoading = false;
                            $btn.html('获取验证码');
                            $btn.removeClass('disabled');
                            return false;
                        }
                        $btn.html('获取验证码[' + _self.timeCountDown + ']');
                        _self.timeCountDown--;
                    },1000);


                    $.ajax({
                        type: 'POST',
                        crossdomain : true,
                        url: url,
                        data: param,
                        dataType: 'JSON',
                        success : function(res){
                            if(res.flag != 'success'){
                                layer.alert('短信发送失败', 9);
                                clearInterval(_self.timerTicket);
                                _self.timeCountDown = 60;
                                codeLoading = false;
                                $btn.html('获取验证码');
                                $btn.removeClass('disabled');
                            }
                        },
                        error: function (xhr) {
                            console.log(JSON.stringify(xhr));
                            layer.alert('短信发送失败', 9);
                            clearInterval(_self.timerTicket);
                            _self.timeCountDown = 60;
                            codeLoading = false;
                            $btn.html('获取验证码');
                            $btn.removeClass('disabled');
                        }
                    });

                }
            });
        },
        verify : function(){
            var $form = this.form;
            var userAppellation = $form.find('[name="name"]').val();
            var productname = $form.find('[name="productname"]').val();
            layer.closeAll();
            if(productname == 0){
                layer.tips('请选择清洗项目', '.js-form-subscribe [name="productname"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            if(UtilBase.isEmpty(userAppellation)){
                layer.tips('请输入姓名', '.js-form-subscribe [name="name"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            if(!UtilBase.isMobile(phoneNum)){
                layer.tips('请输入正确的手机号', '.js-form-subscribe [name="phoneNumber"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var code = $form.find('[name="verCode"]').val();
            if(UtilBase.isEmpty(code)){
                layer.tips('请输入验证码', '.js-form-subscribe [name="verCode"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            return true;

        },
        submit : function(){
            var _self = this;
            var $form = this.form;

            var userAppellation = $form.find('[name="name"]').val();
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            var code = $form.find('[name="verCode"]').val();
            var bookingDesc = $form.find('[name="bookingDesc"]').val();
            var productname = $form.find('[name="productname"]').val();

            var url = _self.formAction;
            var param = {
                userAppellation : userAppellation,
                phoneNum : phoneNum,
                code : code,
                bookingNote : productname,
                bookingDesc : "家电清洗",
                sourceType : 1
            };

            $.ajax({
                type: 'POST',
                url: url,
                data: param,
                dataType: 'JSON',
                success : function(res){
                    if(res.flag != 'success'){
                        layer.alert(res.msg, 9);
                    }else{
                        layer.alert('预约成功，客服稍后将会与您取得联系', 9);
                        _self.initForm();
                    }
                },
                error: function (xhr) {
                    layer.alert('发送请求失败', 9);

                }
            });
        }
    }
    var dialogForm = new DialogForm();
    dialogForm.init();

    // 通过IP地址定位城市名称
   var getCityByIP= function (successCallback){
        $.ajax({
            type: 'GET',
            url: 'http://restapi.amap.com/v3/ip?output=json&key=17eb7d180404c4a067d213db1a5d9b28',
            dataType: 'JSON',
            success : function(res){
                if(res==undefined||res=='undefined' || res=='' || res==null){
                    return '';
                }
                if(res.city==undefined||res.city=='undefined' || res.city=='' || res.city==null){
                    return '';
                }
                if (typeof successCallback === "function") {
                    successCallback(res.city);
                }

            },
            error: function (xhr) {
                return '';
            }
        });
    };
    //getCityByIP(function(cityName){
    //   console.log(cityName);
    //});
    function SubResult(){
        this.listCont = $('.subs-show-box .show-div');
        this.totalCont = $('.subs-show-box .subs-num');
    }
    /*预约结果展示*/
    SubResult.prototype = {
        init:function(){
            this.date = new Date();
            this.updateToUi();
        },
        getTotal : function(){
            var _self = this;
            var date = _self.date;
            var t1 = date.getTime() / 86400000;
            t1 = parseInt(t1);
            t1 = t1 * 589 % 500;
            var t2 = date.getTime() % 86400000 / 1800000;
            t2 = t2 + 16;
            t2 = parseInt(t2) * 10;
            var total = t1 + t2;

            return total;
        },
        getResultList : function(size){
            var _self = this;
            var nameLsit = _self.getNameList(size);
            var phoneNumberList = _self.getPhoneNumberList(size);
            var timeList = _self.getTimeList(size);
            var list = [];
            for(var i = 0; i < nameLsit.length;i++){
                list.push({
                    name : nameLsit[i],
                    tel : phoneNumberList[i],
                    time : timeList[i]
                });
            }
            return list;
        },
        createResultListHtml : function(size){
            var _self = this;
            var rList = _self.getResultList(size);
            rList = rList.sort(function(a,b){
                return parseInt(b.time.split(':')[0]) - parseInt(a.time.split(':')[0]);
            });
            var html = '';
            for(var i = 0; i < rList.length;i++){
                html += '<li class="result-row">'
                    + '<span class="name">' + rList[i].name + '</span><span class="phone-number">' + rList[i].tel + '</span><span class="time">' + rList[i].time + '</span>'
                    + '</li>'
            }
            return html;
        },
        getNameList : function(size){
            size = size || 6;
            var nameList = ["赵","钱","孙","李","周","吴","郑","王","冯","陈","邓","卫","蒋","沈","韩","杨","朱","秦","尤","许","何","吕","彭"];
            var list = [];
            for(var i = 0; i < size;i++){
                var name = nameList[parseInt(Math.random() * 100) % (nameList.length)] + '**';
                list.push(name);
            }
            return list;
        },
        getPhoneNumberList : function(size){
            size = size || 6;
            var t1 = ['137','130','150','130','189','138','158','188','133','139'];
            var list = [];
            for(var i = 0; i < size;i++){
                var t = parseInt(Math.random() * 12345 + 1000) % 10000;
                t = t < 1000 ? t + 1000 : t;
                var num = t1[parseInt(Math.random() * 100) % (t1.length)] + '****' + t;
                list.push(num);
            }
            return list;
        },
        getTimeList : function(size){
            var _self = this;
            size = size || 6;
            var date = _self.date;
            var mh = date.getHours();
            var list = [];
            for(var i = 0; i < size;i++){
                var h = parseInt(Math.random() * 100 % mh);
                h = h < 10 ? '0' + h : h;
                var m = parseInt(Math.random() * 100 % 60);
                m = m < 10 ? '0' + m : m;
                var s = parseInt(Math.random() * 100 % 60);
                s = s < 10 ? '0' + s : s;
                var time = h + ':' + m + ':' + s;
                list.push(time);
            }
            return list;
        },
        updateToUi : function(){
            var _self = this;
            var total = _self.getTotal();
            _self.totalCont.html(total);
            var html = _self.createResultListHtml(5);
            _self.listCont.html(html);
        }
    }

    var subResult = new SubResult();
    subResult.init();

    setInterval(function(){
        subResult.init();
    },5000);


    //function QQBox(){
	//
    //}
    //QQBox.prototype = {
    //    init : function(){
    //        this.updateHmlToUi();
    //    },
    //    createHtml : function(){
    //        var html = '<div style="position: fixed;right: 0;bottom: 30%;width: 2em;padding : 0.2rem 0.5em;' +
    //            'color:#ffffff;font-size: 1.2rem;background-color: rgba(0,0,0,0.4);text-align: center;">Q<br>Q咨询</div>';
    //        return html;
    //    },
    //    updateHmlToUi : function(){
    //        var _self = this;
    //        var html = _self.createHtml();
    //        var $html = $(html);
    //        $html.on('click',function(){
    //            window.open('http://wpa.qq.com/msgrd?v=3&uin=1556229553&Site=深圳十分到家服务科技有限公司&Menu=yes');
    //        });
    //        $('body').append($html);
    //    }
	//
    //}
    //var qqBox = new QQBox();
    //qqBox.init();

    /*样式微调*/
    var lh = $('.banner-form-div .left-div').height();
    var rh = $('.banner-form-div .right-div').height();
    var fh = $('.banner-form-div .right-div .subs-form-box').height();
    if(lh > rh){
        $('.banner-form-div .right-div .subs-form-box').css('min-height',(lh - rh + fh) + 'px');
    }else{
        $('.banner-form-div .left-div').css('min-height',(rh - lh + lh) + 'px');
    }

    /*轮播插件*/
    (function(){
        var unslider04 = $('.unslider-banner-box').unslider({
                dots: true
            }),
        data04 = unslider04.data('unslider');

        $('.unslider-arrow04').click(function() {
            var fn = this.className.split(' ')[1];
            data04[fn]();
        });
    })();

    //(function(){
    //    var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
    //    document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F965672c113f36cc603e398aeaf137a4d' type='text/javascript'%3E%3C/script%3E"));
    //})();

    // 启动客服
    // $('.online_book').on('click',function(){
    //     window.open('http://125.93.53.91:31337/app/chat.html?appname=tenant_sfdj&menukey=1');
    // });
    $('.online_book').on('click',function(){
        //$('.fixed-bottom-form').show();
        $('.fixed-mask-layer').show();
        $('.fixed-bottom-form').slideDown(200);
    });
    $('.fixed-mask-layer').on('click',function(){
        $('.fixed-bottom-form').slideUp('fast');
        $(this).hide();
    });
    $('.close_chat').on('click',function(){
        $('.customerservice').css('display','none');
    });
})(window,jQuery);