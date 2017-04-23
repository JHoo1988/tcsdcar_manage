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


    /*预约表单*/
    function ReserveForm(){
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        this.form = $('.js-form-subscribe');
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
            var faultDesc = $form.find('[name="faultDesc"]').val();
            if(UtilBase.isEmpty(faultDesc)){
                layer.tips('请填写故障说明', '.js-form-subscribe [name="faultDesc"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var faultSize = $form.find('.sui-check-box .check-item.checked').size();
            if(faultSize <= 0){
                layer.tips('请选择常见故障', '.sui-check-box', {
                    tips: [1, '#f00']
                });
                return false;
            }

            return true;

        },
        submit : function(){
            var _self = this;
            var $form = this.form;
            var bookingNote = [];
            $form.find('.sui-check-box .check-item.checked').each(function(i,d){
                bookingNote.push($(d).text());
                return true;
            });
            bookingNote = bookingNote.join(',');
            var faultDesc = $form.find('[name="faultDesc"]').val();

            var userAppellation = $form.find('[name="name"]').val();
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            var code = $form.find('[name="verCode"]').val();
            var bookingDesc = $form.find('[name="bookingDesc"]').val();

            bookingNote = bookingNote + ':' + faultDesc;
            var url = _self.formAction;
            var param = {
                userAppellation : userAppellation,
                phoneNum : phoneNum,
                code : code,
                bookingNote : bookingNote,
                bookingDesc : bookingDesc,
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


    function QQBox(){

    }
    QQBox.prototype = {
        init : function(){
            this.updateHmlToUi();
        },
        createHtml : function(){
            var html = '<div style="position: fixed;right: 0;bottom: 30%;width: 2em;padding : 0.2rem 0.5em;' +
                'color:#ffffff;font-size: 1.2rem;background-color: rgba(0,0,0,0.4);text-align: center;">Q<br>Q咨询</div>';
            return html;
        },
        updateHmlToUi : function(){
            var _self = this;
            var html = _self.createHtml();
            var $html = $(html);
            $html.on('click',function(){
                window.open('http://wpa.qq.com/msgrd?v=3&uin=1431396707&Site=深圳十分到家服务科技有限公司&Menu=yes');
            });
            $('body').append($html);
        }

    }
    var qqBox = new QQBox();
    qqBox.init();

    /*样式微调*/
    var lh = $('.banner-form-div .left-div').height();
    var rh = $('.banner-form-div .right-div').height();
    var fh = $('.banner-form-div .right-div .subs-form-box').height();
    if(lh > rh){
        $('.banner-form-div .right-div .subs-form-box').css('min-height',(lh - rh + fh) + 'px');
    }else{
        $('.banner-form-div .left-div').css('min-height',(rh - lh + lh) + 'px');
    }

    //(function(){
    //    var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
    //    document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F965672c113f36cc603e398aeaf137a4d' type='text/javascript'%3E%3C/script%3E"));
    //})();
})(window,jQuery);