/**
 * Created by Administrator on 2016/8/24.
 */
var UtilBase = {
    // 是否为手机号码
    isMobile: function (value) {
        return /^1[34578]\d{9}$/.test(value);
    },
    // 是否为空，或只输入了空白符
    isEmpty: function (value) {
        if (value === '') {
            return true;
        }
        return /^\s+$/.test(value);
    }
}
