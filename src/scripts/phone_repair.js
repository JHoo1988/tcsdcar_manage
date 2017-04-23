/**
 * Created by Administrator on 2016/8/24.
 */
(function(win,$){

    $.support.cors = true;
    var cacheXhrData = {}; // ajax请求缓存在这里面

    // 二次封装ajax
    function $ajax(options){

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

    /*预约表单*/
    function ReserveForm(){
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        this.form = $('.js-form-subscribe');
        this.formAction = haServiceUrl + 'userBooking/addBookingInfo';
        this.codeUrl = haServiceUrl + 'mms/sendMsg';
        this.timeCountDown = 60;

    }
    ReserveForm.prototype = {
        init : function(){
            this.initForm();
            this.bind();
            //this.vcodeInit();
        },
        initForm : function(){
            var $form = this.form;
            $form.find('[name="brand"]').val(0);
            $form.find('[name="model"]').val(0);
            $form.find('[name="fault"]').val(0);
            $form.find('[name="province"]').val(0);
            $form.find('[name="city"]').val(0);
            $form.find('[name="area"]').val(0);
            $form.find('[name="address"]').val('');
            $form.find('[name="name"]').val('');
            $form.find('[name="phoneNumber"]').val('');
            $('#service-address').html('').hide();
        },
        bind : function(){
            var $form = this.form;
            var _self = this;
            $form.find('.submit').on('click',function(){
                if(_self.verify()){
                    _self.submit();
                }
            });
        },
        vcodeInit : function(){
            var _self = this;
            var $form = this.form;
            var codeLoading = false;
            $form.find('.js-get-vcode').on('click',function(){
                var $btn = $(this);
                if(codeLoading){
                    return false;
                }
                var phoneNum = $form.find('[name="phoneNumber"]').val();
                if(!UtilBase.isMobile(phoneNum)){
                    layer.tips('请输入正确的手机号', '.js-form-subscribe [name="phoneNumber"]', {
                        tips: [1, '#f00']
                    });
                    return false;
                }else{
                    var url = _self.codeUrl;
                    var param = {};
                    param.mobile = phoneNum;
                    codeLoading = true;
                    param = {
                        param : JSON.stringify(param)
                    }
                    $btn.html('发送中...');
                    clearInterval(_self.timerTicket);
                    $btn.addClass('disabled');
                    _self.timerTicket = setInterval(function(){
                        if(_self.timeCountDown <= 0){
                            clearInterval(_self.timerTicket);
                            _self.timeCountDown = 60;
                            codeLoading = false;
                            $btn.html('获取验证码');
                            $btn.removeClass('disabled');
                            return false;
                        }
                        $btn.html('获取验证码[' + _self.timeCountDown + ']');
                        _self.timeCountDown--;
                    },1000);


                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: param,
                        dataType: 'JSON',
                        success : function(res){
                            if(res.flag != 'success'){
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
        verify : function(){
            var $form = this.form;
            var brand = $form.find('[name="brand"]').val();
            layer.closeAll();
            if(brand === '0'){
                layer.tips('请选择品牌', '.js-form-subscribe [name="brand"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var model = $form.find('[name="model"]').val();
            if(model === '0'){
                layer.tips('请选择型号', '.js-form-subscribe [name="model"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var fault = $form.find('[name="fault"]').val();
            if(fault === '0'){
                layer.tips('请选择故障', '.js-form-subscribe [name="fault"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var province = $form.find('[name="province"]').val();
            if(province === '0'){
                layer.tips('请选择省', '.js-form-subscribe [name="province"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var city = $form.find('[name="city"]').val();
            if(city === '0'){
                layer.tips('请选择市', '.js-form-subscribe [name="city"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            //var area = $form.find('[name="area"]').val();
            //if(area === '0'){
            //    layer.tips('请选择区', '.js-form-subscribe [name="area"]', {
            //        tips: [1, '#f00']
            //    });
            //    return false;
            //}
            var address = $form.find('[name="address"]').val();
            if(UtilBase.isEmpty(address)){
                layer.tips('请输入地址', '.js-form-subscribe [name="address"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var userAppellation = $form.find('[name="name"]').val();
            if(UtilBase.isEmpty(userAppellation)){
                layer.tips('请输入称呼', '.js-form-subscribe [name="name"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            if(!UtilBase.isMobile(phoneNum)){
                layer.tips('请输入正确的手机号', '.js-form-subscribe [name="phoneNumber"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            return true;

        },
        submit : function(){
            var _self = this;
            var $form = this.form;
            var brand = $form.find('[name="brand"]').find("option:selected").text();
            var model = $form.find('[name="model"]').find("option:selected").text();
            var fault = $form.find('[name="fault"]').find("option:selected").text();
            var province = $form.find('[name="province"]').find("option:selected").text();
            var city = $form.find('[name="city"]').find("option:selected").text();
            //var area = $form.find('[name="area"]').find("option:selected").text();
            var address = $form.find('[name="address"]').val();
            var userAppellation = $form.find('[name="name"]').val();
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            var bookingNote = brand + '/' + model + ':' + fault;   // 故障说明
            //var completeAddress = province + city + area + address;   // 地址
            var completeAddress = province + city + address;   // 地址
            var url = _self.formAction;
            var param = {
                userAppellation: userAppellation,
                phoneNum: phoneNum,
                bookingNote: bookingNote,
                address: completeAddress,
                bookingDesc: '手机维修',
                sourceType: 1,
                pageType: 0
            };

            $.ajax({
                type: 'POST',
                url: url,
                data: param,
                dataType: 'JSON',
                success : function(res){
                    if(res.flag != 'success'){
                        layer.alert(res.msg, 9);
                    }else{
                        layer.alert('预约成功，客服稍后将会与您取得联系', 9);
                        _self.initForm();
                    }
                },
                error: function (xhr) {
                    layer.alert('发送请求失败', 9);

                }
            });
        }
    };
    var reserveForm = new ReserveForm();
    reserveForm.init();

    //function QQBox(){
    //
    //}
    //QQBox.prototype = {
    //    init : function(){
    //        this.updateHmlToUi();
    //    },
    //    createHtml : function(){
    //        var html = '<div style="position: fixed;right: 0;bottom: 5%;width: 2em;padding : 0.2rem 0.5em;' +
    //            'color:#ffffff;font-size: 1.2rem;background-color: rgba(0,0,0,0.4);text-align: center;">在线咨询</div>';
    //        return html;
    //    },
    //    updateHmlToUi : function(){
    //        var _self = this;
    //        var html = _self.createHtml();
    //        var $html = $(html);
    //        $html.on('click',function(){
    //            window.open('http://wpa.qq.com/msgrd?v=3&uin=3023743034&Site=深圳十分到家服务科技有限公司&Menu=yes');
    //        });
    //        $('body').append($html);
    //    }
    //
    //}
    //var qqBox = new QQBox();
    //qqBox.init();

    // 故障选择
    function FaultSelect(){
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        this.brandUrl = haServiceUrl + 'repairBooking/findAllBbrand'; // 品牌
        this.modelUrl = haServiceUrl + 'repairBooking/findModelByBbrand'; // 型号
        this.faultUrl = haServiceUrl + 'repairBooking/findFaultByBmodel'; // 故障
        this.selectBrand = $('#select-brand');
        this.selectModel = $('#select-model');
        this.selectFault = $('#select-fault');
    }

    FaultSelect.prototype = {
        constructor: FaultSelect,
        init: function () {
            var self = this;
            self.loadBrand();
            this.bind();
        },

        // 加载品牌
        loadBrand: function (brandName, callback) {

            var self = this;
            var insetBrand = function (res) {
                var items = [];
                items.push('<option value ="0">品牌</option>');
                $.each(res.data, function (i, value) {
                    var selected = '';

                    if (value === brandName) {
                        selected = ' selected';
                    }

                    items.push('<option value ="' + value + '"' + selected + '>' + value + '</option>')
                });

                self.selectBrand.html(items.join(''));

                if (typeof callback === 'function') {
                    callback();
                }
            };

            if ('brand' in cacheXhrData) {
                insetBrand(cacheXhrData['brand']);
                return;
            }

            $ajax({
                url: self.brandUrl,
                success: function (res) {
                    cacheXhrData['brand'] = res;
                    insetBrand(res);
                }
            });

        },

        // 加载型号
        loadModel: function (data, modelId, callback) {
            var self = this;
            var insetModel = function (res) {
                var items = [];
                items.push('<option value ="0">型号</option>');
                $.each(res.data, function (i, value) {
                    var selected = '';

                    if (value.bmodelId == modelId) {
                        selected = ' selected';
                    }

                    items.push('<option value ="' + value.bmodelId + '"' + selected + '>' + value.bmodelName + '</option>')
                });

                self.selectModel.html(items.join(''));

                if (typeof callback === 'function') {
                    callback();
                }
            };

            if ('model_' + data.bBrandName in cacheXhrData) {
                insetModel(cacheXhrData['model_' + data.bBrandName]);
                return;
            }

            $ajax({
                url: self.modelUrl,
                data: data,
                success: function (res) {
                    cacheXhrData['model_' + data.bBrandName] = res;
                    insetModel(res);
                }
            });
        },

        // 加载故障
        loadFault: function (data, faultId, callback) {
            var self = this;
            var insetFault = function (res) {
                var items = [];
                items.push('<option value="0">故障</option>');
                $.each(res.data, function (i, value) {
                    var selected = '';

                    if (value.bfaultId == faultId) {
                        selected = ' selected';
                    }

                    items.push('<option value="' + value.bfaultId + '"' + selected + '>' + value.bfaultName + '</option>')
                });
                items.push('<option value="其它故障">其它故障</option>');
                self.selectFault.html(items.join(''));

                if (typeof callback === 'function') {
                    callback();
                }
            };

            if ('fault_' + data.bModelId in cacheXhrData) {
                insetFault(cacheXhrData['fault_' + data.bModelId]);
                return;
            }

            $ajax({
                url: self.faultUrl,
                data: data,
                success: function (res) {
                    cacheXhrData['fault_' + data.bModelId] = res;
                    insetFault(res);
                }
            });
        },

        // 设置默认故障
        setDefaultFault: function (brandName, modelId, faultId) {
            var self = this;
            self.loadBrand(brandName, function () {
                self.loadModel({bBrandName: brandName}, modelId, function () {
                    self.loadFault({bModelId: modelId}, faultId);
                })
            })
        },

        // 绑定事件
        bind: function(){
            var self = this;

            self.selectBrand.on('change', function () {
                var $this = $(this);
                var brandName = $this.val();

                if (brandName === '0') {
                    self.selectModel.html('<option value ="0">型号</option>');
                } else {
                    self.loadModel({bBrandName: brandName});
                }

                self.selectFault.html('<option value ="0">故障</option>');

            });

            self.selectModel.on('change', function () {
                var $this = $(this);
                var modelId = $this.val();

                if (modelId === '0') {
                    self.selectFault.html('<option value ="0">故障</option>');
                } else {
                    self.loadFault({bModelId: modelId});
                }

            });

        }
    };

    // 城市选择
    function CitySelect() {
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        this.provinceUrl = haUrl.address.province; // 省
        this.cityUrl = haUrl.address.city; // 市
        this.areaUrl = haUrl.address.area; // 区
        this.cityServiceUrl = haServiceUrl + 'repair/site/findSiteByCity'; // 城市服务地址
        this.selectProvince = $('#select-province');
        this.selectCity = $('#select-city');
        this.selectArea = $('#select-area');

    }

    CitySelect.prototype = {
        constructor: CitySelect,
        init: function(){
            this.loadProvince();
            this.bind();
        },

        // 加载省份
        loadProvince: function (data) {
            var self = this;
            var _data = data || {};

            $ajax({
                url: self.provinceUrl,
                data: _data,
                success: function (res) {
                    var items = [];
                    items.push('<option value ="0">省</option>');
                    $.each(res.data, function (i, value) {
                        items.push('<option value ="' + value.provinceId + '">' + value.provinceName + '</option>')
                    });

                    self.selectProvince.html(items.join(''));

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

            $ajax({
                url: self.cityUrl,
                data: _data,
                success: function (res) {
                    var items = [];
                    items.push('<option value ="0">市</option>');
                    $.each(res.data, function (i, value) {
                        items.push('<option value ="' + value.cityId + '">' + value.cityName + '</option>')
                    });

                    self.selectCity.html(items.join(''));

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

            $ajax({
                url: self.areaUrl,
                data: _data,
                success: function (res) {
                    var items = [];
                    items.push('<option value ="0">区</option>');
                    $.each(res.data, function (i, value) {
                        items.push('<option value ="' + value.areaId + '">' + value.areaName + '</option>')
                    });

                    self.selectArea.html(items.join(''));

                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        },

        loadServiceAddress: function (cityName) {
            var self = this;
            var serviceAddressEle = $('#service-address');

            var hide = function(){
                serviceAddressEle.html('').hide();
            };

            if (cityName === '') {
                hide();
                return
            }

            $ajax({
                url: self.cityServiceUrl,
                data: {
                    cityName: cityName
                },
                success: function (res) {
                    var data = res.data;
                    var html = '';

                    if (Array.isArray(data) && data.length) {

                        html += '售后处理中心：' + data[0].siteAddress;

                        if (data[0].ondoorArea) {
                            html += '<br>服务区域：' + data[0].ondoorArea;
                        }

                        serviceAddressEle.html(html).show();
                    } else {
                        hide();
                    }

                },
                error: function(){
                    hide();
                }
            });

        },

        // 绑定事件
        bind: function(){
            var self = this;

            self.selectProvince.on('change', function () {
                var $this = $(this);
                var id = $this.val();
                var provinceName = $this.find("option:selected").text();

                if (id === '0') {
                    self.selectCity.html('<option value ="0">市</option>');
                } else {
                    self.loadCity({provinceName: provinceName});
                }

                //self.selectArea.html('<option value ="0">区</option>');

            });

            self.selectCity.on('change', function () {
                var $this = $(this);
                //var id = $this.val();
                var cityName = $this.find("option:selected").text();

                //if (id === '0') {
                //    cityName = '';
                //    self.selectArea.html('<option value ="0">区</option>');
                //} else {
                //    self.loadArea({cityId: id});
                //}

                self.loadServiceAddress(cityName);
            });

        }
    };

    var citySelect = new CitySelect();
    citySelect.init();

    // 故障列表
    function FaultList() {
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        this.container = $('#fault-cont');
        this.brandName = '';
        this.modelId = '';
        this.brandUrl = haServiceUrl + 'repairBooking/findAllBbrand'; // 品牌
        this.modelUrl = haServiceUrl + 'repairBooking/findModelByBbrand'; // 型号
        this.faultUrl = haServiceUrl + 'repairBooking/findFaultByBmodel'; // 故障
        this.brandTpl = '';
        this.modelTpl = '';
        this.faultTpl = '';
    }

    FaultList.prototype = {
        constructor: FaultList,

        // 初始化
        init: function () {

            var self = this;

            self.loadBrand(function () {
                self.loadModel({bBrandName: self.brandName}, function () {
                    self.loadFault({bModelId: self.modelId});
                });
            });

            this.bind();
        },

        // 加载品牌
        loadBrand: function (callback) {

            var self = this;

            if (self.brandTpl === '') {
                self.brandTpl = $('#brand-tpl').html();
            }

            var insetBrand = function(res){
                var render = template.compile(self.brandTpl);
                var html = render({list: res.data});
                self.brandName = res.data[0];
                self.container.find('.brand-list').html(html);

                if (typeof callback === 'function') {
                    callback();
                }
            };

            if ('brand' in cacheXhrData) {
                insetBrand(cacheXhrData['brand']);
                return;
            }

            $ajax({
                url: self.brandUrl,
                data: {},
                success: function (res) {
                    cacheXhrData['brand'] = res;
                    insetBrand(res);
                }
            });

        },

        // 加载型号
        loadModel: function (data, callback) {
            var self = this;
            var insetModel = function (res) {
                var render = template.compile(self.modelTpl);
                var html = render({list: res.data});
                self.modelId = res.data[0].bmodelId;
                self.container.find('.model-list').html(html);

                if (typeof callback === 'function') {
                    callback();
                }
            };

            if (self.modelTpl === '') {
                self.modelTpl = $('#model-tpl').html();
            }

            if ('model_' + data.bBrandName in cacheXhrData) {
                insetModel(cacheXhrData['model_' + data.bBrandName]);
                return;
            }

            $ajax({
                url: self.modelUrl,
                data: data,
                success: function (res) {
                    cacheXhrData['model_' + data.bBrandName] = res;
                    insetModel(res);
                }
            });
        },

        // 加载故障
        loadFault: function (data, callback) {
            var self = this;
            var insetFault = function (res) {
                var render = template.compile(self.faultTpl);
                var html = render({list: res.data});
                self.container.find('.fault-list').html(html);

                if (typeof callback === 'function') {
                    callback();
                }
            };

            if (self.faultTpl === '') {
                self.faultTpl = $('#fault-tpl').html();
            }

            if ('fault_' + data.bModelId in cacheXhrData) {
                insetFault(cacheXhrData['fault_' + data.bModelId]);
                return;
            }

            $ajax({
                url: self.faultUrl,
                data: data,
                success: function (res) {
                    cacheXhrData['fault_' + data.bModelId] = res;
                    insetFault(res);
                }
            });
        },

        // 设置默认故障
        setDefaultFault: function (brandName, modelId, faultId) {
            throw new Error('实例化后需重写“setDefaultFault”方法');
        },

        // 绑定事件
        bind: function () {
            var self = this;
            var container = this.container;

            // 绑定产品品牌事件 - 点击后显示型号
            container.find('.brand-list').on('click', 'li', function () {
                var $this = $(this);
                var brandName = $this.data('brandName');
                $this.addClass('active').siblings('li').removeClass('active');
                self.brandName = $(this).data('brandName');
                self.loadModel({bBrandName: brandName}, function () {
                    self.loadFault({bModelId: self.modelId});
                });
            });

            // 绑定产品型号事件 - 点击后显示相应的故障
            container.find('.model-list').on('click', 'li', function () {
                var $this = $(this);
                var modelId = $this.data('modelId');
                $this.addClass('active').siblings('li').removeClass('active');
                self.modelId = modelId;
                self.loadFault({bModelId: modelId});
            });

            // 绑定预约事件 - 点击后在预约界面显示相应的默认值
            container.find('.fault-list').on('click', '.btn', function () {
                var $this = $(this);
                var faultId = $this.data('faultId');
                $this.parents('ul').find('.btn').removeClass('active');
                $this.addClass('active');
                self.setDefaultFault(self.brandName, self.modelId, faultId);
                $(document).scrollTop($('#map-form').offset().top);
            });

        }
    };


    var faultList = new FaultList();
    var faultSelect = new FaultSelect();

    faultList.setDefaultFault = function(brandName, modelId, faultId){
        faultSelect.setDefaultFault(brandName, modelId, faultId);
    };

    faultList.init();
    faultSelect.init();

    //(function(){
    //    var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
    //    document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fc8ddb8cdc2bb92fb9f230383477af66a' type='text/javascript'%3E%3C/script%3E"));
    //})();
})(window,jQuery);