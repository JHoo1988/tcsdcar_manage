/**
 * Created by Administrator on 2016/8/24.
 */
(function(win,$){

    $.support.cors = true;

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
        wipeNoLeHanZi : function(str){
            var newStr = '';
            for(var i = 0; i < str.length;i++){
                var charCode = str.charCodeAt(i);
                if((charCode > 0x4E00 && charCode < 0x9FFF) || /[a-zA-Z]/.test(str[i])){
                    newStr += String.fromCharCode(charCode);
                }
            }
            return newStr;
        },
        isLeHanZi : function(str){
            for(var i = 0; i < str.length;i++){
                var charCode = str.charCodeAt(i);
                if((charCode > 0x4E00 && charCode < 0x9FFF) || /[a-zA-Z]/.test(str[i])){

                }else{
                    return false;
                }
            }
            return true;
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
            var _self = this;
            var $form = this.form;
            var userAppellation = $form.find('[name="name"]').val();
            userAppellation = _self.wipeNoLeHanZi(userAppellation);
            $form.find('[name="name"]').val(userAppellation);
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
            faultDesc = _self.wipeNoLeHanZi(faultDesc);
            $form.find('[name="faultDesc"]').val(faultDesc);
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
                        $('.fixed-mask-layer').trigger('click');
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

    $(function(){
        $('.js-btn-open-form').on('click',function(){
            //$('.fixed-bottom-form').show();
            $('.fixed-mask-layer').show();
            $('.fixed-bottom-form').slideDown(200);
        });
        $('.fixed-mask-layer').on('click',function(){
            $('.fixed-bottom-form').slideUp('slow');
            $(this).hide();
        });
    });

})(window,jQuery);