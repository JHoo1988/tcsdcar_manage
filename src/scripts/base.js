/**
 * Created by Administrator on 2016/8/24.
 */
var UtilBase = {
    // �Ƿ�Ϊ�ֻ�����
    isMobile: function (value) {
        return /^1[34578]\d{9}$/.test(value);
    },
    // �Ƿ�Ϊ�գ���ֻ�����˿հ׷�
    isEmpty: function (value) {
        if (value === '') {
            return true;
        }
        return /^\s+$/.test(value);
    }
}
