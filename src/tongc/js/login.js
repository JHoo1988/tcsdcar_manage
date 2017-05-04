/**
 * Created by dell on 2016/9/23.
 */
layui.use(['jquery', 'layer','md5', 'cookie', 'global','Validate'], function () {
    var $ = layui.jquery,
        layer = layui.layer,
        global = layui.global,
        Validate = layui.Validate;

    var Page = function () {
        this.param = {};
    };
    Page.prototype = {
        init: function () {
            var _self = this;
            // _self.resetGraphicCode();
            _self.bindEvent();
        },
        bindEvent: function () {
            var _self = this;
            $("#loginName, #loginPassWord, #imgCode").keyup(function (e) {

                if (e.which == 13) {
                    var errMsg = _self.validation();
                    if (errMsg == '') {
                        _self.loginAccount(_self.param);
                    }
                    else {
                        layer.msg(errMsg,{time:1200})
                    }
                }
                e.stopPropagation();
            });

            $('#login_btn').on('click', function () {
                var errMsg = _self.validation();
                if (errMsg == '') {
                    _self.loginAccount(_self.param);
                }
                else {
                    layer.msg(errMsg,{time:1200})
                }
            });
        },

        //验证登录表单信息
        validation: function () {
            _self = this;
            _self.param.loginName = $('#loginName').val();
            _self.param.loginPassWord = $('#loginPassWord').val();//$.md5($('#loginPassWord').val());
            _self.param.code = $('#imgCode').val();
            if (_self.param.loginName && _self.param.loginPassWord) {
                return '';
            } else {
                return "请填写登录信息";
            }
        },

        //用户登录验证
        loginAccount: function (data) {
            var _self = this;
            var formData = new FormData($(".login-form")[0]);
            $.ajax({
                type: 'POST',
                url: global.url.login,
                dataType: 'JSON',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    _self.layer_index = layer.load(2);
                    $('#login_btn').addClass('layui-btn-disabled').attr('disabled', true);
                },
                success: function (result) {
                    layer.close(_self.layer_index);
                    if (result.code == 200) {
                        //保存登录用户名到cookie
                        // $.cookie('userMobile', result.data.userMobile, {expires: 7});
                        $.cookie('userToken', result.data.token, {expires: 7});
                        // $.cookie('userId', result.data.userId, {expires: 7});
                        $.cookie('companyName', encodeURIComponent(result.data.nickName), {expires: 7});
                        $.cookie('userModel', encodeURIComponent(result.data.role), {expires: 7});
                        // if(data.loginName=='kf0001'){
                        //     $.cookie('companyName', encodeURIComponent('客服1'), {expires: 7});
                        //     $.cookie('userModel', encodeURIComponent('1'), {expires: 7});
                        // }else if(data.loginName=='kf0002'){
                        //     $.cookie('companyName', encodeURIComponent('客服2'), {expires: 7});
                        //     $.cookie('userModel', encodeURIComponent('1'), {expires: 7});
                        // }else if(data.loginName=='kf0003'){
                        //     $.cookie('companyName', encodeURIComponent('客服3'), {expires: 7});
                        //     $.cookie('userModel', encodeURIComponent('1'), {expires: 7});
                        // }else if(data.loginName=='kf0004'){
                        //     $.cookie('companyName', encodeURIComponent('客服4'), {expires: 7});
                        //     $.cookie('userModel', encodeURIComponent('1'), {expires: 7});
                        // }else if(data.loginName=='kf0005'){
                        //     $.cookie('companyName', encodeURIComponent('客服5'), {expires: 7});
                        //     $.cookie('userModel', encodeURIComponent('1'), {expires: 7});
                        // }else if(data.loginName=='admin'){
                        //     $.cookie('companyName', encodeURIComponent('同创盛大'), {expires: 7});
                        //     $.cookie('userModel', encodeURIComponent('0'), {expires: 7});
                        // }
                        window.location.href = "msp.html";
                    } else {
                        layer.msg('登录失败，用户名或密码错误。',{time:1200});
                        $('#login_btn').removeClass('layui-btn-disabled').removeAttr('disabled');
                    }
                },
                complete: function () {
                    layer.close(_self.layer_index);
                    $('#login_btn').removeClass('layui-btn-disabled').removeAttr('disabled');
                },
                error: function () {
                    $('#login_btn').removeClass('layui-btn-disabled').removeAttr('disabled');
                    layer.close(_self.layer_index);
                    layer.msg('服务器连接失败',{time:1200});
                }
            })
            // $.ajax({
            //     type: 'POST',
            //     url: 'http://localhost:8080/login',
            //     dataType: 'JSON',
            //     data: data,
            //     beforeSend: function(){
            //         $('#login_btn').addClass('layui-btn-disabled').attr('disabled', true);
            //     },
            //     complete: function () {
            //         $('#login_btn').removeClass('layui-btn-disabled').removeAttr('disabled');
            //     }
            // }).done(function (result) {
            //     if (result.code == 200) {
            //         //保存登录用户名到cookie
            //         $.cookie('loginName', _self.param.loginName, {expires: 7});
            //         $.cookie('userToken', result.data.token, {expires: 7});
            //         // $.cookie('userId', result.data.userId, {expires: 7});
            //         $.cookie('companyName', encodeURIComponent('同创盛大'), {expires: 7});
            //         window.location.href = "msp.html";
            //     } else {
            //         layer.msg('登录失败，用户名或密码错误',{time:1200});
            //         // _self.resetGraphicCode();
            //     }
            // });
        },
    }
    var page = new Page();
    page.init();
})

