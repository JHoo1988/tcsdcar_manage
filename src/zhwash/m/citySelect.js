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
    this.areaUrl = haUrl.address.area; // 区

    this.selectProvince = $('#select-province');
    this.selectCity = $('#select-city');
    this.selectArea = $('#select-area');

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
        _data.regionType = 1;

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
        _data.regionType = 1;

        $ajax({
            method: 'POST',
            url: self.cityUrl,
            data: {param: JSON.stringify(_data)},
            success: function (res) {
                var items = [];
                var cityId;
                items.push('<option value ="0">市</option>');

                $.each(res.data, function (i, value) {
                    var selected = '';

                    if (data.defaultCity && data.defaultCity == value.cityName) {
                        cityId = value.cityId;
                        selected = ' selected';
                        self.defaultCity = null;
                    }

                    items.push('<option value ="' + value.cityId + '" ' + selected + '>' + value.cityName + '</option>')
                });

                self.selectCity.html(items.join(''));

                if (cityId) {
                    self.loadArea({
                        cityId: cityId,
                        defaultArea: self.defaultArea
                    });
                }

                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    },

    // 加载地区
    loadArea: function (data, callback) {
        var self = this;
        var _data = data || {};
        _data.regionType = 1;

        $ajax({
            method: 'POST',
            url: self.areaUrl,
            data: {param: JSON.stringify(_data)},
            success: function (res) {
                var items = [];
                items.push('<option value ="0">区</option>');
                $.each(res.data, function (i, value) {
                    var selected = '';

                    if (data.defaultArea && data.defaultArea == value.areaName) {
                        selected = ' selected';
                        self.defaultArea = null;
                    }

                    items.push('<option value ="' + value.areaId + '" ' + selected + '>' + value.areaName + '</option>')
                });

                self.selectArea.html(items.join(''));

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
            self.selectArea.html('<option value ="0">区</option>');
            self.selectCity.html('<option value ="0">市</option>');

            if (id !== '0') {
                self.loadCity({provinceId: provinceId});
            }

        });

        self.selectCity.on('change', function () {
            var $this = $(this);
            var id = $this.val();
            self.selectArea.html('<option value ="0">区</option>');
            if (id !== '0') {
                self.loadArea({cityId: id});
            }
        });

    }
};
