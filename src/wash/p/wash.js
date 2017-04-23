// wash.js
(function () {

    // 启动QQ
    $('.qq_talk').on('click', function () {
        window.open('http://wpa.qq.com/msgrd?v=3&uin=1556229553&Site=深圳十分到家服务科技有限公司&Menu=yes');
    });
    // 启动客服
    $('.kf_talk').on('click', function () {
        window.open('http://125.93.53.91:31337/app/chat.html?appname=tenant_sfdj&menukey=1');
    });
    // // 回表单
    // $('.go_hp').on('click', function () {
    //     $("html,body").animate({scrollTop: "70%"}, 200);
    // });
    // 回顶部
    $('.go_top').on('click', function () {
        $("html,body").animate({scrollTop: "0px"}, 200);
    });
    $(".connect").mouseover(function () {
        $(this).css("cursor", "pointer");
    });
    $(".connect").mouseout(function () {
        $(this).css("cursor", "default");
    });

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

    // 是否为已选择的服务
    function isSelectedService(serviceName) {
        return bookingDesc.indexOf(serviceName) !== -1;
    }

    // 根据名称移除一个预约描述项
    function removeBookingDescItem(serviceName) {
        var index = bookingDesc.indexOf(serviceName);
        if (index !== -1) {
            bookingDesc.splice(index, 1);
        }
    }

    /**
     * emoji表情转换为字符
     * @param {string} str emoji表情
     */
    function emoji2Str(str) {
        return unescape(escape(str).replace(/\%uD(.{3})/g, '*'));
    }

    // 更新预约服务的数量
    function updateBookingServiceNum() {
        var num = bookingDesc.length;
        var shopCartNum = $('.shop-cart-num');
        var badge = shopCartNum.find('.product-num');
        badge.text(num);
    }

    // 更新预约服务列表视图
    function updateBookingServiceListView() {

        // 表单服务视图
        $('.section-product-list2 img').each(function () {
            var $this = $(this);
            var item = $this.parents('div');
            var serviceName = item.data('serviceName');

            if (isSelectedService(serviceName)) {
                // $this.addClass('selected');
                if (serviceName=="油烟机清洗"){
                    $this.attr('src', __inline('images/pic1_selected.jpg'));
                }else if (serviceName=="波轮洗衣机清洗"){
                    $this.attr('src', __inline('images/pic2_selected.jpg'));
                }else if (serviceName=="空调挂机清洗"){
                    $this.attr('src', __inline('images/pic3_selected.jpg'));
                }else if (serviceName=="普通冰箱清洗"){
                    $this.attr('src', __inline('images/pic4_selected.jpg'));
                }else if (serviceName=="空调柜机清洗"){
                    $this.attr('src', __inline('images/pic5_selected.jpg'));
                }else if (serviceName=="油烟机拆洗"){
                    $this.attr('src', __inline('images/pic6_selected.jpg'));
                }else if (serviceName=="波轮洗衣机拆洗"){
                    $this.attr('src', __inline('images/pic7_selected.jpg'));
                }else if (serviceName=="对门冰箱清洗"){
                    $this.attr('src', __inline('images/pic8_selected.jpg'));
                }else if (serviceName=="热水器清洗"){
                    $this.attr('src', __inline('images/pic9_selected.jpg'));
                }else if (serviceName=="整体厨房清洗"){
                    $this.attr('src', __inline('images/pic10_selected.jpg'));
                }
            } else {
                // $this.removeClass('selected');
                if (serviceName=="油烟机清洗"){
                    $this.attr('src', __inline('images/pic1.jpg'));
                }else if (serviceName=="波轮洗衣机清洗"){
                    $this.attr('src', __inline('images/pic2.jpg'));
                }else if (serviceName=="空调挂机清洗"){
                    $this.attr('src', __inline('images/pic3.jpg'));
                }else if (serviceName=="普通冰箱清洗"){
                    $this.attr('src', __inline('images/pic4.jpg'));
                }else if (serviceName=="空调柜机清洗"){
                    $this.attr('src', __inline('images/pic5.jpg'));
                }else if (serviceName=="油烟机拆洗"){
                    $this.attr('src', __inline('images/pic6.jpg'));
                }else if (serviceName=="波轮洗衣机拆洗"){
                    $this.attr('src', __inline('images/pic7.jpg'));
                }else if (serviceName=="对门冰箱清洗"){
                    $this.attr('src', __inline('images/pic8.jpg'));
                }else if (serviceName=="热水器清洗"){
                    $this.attr('src', __inline('images/pic9.jpg'));
                }else if (serviceName=="整体厨房清洗"){
                    $this.attr('src', __inline('images/pic10.jpg'));
                }
            }

        });


        // 表单服务视图
        $('.service-list img').each(function () {
            var $this = $(this);
            var serviceName = $this.context.alt;

            if (isSelectedService(serviceName)) {
                if (serviceName=="油烟机清洗"){
                    $this.attr('src', __inline('images/tap1.png'));
                }else if (serviceName=="波轮洗衣机清洗"){
                    $this.attr('src', __inline('images/tap3.png'));
                }else if (serviceName=="空调挂机清洗"){
                    $this.attr('src', __inline('images/tap5.png'));
                }else if (serviceName=="普通冰箱清洗"){
                    $this.attr('src', __inline('images/tap7.png'));
                }else if (serviceName=="空调柜机清洗"){
                    $this.attr('src', __inline('images/tap9.png'));
                }else if (serviceName=="油烟机拆洗"){
                    $this.attr('src', __inline('images/tap11.png'));
                }else if (serviceName=="波轮洗衣机拆洗"){
                    $this.attr('src', __inline('images/tap13.png'));
                }else if (serviceName=="对门冰箱清洗"){
                    $this.attr('src', __inline('images/tap15.png'));
                }else if (serviceName=="热水器清洗"){
                    $this.attr('src', __inline('images/tap17.png'));
                }else if (serviceName=="整体厨房清洗"){
                    $this.attr('src', __inline('images/tap19.png'));
                }
            } else {
                if (serviceName=="油烟机清洗"){
                    $this.attr('src', __inline('images/tap2.png'));
                }else if (serviceName=="波轮洗衣机清洗"){
                    $this.attr('src', __inline('images/tap4.png'));
                }else if (serviceName=="空调挂机清洗"){
                    $this.attr('src', __inline('images/tap6.png'));
                }else if (serviceName=="普通冰箱清洗"){
                    $this.attr('src', __inline('images/tap8.png'));
                }else if (serviceName=="空调柜机清洗"){
                    $this.attr('src', __inline('images/tap10.png'));
                }else if (serviceName=="油烟机拆洗"){
                    $this.attr('src', __inline('images/tap12.png'));
                }else if (serviceName=="波轮洗衣机拆洗"){
                    $this.attr('src', __inline('images/tap14.png'));
                }else if (serviceName=="对门冰箱清洗"){
                    $this.attr('src', __inline('images/tap16.png'));
                }else if (serviceName=="热水器清洗"){
                    $this.attr('src', __inline('images/tap18.png'));
                }else if (serviceName=="整体厨房清洗"){
                    $this.attr('src', __inline('images/tap20.png'));
                }
            }

        });

        updateBookingServiceNum();
    }

    // 校验预约表单参数
    function checkBookingFormParam($form) {
        var userAppellation = $form.find('input[name=name]'); // 姓名
        var userAppellationVal = userAppellation.val();
        var phoneNum = $form.find('input[name=phoneNumber]'); // 联系电话
        var phoneNumVal = phoneNum.val();
        var province = $form.find('select[name=province]'); // 省
        var provinceValue = province.val();
        var city = $form.find('select[name=city]'); // 市
        var cityVal = city.val();

        var area = $form.find('select[name=area]'); // 区
        var areaVal = city.val();
        var address = $form.find('input[name=address]'); // 具体的地址
        var addressVal = address.val();

        if (!bookingDesc.length) {
            layer.tips('请选择服务项目', '.service-list', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(provinceValue) || provinceValue == 0) {
            province.focus();
            layer.tips('请选择省', '.form-province', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(cityVal) || cityVal == 0) {
            city.focus();
            layer.tips('请选择市', '.form-city', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(areaVal) || areaVal == 0) {
            area.focus();
            layer.tips('请选择区', '.form-area', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(addressVal)) {
            address.focus();
            layer.tips('地址不能为空', '.form-address', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(userAppellationVal)) {
            phoneNum.focus();
            layer.tips('姓名不能为空', '.form-name', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(phoneNumVal)) {
            phoneNum.focus();
            layer.tips('手机号不能为空', '.form-mobile', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (!isMobile(phoneNumVal)) {
            phoneNum.focus();
            layer.tips('手机号码不正确', '.form-mobile', {
                tips: [1, '#f00']
            });
            return false;
        }

        return true;
    }

    // 提交预约表单
    function submitBookingForm() {
        var self = this;
        var $form = $('#booking-form');
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        var bookingUrl = haServiceUrl + 'userBooking/booking';

        if (!checkBookingFormParam($form)) {
            return;
        }

        var province = $form.find('[name="province"]').find("option:selected").text();
        var city = $form.find('[name="city"]').find("option:selected").text();
        var area = $form.find('[name="area"]').find("option:selected").text();
        var address = $form.find('[name="address"]').val();
        var userAppellation = $form.find('[name="name"]').val();
        var phoneNum = $form.find('[name="phoneNumber"]').val();
        var completeAddress = province + city + area + emoji2Str(address);   // 地址
        var param = {
            userAppellation: emoji2Str(userAppellation),
            phoneNum: phoneNum,
            address: completeAddress,
            bookingDesc: bookingDesc.join(','),
            sendMsg: 1, //  发送短信：0-不发，1-发
            sourceType: 1
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
                    bookingDesc = [];
                    updateBookingServiceListView();
                    $form[0].reset();
                }
            },
            error: function (xhr) {
                layer.alert('发送请求失败', 9);

            }
        });
    }

    // 绑定事件 - 选择服务(表单)
    $('.service-list img').on('click', function () {
        var $this = $(this);
        var serviceName = $this.context.alt;
        if (isSelectedService(serviceName)) {
            removeBookingDescItem(serviceName);
        } else {
            bookingDesc.push(serviceName);
        }

        // 更新预约服务列表视图
        updateBookingServiceListView();

    });

    // 绑定事件 - 选择服务
    $('.section-product-list2 img').on('click', function () {
        var $this = $(this);
        var item = $this.parents('div');
        var serviceName = item.data('serviceName');
        if (isSelectedService(serviceName)) {
            removeBookingDescItem(serviceName);
        } else {
            bookingDesc.push(serviceName);
        }

        console.log(bookingDesc.join(','));
        // 更新预约服务列表视图
        updateBookingServiceListView();
    });

    // 绑定事件 - 显示预约表单
    $('#js-show-booking-form').on('click', function () {
        $('#page-booking-form').slideDown(200);
    });

    // 绑定事件 - 关闭预约表单
    $('.close-dialog').on('click', function () {
        $('#page-booking-form').slideUp('fast');
    });

    // 绑定事件 - 提交预约表单
    $('#js-submit-booking-form').on('click', function () {
        submitBookingForm();
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
                        province: data.content.address_detail.province || '',
                        city: data.content.address_detail.city || '',
                        area: data.content.address_detail.street || ''
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