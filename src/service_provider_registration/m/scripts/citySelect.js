// 二次封装ajax
function $ajax(options) {

    var method = options.method || 'GET',
        url = options.url,
        data = options.data || {},
        successCallback = options.success,
        errorCallback = options.error;

    function errorFn() {

        if (typeof errorCallback === 'function') {
            errorCallback();
        }

    }

    $.ajax({
        method: method,
        url: url,
        data: data,
        dataType: 'JSON',
        //xhrFields: {
        //    withCredentials: true
        //},
        crossDomain: true,
        success: function (res) {

            var serverMsg = '服务器发生错误';

            // 返回错误的格式
            if (typeof res !== 'object') {
                layer.msg(serverMsg);

                errorFn();

                return;
            }

            // 成功
            if (res.flag == 'success' && res.data) {

                if (typeof successCallback === 'function') {
                    successCallback(res);
                }

                return;
            }

            layer.msg(res.msg || serverMsg);
            errorFn();

        },
        error: function (xhr) {
            layer.msg(xhr.statusText);
            errorFn();
        }
    });
}

// 城市选择
function CitySelect(address) {
    var haUrl = window.haUrl;
    this.provinceUrl = haUrl.wash.address.province; // 省
    this.cityUrl = haUrl.wash.address.city; // 市
    this.selectProvince = $('#select-province');
    this.selectCity = $('#select-city');

    this.defaultProvince = address.province;
    this.defaultCity = address.city;
}

CitySelect.prototype = {
    constructor: CitySelect,
    init: function () {
        this.loadProvince();
        this.bind();
    },

    // 加载省份
    loadProvince: function (data) {
        var self = this;
        var _data = data || {};
        //_data.regionType = 1;

        $ajax({
            method: 'POST',
            url: self.provinceUrl,
            data: {param: JSON.stringify(_data)},
            success: function (res) {
                var items = [];
                var provinceId;
                items.push('<option value ="0">省</option>');

                $.each(res.data, function (i, value) {
                    var selected = '';

                    if (self.defaultProvince && self.defaultProvince == value.provinceName) {
                        provinceId = value.provinceId;
                        selected = 'selected';
                        self.defaultProvince = null;
                    }

                    items.push('<option value ="' + value.provinceId + '" ' + selected + '>' + value.provinceName + '</option>')
                });

                self.selectProvince.html(items.join(''));
                self.selectCity.html('<option value ="0">市</option>');

                if (provinceId) {
                    self.loadCity({
                        provinceId: provinceId,
                        defaultCity: self.defaultCity
                    });
                }

                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    },

    // 加载城市
    loadCity: function (data, callback) {
        var self = this;
        var _data = data || {};
        //_data.regionType = 1;

        $ajax({
            method: 'POST',
            url: self.cityUrl,
            data: {param: JSON.stringify(_data)},
            success: function (res) {
                var items = [];
                items.push('<option value ="0">市</option>');

                $.each(res.data, function (i, value) {
                    var selected = '';

                    if (data.defaultCity && data.defaultCity == value.cityName) {
                        selected = ' selected';
                        self.defaultCity = null;
                    }

                    items.push('<option value ="' + value.cityId + '" ' + selected + '>' + value.cityName + '</option>')
                });

                self.selectCity.html(items.join(''));

                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    },

    // 绑定事件
    bind: function () {
        var self = this;

        self.selectProvince.on('change', function () {
            var $this = $(this);
            var id = $this.val();
            var provinceId = $this.val();
            if (id === '0') {
                self.selectCity.html('<option value ="0">市</option>');
            } else {
                self.loadCity({provinceId: provinceId}, function () {
                    $('#showCity').html('市');
                });
            }

        });

    }
};
