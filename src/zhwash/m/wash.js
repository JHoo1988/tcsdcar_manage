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
        var badge = shopCartNum.find('.badge');

        badge.text(num);

        if (num) {
            shopCartNum.addClass('selected');
        } else {
            shopCartNum.removeClass('selected');
        }
    }

    // 更新预约服务列表视图
    function updateBookingServiceListView() {
        // 表单服务视图
        $('.service-list .item').each(function () {
            var $this = $(this);
            var serviceName = $this.data('choose');

            if (isSelectedService(serviceName)) {
                $this.removeClass('hidden');
                $this.addClass('showselected');
            } else {
                $this.addClass('hidden');
                $this.removeClass('showselected');
            }
        });

        var addPlusImg = __inline('images/add+.png');
        var addImg = __inline('images/add.png');

        // 表单服务视图
        $('.section-product-list li').each(function () {
            var item = $(this);
            var img = item.find('.btn').find('img');
            var serviceName = item.data('serviceName');

            if (isSelectedService(serviceName)) {
                item.addClass('selected');
                img.attr('src', addPlusImg);
            } else {
                item.removeClass('selected');
                img.attr('src', addImg);
            }

        });

        // 表单服务视图
        $('.service-list span').each(function () {
            var $this = $(this);
            var serviceName = $this.text();

            if (isSelectedService(serviceName)) {
                $this.addClass('selected');
            } else {
                $this.removeClass('selected');
            }

        });
        updateBookingServiceNum();
        calculateTotalPrice();
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
        var areaVal = area.val();
        var address = $form.find('input[name=address]'); // 具体的地址
        var addressVal = address.val();

        if (!bookingDesc.length) {
            // layer.tips('请选择服务项目', '.service-list', {
            //     tips: [1, '#f00']
            // });
            layer.msg('请选择服务项目', { time: 1000 });
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
            layer.tips('请填写详细地址', '.form-address', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(userAppellationVal)) {
            phoneNum.focus();
            layer.tips('请填写姓名', '.form-name', {
                tips: [1, '#f00']
            });
            return false;
        }

        if (isEmpty(phoneNumVal)) {
            phoneNum.focus();
            layer.tips('请填写手机号', '.form-mobile', {
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
        var desc = getBookingDesc();
        var gjcode = $form.find('[name="gjcode"]').val();
        if (gjcode){
            desc.push('推荐码：'+gjcode);
        }
        var notice = $form.find('[name="notice"]').val();
        if (notice){
            desc.push('备注：'+notice);
        }
        var param = {
            userAppellation: emoji2Str(userAppellation),
            phoneNum: phoneNum,
            address: completeAddress,
            // bookingDesc: bookingDesc.join(','),
            bookingDesc:'家电清洗',
            bookingNote: desc.join('/'),
            // remark: desc.join('/'),
            sendMsg: 1, //  发送短信：0-不发，1-发
            sourceType: 629//中海物业来源
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
                    // layer.alert('预约成功，客服稍后将会与您取得联系', 9,function () {
                    //     bookingDesc = [];
                    //     updateBookingServiceListView();
                    //     $form[0].reset();
                    //     $('#page-booking-form').fadeOut();
                    //     layer.closeAll();
                    // });
                    layer.open({
                        content: '预约成功，客服稍后将会与您取得联系'
                        ,btn: ['确定']
                        ,yes: function(index, layero){
                            //按钮【按钮一】的回调
                            bookingDesc = [];
                            updateBookingServiceListView();
                            $form[0].reset();
                            $('#page-booking-form').fadeOut();
                            layer.closeAll();
                        }
                        ,cancel: function(){
                            //右上角关闭回调
                            bookingDesc = [];
                            updateBookingServiceListView();
                            $form[0].reset();
                            $('#page-booking-form').fadeOut();
                            layer.closeAll();
                            //return false 开启该代码可禁止点击该按钮关闭
                        }
                    });
                }
            },
            error: function (xhr) {
                layer.alert('发送请求失败', 9);

            }
        });
    }

    // // 绑定事件 - 选择服务(表单)
    // $('.service-list span').on('click', function () {
    //     var $this = $(this);
    //     var serviceName = $this.text();
    //
    //     if (isSelectedService(serviceName)) {
    //         removeBookingDescItem(serviceName);
    //     } else {
    //         bookingDesc.push(serviceName);
    //     }
    //
    //     // 更新预约服务列表视图
    //     updateBookingServiceListView();
    //
    // });
    // 增加数量
    $('.addnum').on('click',function () {
        var $this = $(this);
        var p= $this.parents('div');
        var numspan = $(p[0].children[1].children[1]);
        var num = parseInt(numspan.html());
        numspan.text(num+1);
        if(parseInt(numspan.html())>1){
            $(p[0].children[0]).attr('src','images/btn/delnum.png');
        }
        calculateTotalPrice();
    });
    // 减少数量
    $('.delnum').on('click',function () {
        var $this = $(this);
        var p= $this.parents('div');
        var numspan = $(p[0].children[1].children[1]);
        var num = parseInt(numspan.html());
        if(num>1){
            numspan.text(num-1);
            num = parseInt(numspan.html());
            if(num<=1){
                $(p[0].children[0]).attr('src','images/btn/delnum_disable.png');
            }
        }
        calculateTotalPrice();
    });

    /**
     * 计算显示总价
     */
    function calculateTotalPrice() {
        // 所有品类的总数量
        var totalnum=$('.service-list .showselected').size();
        //总价格
        var totalprice=0.00;
        // 表单服务视图
        $('.service-list .showselected').each(function () {
            var $this = $(this);
            var choosed = $this[0].children[0];
            // 已选每一个品类的数量
            var productnum = parseFloat($(choosed.children[1].children[1].children[1]).html());
            if(totalnum>1||productnum>1){
                // 已选每一个品类的优惠价
                var preferentialprice = parseFloat($(choosed).data('preferentialprice'));
                // console.log(preferentialprice);
                $(choosed.children[0].children[1]).text('￥'+preferentialprice);
                totalprice = totalprice+productnum*preferentialprice;
            }else{
                // 已选每一个品类的原价
                var originalprice = parseFloat($(choosed).data('originalprice'));
                $(choosed.children[0].children[1]).text('￥'+originalprice);
                totalprice = totalprice+productnum*originalprice;
            }
            // 已选每一个品类的名称
            // var productname = $(choosed.children[0].children[0]).html();
            // console.log($this);
        });
        $('.jiage').text("￥"+totalprice);
        // console.log(totalprice);
    }

    /**
     * 提交时汇总数量，价格
     * @returns {Array}
     */
    function getBookingDesc() {
        var bookDesc = [];
        // 所有品类的总数量
        var totalnum=$('.service-list .showselected').size();
        //总价格
        var totalprice=0.00;
        $('.service-list .showselected').each(function () {
            var $this = $(this);
            var choosed = $this[0].children[0];
            // 已选每一个品类的数量
            var productnum = parseFloat($(choosed.children[1].children[1].children[1]).html());
            if(totalnum>1||productnum>1){
                // 已选每一个品类的名称
                var productname = $(choosed.children[0].children[0]).html();
                // 已选每一个品类的优惠价
                var preferentialprice = parseFloat($(choosed).data('preferentialprice'));
                var heji = productnum*preferentialprice;
                bookDesc.push(productname+preferentialprice+'元x'+productnum+',合计：'+heji+'元');
                totalprice = totalprice+heji;
            }else{
                // 已选每一个品类的名称
                var productname = $(choosed.children[0].children[0]).html();
                // 已选每一个品类的原价
                var originalprice = parseFloat($(choosed).data('originalprice'));
                var heji = productnum*originalprice;
                bookDesc.push(productname+originalprice+'元x'+productnum+',合计：'+heji+'元');
                totalprice = totalprice+heji;
            }
        });
        bookDesc.push('总金额：'+totalprice+'元');
        return bookDesc;
    }
    // 绑定事件 - 选择服务
    $('.section-product-list .btn').on('click', function () {
        var $this = $(this);
        var item = $this.parents('li');
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
    $('.shop-cart-num').on('click', function () {
        // 所有品类的总数量
        var totalnum=$('.service-list .showselected').size();
        if (totalnum<=0){
            layer.msg('请添加一个产品',{time:1000});
            return;
        }
        // $('#page-booking-form').slideDown(200);
        $('#page-booking-form').fadeIn();
    });
    // 绑定事件 - 显示预约表单
    $('#js-show-booking-form').on('click', function () {
        // 所有品类的总数量
        var totalnum=$('.service-list .showselected').size();
        if (totalnum<=0){
            layer.msg('请添加一个产品',{time:1000});
            return;
        }
        // $('#page-booking-form').slideDown(200);
        $('#page-booking-form').fadeIn();
    });

    // 绑定事件 - 关闭预约表单
    $('.close-dialog').on('click', function () {
        $('#page-booking-form').fadeOut();
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