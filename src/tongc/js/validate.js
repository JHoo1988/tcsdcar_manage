/**
 * Created by dell on 2016/10/10.
 */
layui.define(function (exports) {
    var Validate;
    Validate = {
        //检测表单是否为空
        isEmpty: function (obj) {
            if (obj.val() == '') {
                return false;
            }
            return true;
        },
        //检测密码与确认密码是否相等
        isEqual: function (str1, str2) {
            return str1 === str2;
        },
        //正则手机号码
        isTelNum: function(value){
            if((/^1[34578]\d{9}$/.test(value))){
                return true;
            }
            return false;
        },
        //正则邮箱
        isPostcode: function(value){
            if(!!(/^[1-9][0-9]{5}$/.test(value))){
                return false;
            }
            return true;
        },
        //检测密码的长度
        checkPswdLen: function(value){
            if (value.length < 6 || value.length > 16) {
                return false;
            }
            return true;
        },

    }
    exports('Validate', Validate);
})
