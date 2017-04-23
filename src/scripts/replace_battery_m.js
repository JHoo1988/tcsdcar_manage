/**
 * Created by lenovo on 2016/11/14.
 */
(function (win, $) {

    // 启动QQ
    $('.qq_talk').on('click', function () {
        window.open('http://wpa.qq.com/msgrd?v=3&uin=1556229553&Site=深圳十分到家服务科技有限公司&Menu=yes');
    });
    // 启动客服
    $('.kf_talk').on('click', function () {
        window.open('http://125.93.53.91:31337/app/chat.html?appname=tenant_sfdj&menukey=5');
    });

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
            $form.find('[name="model"]').val(0);
            $form.find('[name="fault"]').val(0);
            $form.find('[name="province"]').val(0);
            $form.find('[name="city"]').val(0);
            // $form.find('[name="area"]').val(0);
            $form.find('[name="address"]').val('');
            $form.find('[name="name"]').val('');
            $form.find('[name="phoneNumber"]').val('');
            $('#service-address').html('').hide();
            $('#showxh').html('型号');
            // $('#showgz').html('故障');
            $('#showProvince').html('省');
            $('#showCity').html('市');
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
            layer.closeAll();
            var model = $form.find('[name="model"]').val();
            if(model === '0'){
                layer.tips('请选择型号', '.js-form-subscribe [name="model"]', {
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
            var model = $form.find('[name="model"]').find("option:selected").text();
            var province = $form.find('[name="province"]').find("option:selected").text();
            var city = $form.find('[name="city"]').find("option:selected").text();
            //var area = $form.find('[name="area"]').find("option:selected").text();
            var address = $form.find('[name="address"]').val();
            var userAppellation = $form.find('[name="name"]').val();
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            var bookingNote = '手机型号：iPhone/' + model + ';' +'故障说明：手机换电池';   // 故障说明
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
                sendMsg: 1, //  发送短信：0-不发，1-发
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
                        $('.close_dialog').click();
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

    // $('#gz').on('change', function () {
    //     var $this = $(this);
    //     var showgz = $this.find("option:selected").text();
    //     $('#showgz').html(showgz);
    // });
    $('#xh').on('change', function () {
        var $this = $(this);
        var showgz = $this.find("option:selected").text();
        $('#showxh').html(showgz);
    });

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

        this.showProvince = $('#showProvince');
        this.showCity = $('#showCity');

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

            var hide = function () {
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
                error: function () {
                    hide();
                }
            });

        },

        // 绑定事件
        bind: function () {
            var self = this;

            self.selectProvince.on('change', function () {
                var $this = $(this);
                var id = $this.val();
                var provinceName = $this.find("option:selected").text();
                showProvince.innerHTML = provinceName;
                if (id === '0') {
                    self.selectCity.html('<option value ="0">市</option>');
                } else {
                    self.loadCity({provinceName: provinceName},function () {
                        $('#showCity').html('市');
                    });
                }

                //self.selectArea.html('<option value ="0">区</option>');

            });

            self.selectCity.on('change', function () {
                var $this = $(this);
                //var id = $this.val();
                var cityName = $this.find("option:selected").text();
                showCity.innerHTML = cityName;
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


    $('.online_book').on('click',function(){
        //$('.fixed-bottom-form').show();
        $('.fixed-mask-layer').show();
        $('.close_dialog').show();
        $('.fixed-bottom-form').slideDown(200);
    });
    $('.fixed-mask-layer').on('click',function(){
        $('.fixed-bottom-form').slideUp('fast');
        $('.close_dialog').hide();
        $(this).hide();
    });
    $('.close_chat').on('click',function(){
        $('.customerservice').css('display','none');
    });
    $('.close_dialog').on('click',function(){
        $('.fixed-bottom-form').slideUp('fast');
        $('.fixed-mask-layer').hide();
        $(this).hide();
    });
})(window, jQuery);