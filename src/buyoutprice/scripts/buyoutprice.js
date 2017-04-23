/**
 * Created by 焦红 on 2016/12/27.
 */
(function (win, $) {
    function reset_css() {
        $('.product_items a span').css({
            'background-color': '#ffffff',
            'color': '#666666',
            'border': '1px solid #cccccc'
        });
    }

    reset_css();

    function hidePage() {
        $('.hood, .water_heater, .fridges, .washing_machine, .cooker, .tv, .air_conditioner, .sterilizer, .water_purifier, .water_dispenser').css('display', 'none');
    }

    function changePage() {
        hidePage();
        var hash = location.hash;
        var classhash = hash.slice(1);
        var title = "";
        if (hash == "#fridges") {
            title = "冰箱";
        } else if (hash == "#water_heater") {
            title = "热水器";
        } else if (hash == "#hood") {
            title = "油烟机";
        } else if (hash == "#washing_machine") {
            title = "洗衣机";
        } else if (hash == "#cooker") {
            title = "燃气灶";
        } else if (hash == "#tv") {
            title = "彩电";
        } else if (hash == "#air_conditioner") {
            title = "空调";
        } else if (hash == "#sterilizer") {
            title = "消毒柜";
        } else if (hash == "#water_purifier") {
            title = "净水器";
        } else if (hash == "#water_dispenser") {
            title = "饮水机";
        } else {
            hash = "#hood";
            classhash = "hood";
            title = "油烟机";
        }
        $('.' + classhash).css('display', 'block');
        $('.selected_name').text(title + "维修");
        $('.product_name').text(title + "维修价格");
        // $(hash).css({'background-color': '#00BBFE', 'color': '#FFFFFF', 'border': '1px solid #00BBFE'});
        $('.t_' + classhash).css({'background-color': '#00BBFE', 'color': '#FFFFFF', 'border': '1px solid #00BBFE'});
    }

    changePage();

    $('.product_items a span').on('click', function () {
        reset_css();
        $(this).css({'background-color': '#00BBFE', 'color': '#FFFFFF', 'border': '1px solid #00BBFE'});
        location.hash = "#" + ($(this).attr('class')).slice(2);
        changePage();
    });

    $('.product_items a span').hover(function () {
        $(this).css({'border': '1px solid #00BBFE'});
    }, function () {
        $(this).css({'border': '1px solid #cccccc'});
    });

    //显示更多价格信息
    $('.show_more').on('click', function () {
        $('.price_table').css('height', 'auto');
        $(this).css('display', 'none');
        $('.close_more').css('display', 'inline-block');
    });
    //隐藏更多价格信息
    $('.close_more').on('click', function () {
        $('.price_table').css('height', '437px');
        $(this).css('display', 'none');
        $('.show_more').css('display', 'inline-block');
    });


    /*维修产品*/
    function wx_reset_css() {
        $('.appointment .appointment_content .select_appointment .select_items a span').css({
            'background-color': '#ffffff',
            'color': '#666666',
            'border': '1px solid #cccccc'
        });
    }

    wx_reset_css();

    $('.product_img').attr('src', 'images/banner/sj_yyj.png');
    $('.wx_hood').css({'background-color': '#00BBFE', 'color': '#FFFFFF', 'border': '1px solid #00BBFE'});

    var wx_selected_name = "油烟机";

    function wx_change_img(wx_selected_class) {
        var imgurl;
        if (wx_selected_class == "wx_fridges") {
            wx_selected_name = "冰箱";
            imgurl = 'images/banner/dmbx.png';
        } else if (wx_selected_class == "wx_water_heater") {
            imgurl = 'images/banner/rsq.png';
            wx_selected_name = "热水器";
        } else if (wx_selected_class == "wx_hood") {
            wx_selected_name = "油烟机";
            imgurl = 'images/banner/sj_yyj.png';
        } else if (wx_selected_class == "wx_washing_machine") {
            wx_selected_name = "洗衣机";
            imgurl = 'images/banner/gtxyj.png';
        } else if (wx_selected_class == "wx_cooker") {
            wx_selected_name = "燃气灶";
            imgurl = 'images/banner/rqz.png';
        } else if (wx_selected_class == "wx_tv") {
            wx_selected_name = "彩电";
            imgurl = 'images/banner/tv.png';
        } else if (wx_selected_class == "wx_air_conditioner") {
            wx_selected_name = "空调";
            imgurl = 'images/banner/ktgj.png';
        } else if (wx_selected_class == "wx_sterilizer") {
            wx_selected_name = "消毒柜";
            imgurl = 'images/banner/xdg.png';
        } else if (wx_selected_class == "wx_water_purifier") {
            wx_selected_name = "净水器";
            imgurl = 'images/banner/jsq.png';
        } else if (wx_selected_class == "wx_water_dispenser") {
            wx_selected_name = "饮水机";
            imgurl = 'images/banner/ysj.png';
        } else {
            wx_selected_name = "油烟机";
            imgurl = 'images/banner/sj_yyj.png';
        }
        $('.product_img').attr('src', imgurl);
    }

    $('.appointment .appointment_content .select_appointment .select_items a span').on('click', function () {
        wx_reset_css();
        $(this).css({'background-color': '#00BBFE', 'color': '#FFFFFF', 'border': '1px solid #00BBFE'});
        wx_change_img($(this).attr('class'));
    });
    $('.appointment .appointment_content .select_appointment .select_items a span').hover(function () {
        $(this).css({'border': '1px solid #00BBFE'});
    }, function () {
        $(this).css({'border': '1px solid #cccccc'});
    });


    /*预约表单*/
    function ReserveForm() {
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        this.form = $('.zxyy');
        this.formAction = haServiceUrl + 'userBooking/addBookingInfo';
        this.codeUrl = haServiceUrl + 'mms/sendMsg';
        this.timeCountDown = 60;

    }

    ReserveForm.prototype = {
        init: function () {
            this.initForm();
            this.bind();
            this.vcodeInit();
        },
        initForm: function () {
            var $form = this.form;
            $form.find('[name="name"]').val('');
            $form.find('[name="phoneNumber"]').val('');
            $form.find('[name="verCode"]').val('');
            $form.find('[name="faultDesc"]').val('');
            $form.find('.sui-check-box .check-item').removeClass('checked');
        },
        bind: function () {
            var $form = this.form;
            var _self = this;
            $form.find('.btn-submit').on('click', function () {
                if (_self.verify()) {
                    _self.submit();
                }
            });
            $form.find('.sui-check-box .check-item').on('click', function () {
                $(this).toggleClass('checked');
            });
        },
        vcodeInit: function () {
            var _self = this;
            var $form = this.form;
            var codeLoading = false;
            $form.find('.js-get-vcode').on('click', function () {
                var $btn = $(this);
                if (codeLoading) {
                    return false;
                }
                var phoneNum = $form.find('[name="phoneNumber"]').val();
                if (!UtilBase.isMobile(phoneNum)) {
                    layer.tips('请输入正确的手机号', '.zxyy [name="phoneNumber"]', {
                        tips: [1, '#f00']
                    });
                    return false;
                } else {
                    var url = _self.codeUrl;
                    var param = {};
                    param.mobile = phoneNum;
                    codeLoading = true;
                    param = {
                        param: JSON.stringify(param)
                    }
                    $btn.html('发送中...');
                    clearInterval(_self.timerTicket);
                    $btn.addClass('disabled');
                    _self.timerTicket = setInterval(function () {
                        if (_self.timeCountDown <= 0) {
                            clearInterval(_self.timerTicket);
                            _self.timeCountDown = 60;
                            codeLoading = false;
                            $btn.html('获取验证码');
                            $btn.removeClass('disabled');
                            return false;
                        }
                        $btn.html('获取验证码[' + _self.timeCountDown + ']');
                        _self.timeCountDown--;
                    }, 1000);


                    $.ajax({
                        type: 'POST',
                        crossdomain: true,
                        url: url,
                        data: param,
                        dataType: 'JSON',
                        success: function (res) {
                            if (res.flag != 'success') {
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
        verify: function () {
            var $form = this.form;
            var userAppellation = $form.find('[name="name"]').val();
            if (UtilBase.isEmpty(userAppellation)) {
                layer.tips('请输入姓名', '.zxyy [name="name"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            if (!UtilBase.isMobile(phoneNum)) {
                layer.tips('请输入正确的手机号', '.zxyy [name="phoneNumber"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var code = $form.find('[name="verCode"]').val();
            if (UtilBase.isEmpty(code)) {
                layer.tips('请输入验证码', '.zxyy [name="verCode"]', {
                    tips: [1, '#f00']
                });
                return false;
            }


            return true;

        },
        submit: function () {
            var _self = this;
            var $form = this.form;

            var userAppellation = $form.find('[name="name"]').val();
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            var code = $form.find('[name="verCode"]').val();
            var bookingDesc = $form.find('[name="bookingDesc"]').val();

            var url = _self.formAction;
            var param = {
                userAppellation: userAppellation,
                phoneNum: phoneNum,
                code: code,
                bookingNote: wx_selected_name + '维修',
                bookingDesc: bookingDesc,
                sourceType: 1
            };

            $.ajax({
                type: 'POST',
                url: url,
                data: param,
                dataType: 'JSON',
                success: function (res) {
                    if (res.flag != 'success') {
                        layer.alert(res.msg, 9);
                    } else {
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

    $('.close_chat').on('click',function(){
        $('.customerservice').css('display','none');
    });
})(window, jQuery);