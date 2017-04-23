/**
 * Created by Administrator on 2016/8/24.
 */
(function(win,$){

    var cacheXhrData = {}; // ajax请求缓存在这里面

    // 二次封装ajax
    function $ajax(options){

        var method = options.method || 'POST',
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
            this.bind();
            this.vcodeInit();
        },
        initForm : function(){
            var $form = this.form;
            $form.find('[name="phoneClass"]').val(0);
            $form.find('[name="phoneFault"]').val(0);
            $form.find('[name="name"]').val('');
            $form.find('[name="phoneNumber"]').val('');
            $form.find('[name="verCode"]').val('');
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
            var phoneClass = $form.find('[name="phoneClass"]').val();
            layer.closeAll();
            if(phoneClass == 0){
                layer.tips('请选择设备信息', '.js-form-subscribe [name="phoneClass"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            var phoneFault = $form.find('[name="phoneFault"]').val();
            if(phoneFault == 0){
                layer.tips('请选择设备故障', '.js-form-subscribe [name="phoneFault"]', {
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
            var code = $form.find('[name="verCode"]').val();
            if(UtilBase.isEmpty(code)){
                layer.tips('请输入验证码', '.js-form-subscribe [name="verCode"]', {
                    tips: [1, '#f00']
                });
                return false;
            }
            return true;

        },
        submit : function(){
            var _self = this;
            var $form = this.form;
            var phoneClass = $form.find('[name="phoneClass"]').val();
            var phoneFault = $form.find('[name="phoneFault"]').val();
            var userAppellation = $form.find('[name="name"]').val();
            var phoneNum = $form.find('[name="phoneNumber"]').val();
            var code = $form.find('[name="verCode"]').val();
            var bookingNote = phoneClass + ':' + phoneFault;
            var url = _self.formAction;
            var param = {
                userAppellation : userAppellation,
                phoneNum : phoneNum,
                code : code,
                bookingNote : bookingNote,
                bookingDesc : '手机维修',
                sourceType : 1,
                pageType : 1
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
                        $('.fixed-mask-layer').trigger('click');
                    }
                },
                error: function (xhr) {
                    layer.alert('发送请求失败', 9);

                }
            });
        }
    }
    var reserveForm = new ReserveForm();
    reserveForm.init();

    $(function(){
        $('.js-btn-open-form').on('click',function(){
            //$('.fixed-bottom-form').show();
            $('.fixed-mask-layer').show();
            $('.fixed-bottom-form').slideDown(200);
        });
        $('.fixed-mask-layer').on('click',function(){
            $('.fixed-bottom-form').slideUp('slow');
            $(this).hide();
        });
    });

    //function QQBox(){
    //
    //}
    //QQBox.prototype = {
    //    init : function(){
    //        this.updateHmlToUi();
    //    },
    //    createHtml : function(){
    //        var html = '<div style="position: fixed;right: 0;bottom: 30%;width: 2em;padding : 0.2rem 0.5em;' +
    //            'color:#ffffff;font-size: 1.2rem;background-color: rgba(0,0,0,0.4);text-align: center;">Q<br>Q咨询</div>';
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
            //container.find('.fault-list').on('click', '.btn', function () {
            //    var faultId = $(this).data('faultId');
            //    self.setDefaultFault(self.brandName, self.modelId, faultId);
            //    $(document).scrollTop($('#map-form').offset().top);
            //});

        }
    };

    var faultList = new FaultList();
    faultList.init();

    //(function(){
    //    var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
    //    document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fc8ddb8cdc2bb92fb9f230383477af66a' type='text/javascript'%3E%3C/script%3E"));
    //})();

})(window,jQuery);