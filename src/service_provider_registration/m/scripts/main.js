// wash.js
(function () {


    var bookingDesc = []; // 预约描述

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

    // 校验登记表单参数
    function checkRegistrationFormParam($form) {
        var userName = $form.find('input[name=userName]'); // 姓名
        var userNameVal = userName.val();
        var userMobile = $form.find('input[name=userMobile]'); // 联系电话
        var userMobileVal = userMobile.val();
        var province = $form.find('select[name=province]'); // 省
        var provinceValue = province.val();
        var city = $form.find('select[name=city]'); // 市
        var cityVal = city.val();
        var joinBusiness = $form.find('[name=joinBusiness]'); // 加盟业务
        var joinBusinessVal = joinBusiness.val();
        var isInternal = $form.find('[name=isInternal]'); // 是否十分到家现有服务商
        var isInternalVal = isInternal.val();
        var company = $form.find('input[name=company]'); // 公司名称
        var companyVal = company.val();

        if (isEmpty(userNameVal)) {
            //userName.focus();
            layer.msg('姓名不能为空');
            //layer.tips('姓名不能为空', '.form-name', {
            //    tips: [1, '#f00']
            //});
            return false;
        }

        if (/[`~!@#$%^&*_+<>{}\/'[\]]|\s/.test(userNameVal) || /\%uD(.{3})/.test(userNameVal)) {
            //userName.focus();
            layer.msg('姓名不能包含特殊字符和空格');
            return false;
        }

        if (isEmpty(userMobileVal)) {
            //userMobile.focus();
            layer.msg('手机号不能为空');
            //layer.tips('手机号不能为空', '.form-mobile', {
            //    tips: [1, '#f00']
            //});
            return false;
        }

        if (!isMobile(userMobileVal)) {
            //userMobile.focus();
            layer.msg('手机号码不正确');
            //layer.tips('手机号码不正确', '.form-mobile', {
            //    tips: [1, '#f00']
            //});
            return false;
        }

        if (isEmpty(provinceValue) || provinceValue == 0) {
            //province.focus();
            layer.msg('请选择省');
            //layer.tips('请选择省', '.form-province', {
            //    tips: [1, '#f00']
            //});
            return false;
        }

        if (isEmpty(cityVal) || cityVal == 0) {
            //city.focus();
            layer.msg('请选择市');
            //layer.tips('请选择市', '.form-city', {
            //    tips: [1, '#f00']
            //});
            return false;
        }

        if (isEmpty(joinBusinessVal) || joinBusinessVal == -1) {
            //joinBusiness.focus();
            layer.msg('请选择加盟业务');
            //layer.tips('请选择加盟业务', '.form-joinBusiness', {
            //    tips: [1, '#f00']
            //});
            return false;
        }

        if (isEmpty(isInternalVal) || isInternalVal == -1) {
            //isInternal.focus();
            layer.msg('请选择是否十分到家现有服务商');
            //layer.tips('请选择是否十分到家现有服务商', '.form-isInternal', {
            //    tips: [1, '#f00']
            //});
            return false;
        }

        //if (isEmpty(companyVal)) {
        //    //company.focus();
        //    layer.msg('公司名称不能为空');
        //    //layer.tips('公司名称不能为空', '.form-company', {
        //    //    tips: [1, '#f00']
        //    //});
        //    return false;
        //}

        return true;
    }

    // 提交登记表单
    function submitRegistrationForm() {
        var $form = $('#registration-form');
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        var registrationUrl = haServiceUrl + 'investment/regWashInvestment';

        if (!checkRegistrationFormParam($form)) {
            return;
        }

        var province = $form.find('[name="province"]').find("option:selected").text();
        var city = $form.find('[name="city"]').find("option:selected").text();
        var address = $form.find('[name="address"]').val();
        var userName = $form.find('[name="userName"]').val();
        var userMobile = $form.find('[name="userMobile"]').val();
        var company = $form.find('[name="company"]').val();   // 公司名
        var remark = $form.find('[name="remark"]').val();   // 邮箱或者备注
        var joinBusiness = $form.find('[name="joinBusiness"]').val();   // 加盟业务
        var isInternal = $form.find('[name="isInternal"]').val();   // 是否十分到家服务商 （0：是， 1：否）
        var param = {
            userName: emoji2Str(userName),
            userMobile: userMobile,
            province: province,
            city: city,
            isInternal: isInternal,
            company: emoji2Str(company),
            remark: emoji2Str(remark),
            joinBusiness: joinBusiness
        };

        $.ajax({
            type: 'POST',
            url: registrationUrl,
            data: param,
            dataType: 'JSON',
            success: function (res) {
                if (res.flag != 'success') {
                    layer.alert(res.msg, 9);
                } else {
                    layer.alert('报名成功，客服稍后将会与您取得联系', 9);
                    $form[0].reset();

                    // 清除已选中的省份和城市
                    $form.find('[name="province"]').val(0);
                    $form.find('[name="city"]').html('<option value ="0">市</option>');
                }
            },
            error: function () {
                layer.alert('发送请求失败', 9);

            }
        });
    }


    // 绑定事件 - 提交登记表单
    $('#js-submit-registration-form').on('click', function () {
        submitRegistrationForm();
    });


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