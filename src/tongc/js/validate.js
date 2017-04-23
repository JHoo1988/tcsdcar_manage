/**
 * Created by dell on 2016/10/10.
 */
layui.define(function (exports) {
    var Validate;
    Validate = {
        //�����Ƿ�Ϊ��
        isEmpty: function (obj) {
            if (obj.val() == '') {
                return false;
            }
            return true;
        },
        //���������ȷ�������Ƿ����
        isEqual: function (str1, str2) {
            return str1 === str2;
        },
        //�����ֻ�����
        isTelNum: function(value){
            if((/^1[34578]\d{9}$/.test(value))){
                return true;
            }
            return false;
        },
        //��������
        isPostcode: function(value){
            if(!!(/^[1-9][0-9]{5}$/.test(value))){
                return false;
            }
            return true;
        },
        //�������ĳ���
        checkPswdLen: function(value){
            if (value.length < 6 || value.length > 16) {
                return false;
            }
            return true;
        },

    }
    exports('Validate', Validate);
})
