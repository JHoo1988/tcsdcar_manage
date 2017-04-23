// wash.js
(function () {


    // 是否为空，或只输入了空白符
    function isEmpty(value) {
        if (value === '' || !value) {
            return true;
        }
        return /^\s+$/.test(value);
    }

    // 是否为手机号码
    function isMobile(value) {
        return /^1[34578]\d{9}$/.test(value);
    }

    /**
     * emoji表情转换为字符
     * @param {string} str emoji表情
     */
    function emoji2Str(str) {
        return unescape(escape(str).replace(/\%uD(.{3})/g, '*'));
    }


    // 校验预约表单参数
    function checkBookingFormParam($form) {
        var userAppellation = $form.find('input[name=name]'); // 姓名
        var userAppellationVal = userAppellation.val();
        var phoneNum = $form.find('input[name=phone]'); // 联系电话
        var phoneNumVal = phoneNum.val();
        var province = $form.find('select[name=province]'); // 省
        var provinceValue = province.val();
        var city = $form.find('select[name=city]'); // 市
        var cityVal = city.val();
        var pinlei = $form.find('select[name=pinlei]'); // 加盟业务
        var pinleiVal = pinlei.val();
        var gy = $form.find('select[name=gy]'); // 是否十分到家现有供应商
        var gyVal = gy.val();

        if (isEmpty(userAppellationVal)) {
            phoneNum.focus();
            layer.tips('姓名不能为空', '.name-value', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(phoneNumVal)) {
            phoneNum.focus();
            layer.tips('手机号不能为空', '.phone-value', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (!isMobile(phoneNumVal)) {
            phoneNum.focus();
            layer.tips('手机号码不正确', '.phone-value', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(provinceValue) || provinceValue == 0) {
            province.focus();
            layer.tips('请选择省', '.province-value', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(cityVal) || cityVal == 0) {
            city.focus();
            layer.tips('请选择市', '.city-value', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(pinleiVal) || pinleiVal == 0) {
            layer.tips('请选择加盟业务', '.pinlei-value', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(gyVal) || gyVal == -1) {
            layer.tips('请选择是否十分到家现有供应商', '.gy-value', {
                tips: [1, '#f00']
            });
            return false;
        }
        return true;
    }

    // 提交预约表单
    function submitBookingForm() {
        var self = this;
        var $form = $('.content-right');
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        var bookingUrl = haServiceUrl + 'investment/regWashInvestment';

        if (!checkBookingFormParam($form)) {
            return;
        }

        var province = $form.find('[name="province"]').find("option:selected").text();
        var city = $form.find('[name="city"]').find("option:selected").text();
        var userAppellation = $form.find('[name="name"]').val();
        var phoneNum = $form.find('[name="phone"]').val();
        var company = $form.find('[name="company"]').val();
        var remark = $form.find('[name="remark"]').val();
        var isInternal = $form.find('[name="gy"]').find("option:selected").val();
        var joinBusiness = $form.find('[name="pinlei"]').find("option:selected").text();
        var param = {
            userName: emoji2Str(userAppellation),
            userMobile: phoneNum,
            province: province,
            city: city,
            isInternal: isInternal,
            company: company,
            remark: remark,
            joinBusiness: joinBusiness
        };

        $.ajax({
            type: 'POST',
            url: bookingUrl,
            data: param,
            dataType: 'JSON',
            success: function (res) {
                if (res.flag != 'success') {
                    layer.alert(res.msg, 9);
                } else {
                    layer.alert('预约成功，客服稍后将会与您取得联系', 9);
                    $form[0].reset();
                    initForm();
                }
            },
            error: function (xhr) {
                layer.alert('发送请求失败', 9);

            }
        });
    }


    // 绑定事件 - 提交预约表单
    $('.submit').on('click', function () {
        submitBookingForm();
    });

    function initForm(){
        var $form = $('.content-right');
        // $form.find('[name="province"]').val(0);
        // $form.find('[name="city"]').val(0);
        // $form.find('[name="name"]').val('');
        // $form.find('[name="phone"]').val('');
        // $form.find('[name="company"]').val('');
        // $form.find('[name="remark"]').val('');
        // $form.find('[name="gy"]').val(-1);
        // $form.find('[name="pinlei"]').val(0);
        $('#showPinlei').html('请选择');
        $('#showGy').html('请选择');
        // $('#showProvince').html('请选择省份');
        $('#showCity').html('请选择城市');
    };

    function getLocationByIp(callback) {
        var url = 'http://api.map.baidu.com/location/ip?ak=aDgPHW92zhiGbbGBROPDvsQb';

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function (data) {
            console.log(data);
            var address = {};

            if (data.content && data.content.address_detail) {

                var city = data.content.address_detail.city || {};

                if (city && city != null && city != '') {
                    address = {
                        province: data.content.address_detail.province,
                        city: data.content.address_detail.city
                    };
                }

            }

            callback(address)

        }).fail(function () {
            callback();
        });

        return this;
    }

    getLocationByIp(function (address) {
        var citySelect = new CitySelect(address);
        citySelect.init();
    });

}());