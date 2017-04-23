/**
 * Created by dell on 2016/9/24.
 */
layui.use(['jquery', 'layer', 'md5', 'cookie', 'global'], function () {
    var $ = layui.jquery,
        layer = layui.layer,
        global = layui.global;

    var Page = function () {
        this.parm = {};
    }

    Page.prototype = {
        init: function () {
            var _self = this;
            _self.bindEvent();
        },
        bindEvent: function () {
            var _self = this;

            //判断是否阅读并同意协议
            $('#agreement_check').on('click', function () {
                if ($(this).is(':checked')) {
                    $('#btn_agree').removeAttr('disabled').removeClass('layui-btn-disabled').addClass('layui-btn-normal');
                } else {
                    $('#btn_agree').attr('disabled', 'true').removeClass('layui-btn-normal').addClass('layui-btn-disabled');
                }
            });

            //切换到注册模板
            $('#btn_agree').on('click', function () {
                //同意协议，切换到注册模块
                $('.register-agreement').hide();
                $('#progressbar').find('li').eq(1).addClass('active');
                $('.register-info').show();
            });

            //获取验证码
            $('#get_verify').on('click', function () {
                var self = $(this);
                if (!(/^1[34578]\d{9}$/.test($('#userMobile').val()))) {
                    layer.msg('请输入正确的手机号码', {time: 1200});
                    return;
                }
                //验证码重新发送倒计时
                global.setTime(self);
                var mobileCodeParam = {
                    mobile: $('#userMobile').val()
                };
                global.getVerify(mobileCodeParam);
            });

            //提交注册信息
            $('#info_register').on('click', function () {
                if (checkUserInfo()) {
                    var md5User5Psd = $.md5($('#userPwd').val());
                    var md5WalletPsd = $.md5($('#walletPwd').val());
                    $('#userPwd1').val(md5User5Psd);
                    $('#walletPwd1').val(md5WalletPsd);

                    //切换到资料完整步骤
                    _self.parm.userMobile = $('#userMobile').val();
                    _self.parm.code = $('#mobile_verify').val();
                    _self.parm.userPwd = $('#userPwd1').val();
                    _self.parm.walletPwd = $('#walletPwd1').val();
                    _self.parm.sign = global.getSignByArr(_self.parm);
                    _self.parm.companyName = $('#companyName').val();

                    if (_self.parm.userMobile && _self.parm.code && _self.parm.userPwd && _self.parm.walletPwd) {
                        //判断用户或者验证码是否存在
                        _self.checkUserExist(function () {
                            _self.registerFullInfo(_self.parm);
                        });
                    } else {
                        layer.msg('请输入完整信息！');
                    }
                }
            });
        },
        //验证用户是否已经被注册
        checkUserExist: function (callback) {
            var _self = this;
            var param = {
                'userMobile': $('#userMobile').val(),
                'code': $('#mobile_verify').val()
            }
            $.ajax({
                url: global.url.checkUserExist,
                type: 'post',
                dataType: 'json',
                data: param,
                //async: false,
                beforeSend: function () {
                    $('#info_register').attr('disabled', 'true').addClass('layui-btn-disabled');
                },
                success: function (result) {
                    if (result.flag == 'success') {
                        if(callback){
                            callback();
                        }
                    } else {
                        layer.msg(result.msg);
                    }
                },
                complete: function () {
                    $('#info_register').removeAttr('disabled').removeClass('layui-btn-disabled');
                }
            })
        },
        //提交注册信息
        registerFullInfo: function (param) {
            $.ajax({
                url: global.url.userRegistered,
                type: 'post',
                dataType: 'json',
                data: param,
                success: function (result) {
                    if (result.flag == 'success') {
                        layer.msg('注册成功！', function () {
                            window.location.href = 'login.html';
                        });

                    } else {
                        layer.msg(result.msg, {time:1800});
                    }
                },
            })
        },
    };

    //检测用户信息
    function checkUserInfo() {
        var userMobile = $('#userMobile').val();
        var msgcode = $('#mobile_verify').val();
        var companyName = $('#companyName').val();
        var pswd = $("#userPwd").val();
        var r_pswd = $("#confirm_userPwd").val();

        if ((!/^1[34578]\d{9}$/.test(userMobile))) {
            layer.msg('请输入正确手机号码！');
            return false;
        }
        if (global.isValEmpty(msgcode)) {
            layer.msg('请输入验证码！');
            return false;
        }

        if (global.isValEmpty(companyName)) {
            layer.msg('请输入公司名称！');
            return false;
        }


        if (!global.checkPswdLen(pswd)) {
            layer.msg('请设置6到16位长度密码！');
            return false;
        }

        if (pswd !== r_pswd) {
            layer.msg('登录密码和确认登录密码不一致！');
            return false;
        }

        var wpswd = $("#walletPwd").val();
        var r_wpswd = $("#confirm_walletPwd").val();

        if (!global.checkPswdLen(wpswd)) {
            layer.msg('请设置6到16位长度支付密码！');
            return false;
        }

        if (wpswd !== r_wpswd) {
            layer.msg('支付密码和确认支付密码不一致！');
            return false;
        }

        return true;
    }

    var page = new Page();
    page.init();
})
