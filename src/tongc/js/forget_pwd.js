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
            //获取验证码
            $('#get_verify').on('click', function () {
                if (!global.isPhone($('#userMobile').val())) {
                    layer.msg('请输入正确的手机号码!',{time:1200});
                } else {
                    //验证码重新发送倒计时
                    _self.checkMobileExist();
                    $("#mobile_verify, #userPwd, #confirm_userPwd").keyup(function (e) {
                        if (e.which == 13) {
                            var errMsg = _self.validation();
                            if (errMsg == '') {
                                _self.sendResetPwd();
                            }
                            else {
                                layer.msg(errMsg,{time:1200})
                            }
                        }
                        e.stopPropagation();
                    });
                }
            });
            //提交注册信息
            $('#info_register').on('click', function () {
                _self.sendResetPwd();
            });
        },
        //重置密码
        sendResetPwd: function () {
            var _self = this;
            if (_self.checkUserInfo()) {
                var md5User5Psd = $.md5($('#userPwd').val());
                $('#userPwd1').val(md5User5Psd);
                //重置密码
                _self.parm.mobile = $('#userMobile').val();
                _self.parm.code = $('#mobile_verify').val();
                _self.parm.newPwd = $('#userPwd1').val();
                _self.parm.sign = global.getSignByArr(_self.parm);

                _self.resetLoginPwd(_self.parm);
            }
        },
        //检测手机号码是否存在
        checkMobileExist: function () {
            var _self = this;
            var param = {
                'mobile': $('#userMobile').val()
            }
            $.ajax({
                url: global.url.checkMobileExist,
                type: 'post',
                dataType: 'json',
                data: param,
                success: function (result) {
                    if (result.flag == 'success') {
                        global.setTime($('#get_verify'));
                        var mobileCodeParam = {
                            mobile: $('#userMobile').val()
                        }
                        global.getVerify(mobileCodeParam);
                    } else {
                        layer.msg(result.msg,{time:1200});
                    }
                }
            })
        },
        //重置手机号码
        resetLoginPwd: function (param) {
            var _self = this
            $.ajax({
                url: global.url.resetLoginPwd,
                type: 'post',
                dataType: 'json',
                data: param,
                beforeSend: function () {
                    $('#info_register').addClass('layui-btn-disabled').attr('disabled', 'true');
                },
                success: function (result) {
                    if (result.flag == 'success') {
                        layer.msg('密码重置成功！',{time:1200}, function () {
                            window.location.href = 'login.html';
                        });
                    } else {
                        layer.msg(result.msg,{time:1200});
                    }
                },
                complete: function () {
                    $('#info_register').removeClass('layui-btn-disabled').removeAttr('disabled');
                }
            })
        },

        validation: function () {
            _self = this;
            if ($('#userMobile').val() && $('#mobile_verify').val() && $('#userPwd').val()) {

                if (!(/^1[34578]\d{9}$/.test($('#userMobile').val()))) {
                    return "请输入正确的手机号码!";
                } else {
                    return '';
                }
            } else {
                return "请填写登录信息";
            }
        },
        //验证提交信息
        checkUserInfo: function () {
            var userMobile = $('#userMobile').val();
            var msgcode = $('#mobile_verify').val();
            var pswd = $("#userPwd").val();
            var r_pswd = $("#confirm_userPwd").val();

            if (!global.isPhone(userMobile)) {
                layer.msg('请输入正确的手机号码！',{time:1800});
                return false;
            }

            if (global.isValEmpty(msgcode)) {
                layer.msg('请输入验证码！',{time:1200});
                return false;
            }


            if (!global.checkPswdLen(pswd)) {
                layer.msg('请设置6到16位长度密码！',{time:1800});
                return false;
            }

            if (global.isValEmpty(pswd) || global.isValEmpty(r_pswd)) {
                layer.msg('登录密码和确认登录密码都不能为空！',{time:1800});
                return false;
            }

            if (pswd !== r_pswd) {
                layer.msg('新密码和确认新密码不一致！',{time:1800});
                return false;
            }
            return true;
        }
    }

    var page = new Page();
    page.init();
})
