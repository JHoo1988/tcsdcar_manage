/**
 * Created by yxc on 2016/10/13.
 */
layui.define(['jquery', 'layer', 'cookie', 'global', 'form'], function (exports) {

    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form(),
        global = layui.global;

    var Page = function () {
        this.address = {};
        this.corporateId;
    };

    Page.prototype = {
        init: function () {
            var _self = this;
            _self.bindEvent();
        },
        bindEvent: function () {
            var _self = this;
            //处理地址信息
            form.on('select(province)', function(){
                _self.provinceAction();
            });

            form.on('select(city)', function () {
                _self.cityAction();
            });
            form.on('select(county)', function(){
                _self.countyAction();
            })
        },
        infoRevealInPage: function () {
            var _self = this;
            var param = {};
            param.token = $.cookie('userToken');
            $.ajax({
                url: global.url.getCorporate,
                type: 'get',
                dataType: 'json',
                data: param,
                success: function (result) {
                    if (result.flag == 'success') {
                        //将结果显示在网页上
                        _self.corporateId = result.data.corporateId;
                        $('#info_legal_name').attr('value', result.data.corporateName);
                        $('#info_company_name').attr('value', result.data.companyName);
                        $("#info_qq_num").attr('value', result.data.qqNumber);

                        $("#province option[value=" + result.data.provinceId + " ]").attr("selected", "selected");


                        if ((result.data.cityName != '') && (result.data.cityName.length > 0)) {
                            $("#city").empty();
                            $("#city").append("<option id='chooseCity' value=" + result.data.cityId + ">" + result.data.cityName + "</option>");
                        }

                        if ((result.data.areaName != '') && (result.data.areaName.length > 0)) {
                            $("#county").empty();
                            $("#county").append("<option id='chooseCounty' value=" + result.data.areaId + ">" + result.data.areaName + "</option>");
                        }

                        if ((result.data.streetName != '') && (result.data.streetName.length > 0)) {
                            $("#street").empty();
                            $("#street").append("<option id='chooseStreet' value=" + result.data.streetId + ">" + result.data.streetName + "</option>");
                        }

                        $('#info_company_address-desc').attr('value', result.data.companyAddress);
                        $('#engineerMobile').html(result.data.engineerMobile);
                        $('#engineerMobile').attr('value', result.data.engineerMobile);
                        $('#customerMobile').html(result.data.customerMobile);
                        $('#customerMobile').attr('value', result.data.customerMobile);

                    } else {
                        layer.msg('获取数据失败!' + result.msg);
                        // if (result.code == 510) {
                        //     layer.msg('登录已失效，请重新登录...',{time: 1200},function () {
                        //         // window.parent.location.href = 'login.html';
                        //     });
                        // }
                    }
                }
            })
        },
        provinceAction: function () {
            var _self = this;
            var city = $("#city");
            var county = $("#county");
            var street = $("#street");
            if (city.children().length > 1) {
                city.empty();
            }
            if (county.children().length > 1) {
                county.empty();
            }
            if (street.children().length > 1) {
                street.empty();
            }
            if ($("#chooseCity").length == 0) {
                city.append("<option id='chooseCity' value='-1'>请选择城市</option>");
            }
            if ($("#chooseCounty").length == 0) {
                county.append("<option id='chooseCounty' value='-1'>请选择区/县</option>");
            }
            if ($("#chooseStreet").length == 0) {
                street.append("<option id='chooseStreet' value='-1'>请选择街道</option>");
            }
            _self.address.city = {};
            _self.address.city.provinceId = $('#province option:selected').val();
            global.getCityByProvinceId(_self.address.city);
        },
        cityAction: function () {
            var _self = this;
            var county = $("#county");
            var street = $("#street");
            if (county.children().length > 1) {
                county.empty();
            }
            if (street.children().length > 1) {
                street.empty();
            }
            if ($("#chooseCounty").length == 0) {
                county.append("<option id='chooseCounty' value='-1'>请选择区/县</option>");
            }
            if ($("#chooseStreet").length == 0) {
                street.append("<option id='chooseStreet' value='-1'>请选择街道</option>");
            }
            _self.address.area = {};
            _self.address.area.cityId = $('#city option:selected').val();
            global.getAreaByCityId(_self.address.area);
        },
        countyAction: function () {
            var _self = this;
            var street = $("#street");
            if (street.children().length > 1) {
                street.empty();
            }
            if ($("#chooseStreet").length == 0) {
                street.append("<option id='chooseStreet' value='-1'>请选择街道</option>");
            }
            _self.address.street = {};
            _self.address.street.areaId = $('#county option:selected').val();
            global.getStreetByAreaId(_self.address.street);
        }
    }
    exports('region', new Page());
})
