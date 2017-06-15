;/**
 * Created by dell on 2016/10/10.
 */
layui.define(['jquery', 'layer', 'form'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer;
    var form = layui.form();
    // var baseUrl = 'http://119.23.34.22:8080';
    var baseUrl = 'http://localhost:8088';
    var baseModifyUrl = '/';
    var App = function () {
        this.url = {
            //管理端登录
            login: baseUrl + baseModifyUrl + 'login',
            //查询订单
            findOrderList: baseUrl + baseModifyUrl + 'productOrder/findOrderList',
            //查询订单赔付记录 GET orderId,pageIndex,pageSize
            findPaidRecordsList: baseUrl + baseModifyUrl + 'mobile/findPaidRecordsList',
            //增加/修改订单
            addOrder: baseUrl + baseModifyUrl + 'productOrder/addOrder',
            //删除订单
            deleteOrder: baseUrl + baseModifyUrl + 'productOrder/deleteOrder',
            //查询产品
            findProductList: baseUrl + baseModifyUrl + 'product/findProductList',
            //m查询产品
            findProductListm: baseUrl + baseModifyUrl + 'mobile/findProductList',
            //添加产品
            addProduct: baseUrl + baseModifyUrl + 'product/addProduct',
            //删除产品
            deleteProduct: baseUrl + baseModifyUrl + 'product/deleteProduct',
            //查询店铺
            findShopList: baseUrl + baseModifyUrl + 'shop/findShopList',
            //增加店铺
            addShop: baseUrl + baseModifyUrl + 'shop/addShop',
            //删除店铺
            deleteShop: baseUrl + baseModifyUrl + 'shop/deleteShop',
            //发送短信
            sendmms: baseUrl + baseModifyUrl + 'productOrder/sendSmsForExpire',
            //查询所有城市
            findAllArea: baseUrl + baseModifyUrl + 'area/findAllArea',
            //删除城市
            deleteArea: baseUrl + baseModifyUrl + 'area/deleteArea',
            //查询所有区域
            findAllDistrict: baseUrl + baseModifyUrl + 'area/findAllDistrict',
            //添加区域
            addArea: baseUrl + baseModifyUrl + 'area/addArea',
            //手机端查询产品
            // mfindProductList: baseUrl + baseModifyUrl + 'mobile/findProductList',
            mfindProductList: baseUrl + baseModifyUrl + 'mobile/findAllProductBrands',
            //添加产品
            managerAddProduct: baseUrl + baseModifyUrl + 'manager/addProduct',

            //添加品牌
            saveProductBrands: baseUrl + baseModifyUrl + 'productBrands/saveProductBrands',
            //查询品牌
            findAllProductBrands: baseUrl + baseModifyUrl + 'productBrands/findAllProductBrands',
            //删除品牌
            deleteProductBrands: baseUrl + baseModifyUrl + 'productBrands/deleteProductBrands',

            //查询分类列表 GET
            findAllProductCategory: baseUrl + baseModifyUrl + 'productCategory/findAllProductCategory',
            //保存分类信息 POST
            saveProductCategory: baseUrl + baseModifyUrl + 'productCategory/saveProductCategory',
            //获取分类详细productCategory/findProductCategoryById/{id} GET
            findProductCategoryById: baseUrl + baseModifyUrl + 'productCategory/findProductCategoryById/',
            //删除分类 POST
            deleteProductCategory: baseUrl + baseModifyUrl + 'productCategory/deleteProductCategory',

            //查询业务员
            findSalesMan: baseUrl + baseModifyUrl + 'salesman/findSalesMan',
            //保存业务员信息
            saveSalesMan: baseUrl + baseModifyUrl + 'salesman/saveSalesMan',
            //根据id获取业务员信息
            findSalesManById: baseUrl + baseModifyUrl + 'salesman/findSalesManById/',
            //根据id删除业务员
            deleteSalesMan: baseUrl + baseModifyUrl + 'salesman/deleteSalesMan',
            //为业务员分配店铺
            saveRelated: baseUrl + baseModifyUrl + 'salesman/saveRelated',
            //删除当前务员已分配的店铺
            deleteRelatedById: baseUrl + baseModifyUrl + 'salesman/deleteRelatedById',
            //查询当前务员已分配的店铺
            findSalesManRelatedShop: baseUrl + baseModifyUrl + 'salesman/findSalesManRelatedShop/',
            //查询当前务员未分配的店铺
            findUnRelatedShop: baseUrl + baseModifyUrl + 'salesman/findUnRelatedShop/',
            //修改已分配的店铺的合作状态
            updateRelated: baseUrl + baseModifyUrl + 'salesman/updateRelated',

            //根据code获取openid接口
            getWeiXinOpenIdByCode: baseUrl + baseModifyUrl + 'weixin/getWeiXinOpenIdByCode/',
            //创建订单
            unifiedOrder: baseUrl + baseModifyUrl + 'weixin/unifiedOrder',

            //退出登录
            userQuit: baseUrl + baseModifyUrl + 'logout/',
            //2.8.4.支付宝充值
            alipay: baseUrl + baseModifyUrl + 'recharge/alipay',

            //2.8.4.充值获取支付订单号
            getPayCode: baseUrl + baseModifyUrl + 'recharge/getPayCode',

            //2.8.5.支付宝重新支付
            aliRepay: baseUrl + baseModifyUrl + 'recharge/aliRepay',

            payTest2: baseUrl + baseModifyUrl + 'alipay/wap/payTest2',
            // 车型分页查询
            findAllProductModel: baseUrl + baseModifyUrl + 'productModel/findAllProductModel',
            // 保存、修改车型
            saveProductModel: baseUrl + baseModifyUrl + 'productModel/saveProductModel',
            // 产品品牌分类，产品品牌，产品型号
            saveProductBrandsCategory: baseUrl + baseModifyUrl + 'productBrandsCategory/saveProductBrandsCategory',
            // 产品品牌分类，产品品牌，产品型号
            findAllProductBrandsCategory: baseUrl + baseModifyUrl + 'productBrandsCategory/findAllProductBrandsCategory',
            // 产品品牌图片url
            productBrandsCategorys: baseUrl + baseModifyUrl + 'productBrandsCategorys/image/',
            // 删除产品品牌
            deleteProductBrandsCategory: baseUrl + baseModifyUrl + 'productBrandsCategory/deleteProductBrandsCategory',
            // 查询产品
            findBrandsProductList: baseUrl + baseModifyUrl + 'brandsProduct/findBrandsProductList',
            // 保存产品
            saveBrandsProduct: baseUrl + baseModifyUrl + 'brandsProduct/saveBrandsProduct',
            // 删除产品
            deleteBrandsProduct: baseUrl + baseModifyUrl + 'brandsProduct/deleteBrandsProduct',
            // 卡券库存列表
            findAllCoupon: baseUrl + baseModifyUrl + 'coupon/findAllCoupon',
            // PC获取卡券列表（已分配，已使用）
            findAllCouponConsumRecord: baseUrl + baseModifyUrl + 'coupon/findAllCouponConsumRecord',
            // 卡券生成接口
            generateCouponBatch: baseUrl + baseModifyUrl + 'coupon/generateCouponBatch',
        };
        this.address = {};
        this.countdown = 60;
    }
    App.prototype = {
        isValEmpty: function (value) {
            if (value === '') {
                return true;
            }
            return /^\s+$/.test(value);
        },
        isPrice: function (value) {
            var reg = /^(([0])|([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
            return reg.test(value);
        },
        isPhone: function (value) {
            var string = $.trim(value);
            var pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8]))\d{8}$/;
            return pattern.test(string);
        },
        isPlane: function (value) {
            var string = $.trim(value);
            var pattern = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
            return pattern.test(string);
        },
        checkPswdLen: function (value) {
            if (value.length < 6 || value.length > 16) {
                return false;
            }
            return true;
        },
        getAllProvince: function () {
            var _self = this;
            _self.address.allProvince = {};
            _self.address.allProvince.version = 'v1';
            var par = {};
            par.token = $.cookie('userToken');
            par.pageIndex = 1;
            par.pageSize = 99;
            par.level = 2;
            $.ajax({
                url: this.url.findAllArea,
                type: 'GET',
                dataType: 'json',
                data: par,
                success: function (result) {
                    if (result.code == 510) {
                        layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                            window.parent.location.href = 'login.html';
                            return;
                        });
                    }
                    var sb = new StringBuffer();
                    $.each(result.data.content, function (i, val) {
                        sb.append("<option value='" + val.id + "'>" + val.name + "</option>");
                    });
                    var op = $(".choosePro").clone();
                    $(".province").empty().append(op).append(sb.toString());
                    form.render('select');
                }
            })
        },
        getCityByProvinceId: function (param, callback) {
            var _self = this;
            var par = {};
            par.token = $.cookie('userToken');
            par.pageIndex = 1;
            par.pageSize = 9999;
            par.level = 3;
            par.parent = param;

            $.ajax({
                url: _self.url.findAllArea,
                type: 'GET',
                dataType: 'json',
                data: par,
                success: function (result) {
                    if (result.code == 510) {
                        layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                            window.parent.location.href = 'login.html';
                            return;
                        });
                    }
                    var sb = new StringBuffer();
                    $.each(result.data.content, function (i, val) {
                        sb.append("<option value='" + val.id + "'>" + val.name + "</option>");
                    });
                    var op = "<option class='chooseCity' value='-1'>请选择城市</option>";
                    $(".city").empty().append(op).append(sb.toString());
                    if (callback) {
                        callback();
                    }
                    form.render('select');
                }
            })
        },
        getAreaByCityId: function (param, province) {
            var _self = this;
            var par = {};
            par.token = $.cookie('userToken');
            par.pageIndex = 1;
            par.pageSize = 9999;
            par.level = 4;
            par.city = param;
            par.province = province;
            $.ajax({
                url: _self.url.findAllDistrict,
                type: 'GET',
                dataType: 'json',
                data: par,
                success: function (result) {
                    if (result.code == 510) {
                        layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                            window.parent.location.href = 'login.html';
                            return;
                        });
                    }
                    var sb = new StringBuffer();
                    $.each(result.data.content, function (i, val) {
                        sb.append("<option value='" + val.id + "'>" + val.name + "</option>");
                    });
                    var op = "<option id='chooseCounty' value='-1'>请选择区/县</option>";
                    $("#county").empty().append(op).append(sb.toString());
                    form.render('select');
                }
            })
        },
        getStreetByAreaId: function (param, callback) {
            var _self = this;
            $.ajax({
                url: _self.url.findStreetByAreaId,
                type: 'get',
                dataType: 'json',
                data: 'param=' + JSON.stringify(param) + '&token=' + $.cookie('userToken'),
                success: function (result) {
                    if (result.code == 510) {
                        layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                            window.parent.location.href = 'login.html';
                            return;
                        });
                    }
                    var sb = new StringBuffer();
                    if (result.data.length == 1 && result.data[0].streetName == '') {
                        $("#street").parent().hide();
                    } else {
                        $.each(result.data, function (i, val) {
                            sb.append("<option value='" + val.streetId + "'>" + val.streetName + "</option>");
                        });
                        var op = "<option id='chooseStreet' value='-1'>请选择街道</option><option value='-9999'>不确定街道</option>";
                        $("#street").empty().append(op).append(sb.toString());
                        $("#street").parent().show();
                    }

                    if (callback) {
                        callback();
                    }
                    form.render('select');
                }
            })
        },
        getUserWallet: function () {
            // var _self = this;
            // var par = {};
            // par.token = $.cookie('userToken');
            // $.ajax({
            // 	url: _self.url.getUserWallet,
            // 	type: 'POST',
            // 	dataType: 'json',
            // 	data: par,
            // 	success:function(data) {
            // 		if (undefined != data && null != data && data.flag == 'success') {
            // 			var dataList = data.data;
            // 			if(dataList.isOverdraft == 1){
            // 				$(".overdraftBalance").html(dataList.overdraftBalance);
            // 				$(".overdraftLimit").html(dataList.overdraftLimit);
            // 				$('#ious_1').show();
            // 				$('#ious_2').show();
            // 			}else{
            // 				$('#ious_1').hide();
            // 				$('#ious_2').hide();
            // 			}
            // 			$(".balance-zone").html(dataList.walletBalance);
            // 		} else {
            // 			layer.msg(data.msg);
            // 		}
            // 	},
            // 	error: function (e) {
            // 		console.log(e);
            // 	}
            // })
        },
        getSignByArr: function (params) {
            var _self = this;
            var arr = [];
            for (var item in params) {
                arr.push(item);
            }
            arr.sort();
            var values = [];
            for (var i = 0; i < arr.length; i++) {
                var kv = arr[i] + '' + params[arr[i]];
                if (arr[i] == 'sign' || params[arr[i]] == null || params[arr[i]] == '') {
                    continue;
                }
                values.push(kv);
            }
            var str = values.join('');
            var newStr = str.slice(-6, str.length) + str.slice(6, str.length - 6) + str.slice(0, 6);
            var sign = $.md5(newStr);
            return sign;
        },
        setTime: function (obj) {
            var _self = this;
            if (_self.countdown == 0) {
                obj.removeAttr('disabled').removeClass('layui-btn-disabled').addClass('layui-btn-normal').html('获取验证码');
                _self.countdown = 60;
                return;
            } else {
                obj.attr("disabled", true).removeClass('layui-btn-normal').addClass('layui-btn-disabled').html("重新发送(" + _self.countdown + ")");
                _self.countdown--;
                setTimeout(function () {
                    _self.setTime(obj);
                }, 1000)
            }
        },
        //获取手机验证码
        getVerify: function (mobileCodeParam) {
            //获取验证码
            var _self = this;
            $.ajax({
                url: _self.url.getPhoneCode,
                type: 'get',
                dataType: 'json',
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                data: 'param=' + JSON.stringify(mobileCodeParam),
                success: function (result) {

                },
                error: function () {
                    layer.msg('获取验证码失败!' + result.msg, { time: 1200 });
                }
            })
        },
    }
    function StringBuffer(str) {
        var arr = [];
        str = str || "";
        var size = 0;  // 存放数组大小
        arr.push(str);
        // 追加字符串
        this.append = function (str1) {
            arr.push(str1);
            return this;
        };
        // 返回字符串
        this.toString = function () {
            return arr.join("");
        };
        // 清空
        this.clear = function (key) {
            size = 0;
            arr = [];
        }
        // 返回数组大小
        this.size = function () {
            return size;
        }
        // 返回数组
        this.toArray = function () {
            return buffer;
        }
        // 倒序返回字符串
        this.doReverse = function () {
            var str = buffer.join('');
            str = str.split('');
            return str.reverse().join('');
        }
    };

    Number.prototype.toFixed = function (s) {
        var changenum = (parseInt(this * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();

        var index = changenum.indexOf(".");

        if (index < 0 && s > 0) {
            changenum = changenum + ".";
            for (i = 0; i < s; i++) {
                changenum = changenum + "0";
            }

        } else {
            index = changenum.length - index;
            for (i = 0; i < (s - index) + 1; i++) {
                changenum = changenum + "0";
            }

        }

        return changenum;
    };

    window.calc = {
        // 加法
        add: function (arg1, arg2) {
            var r1, r2, m, c;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2));
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return (arg1 + arg2) / m;
        },

        // 减法
        sub: function (arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
            }

            try {
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }

            m = Math.pow(10, Math.max(r1, r2));  // 动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        },

        // 乘法
        mul: function (arg1, arg2) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length;
            }
            catch (e) {
            }
            try {
                m += s2.split(".")[1].length;
            }
            catch (e) {
            }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        },

        // 除法
        div: function (arg1, arg2) {
            var t1 = 0, t2 = 0, r1, r2;
            try {
                t1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
            }
            try {
                t2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
            }

            with (Math) {
                r1 = Number(arg1.toString().replace(".", ""));
                r2 = Number(arg2.toString().replace(".", ""));
                return (r1 / r2) * pow(10, t2 - t1);
            }
        }
    };
    exports('global', new App());
});

