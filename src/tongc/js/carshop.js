/**
 * 基础数据 - 产品列表
 */
layui.use(['jquery', 'simplePager', 'laydate', 'form', 'layer', 'cookie', 'global', 'upmobui','region'], function () {
    var $ = layui.jquery,
        layer = layui.layer,
        simplePager = layui.simplePager,
        global = layui.global,
        form = layui.form(),
        upmobui = layui.upmobui;

    var Page = function () {
        this.layer_index = null;
        this.layer_open_index = null;
        this.currentProductPrice = 0;
        this.layer_tips = null;
        this.layer_content = null;
        this.rangeBegin = 1;
        this.rangeEnd = 9999;
        this.pageIndex = 1;
        this.pageSize = 14;
        this.totalPage = 0;
        this.totalSize = 0;
        this.par = this.getParam();
    };

    Page.prototype = {

        init: function () {
            var _self = this;
            upmobui.common.pageFunc(); // 页面共用方法
            simplePager.init();
            upmobui.common.findBalanceForParent();
            _self.getData(_self.par);
            _self.bindEvent();
            global.getAllProvince();
        },

        bindEvent: function () {
            var _self = this;
            $("#btn-search").bind('click', function () {
                _self.par.queryStr = $("#productName").val();
                var province = $('.content-box [name=selectprovince]').val();
                if (province && province != '-1') {
                    _self.par.province = province;
                }else{
                    delete  _self.par.province;
                }
                var city = $('.content-box [name=selectcity]').val();
                if(city && city!='-1'){
                    _self.par.city = city;
                }else {
                    delete _self.par.city;
                }
                var district = $('.content-box [name=area]').val();
                if(district && district!='-1'){
                    _self.par.district = district;
                }else{
                    delete  _self.par.district;
                }
                //param.size = _self.pageSize;
                _self.pageIndex = 1;
                _self.getData(_self.par);
            });
            var selectprovince;
            form.on('select(selectprovince)', function(){
                selectprovince = $('.province option:selected').val();

                if(selectprovince=='-1'){
                    var ops = "<option class='chooseCity-add' value='-1'>请选择城市</option>";
                    $(".city").empty().append(ops);
                    form.render('select');
                    $('.city option:selected').val(-1);

                    var op = "<option id='chooseCounty' value='-1'>请选择区/县</option>";
                    $("#county").empty().append(op);
                    form.render('select');
                    $('#county option:selected').val(-1);
                }else{
                    global.getCityByProvinceId(selectprovince);
                }
            });
            form.on('select(selectcity)', function(){
                var city = $('.city option:selected').val();
                if(city=='-1'){
                    var op = "<option id='chooseCounty' value='-1'>请选择区/县</option>";
                    $("#county").empty().append(op);
                    form.render('select');
                    $('#county option:selected').val(-1);
                }else{
                    global.getAreaByCityId(city,selectprovince);
                }
            });


            var selectprovinceadd;
            form.on('select(selectprovince-add)', function(){
                selectprovinceadd = $('.layui-layer-content .province option:selected').val();
                _self.getCityByProvinceId(selectprovinceadd);
            });
            form.on('select(selectcity-add)', function(){
                var city = $('.layui-layer-content .city option:selected').val();
                _self.getAreaByCityId(city,selectprovinceadd);
            });

            $('.layui-tab-title').on('click', 'li', function () {
                $('#myIframe', parent.document).attr('src', $(this).data('href'));
            });

            $('#dg_list').on('mouseover mouseout', 'td a', function (event) {

                if (!$(this).data('ct')) {
                    return;
                }
                if (event.type == "mouseover") {
                    //鼠标悬浮
                    _self.layer_content = String($(this).data('ct'));
                    _self.layer_content = _self.layer_content.replace('<', '&lt');
                    _self.layer_tips = layer.tips(_self.layer_content, $(this), {
                        tips: [1, '#555'] //还可配置颜色
                    });
                } else if (event.type == "mouseout") {
                    //鼠标离开
                    layer.close(_self.layer_tips);
                }
            })

            var edit_win = $("#pop_up");
            $("#btn_add").bind('click', function (event) {
                var content = edit_win.html();
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: '新增4S店',
                    area: ['700px', '550px'], //宽高
                    fixed: false, //不固定
                    maxmin: true,
                    content: content
                });
                form.render();
                $("#pop_up").remove();
                _self.addProductAction(0);
            });

            // 删除项
            $(document).on('click', '.btn-del', function (event) {
                event.preventDefault();
                var id = $(this).data('id');
                _self.par.ids = id;
                layer.confirm('是否删这个4S店?', {
                    btn: ['是', '否']
                }, function () {
                    $.post(global.url.deleteShop, _self.par, function (data, textStatus, xhr) {
                        delete _self.par.ids;
                        if (data.code == 200) {
                            layer.msg('删除成功！', { time: 500 }, function () {
                                _self.getData(_self.par);
                            });
                        }else if (data.code == 510) {
                            layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                window.parent.location.href = 'login.html';
                            });
                        } else {
                            layer.msg("删除失败，请重试！", { time: 500 });
                        }
                    });
                }, function () {
                    layer.closeAll();
                });
            });

            // 编辑项
            $(document).on('click', '.btn-edit', function () {
                var id = $(this).data('id');
                var shopname = $(this).data('shopname');
                var shopphone = $(this).data('shopphone');
                var provincename = $(this).data('provincename');
                var cityname = $(this).data('cityname');
                var areaname = $(this).data('areaname');
                var address = $(this).data('address');
                var shoptype = $(this).data('shoptype');

                var content = edit_win.html();
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: '编辑4S店',
                    area: ['700px', '550px'], //宽高
                    fixed: false, //不固定
                    maxmin: true,
                    content: content
                });
                $('.layui-layer-content [name=id]').val(id);
                $('.layui-layer-content [name=shopName]').val(shopname);
                $('.layui-layer-content [name=mobile]').val(shopphone);
                // $('.layui-layer-content [name=province]').val(provincename);
                // $('.layui-layer-content [name=city]').val(cityname);
                // $('.layui-layer-content [name=district]').val(areaname);
                $('.layui-layer-content [name=addressDetail]').val(address);
                $('.layui-layer-content [name=shopType]').val(shoptype);
                form.render();
                $("#pop_up").remove();
                _self.addProductAction(1);

            });
            // 查看二维码
            $(document).on('click', '.btn-twocode', function () {
                var imgurl = $(this).data('imgurl');
                var shopName = $(this).data('shopname');
                var shopCode = $(this).data('shopcode');
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: shopName+'的店铺二维码',
                    area: ['700px', 'auto'], //宽高

                    content: '<img src="/images/qrCode/'+shopCode+'.png" width="300" height="300" style="display: block;margin: 0px auto;"> <p style="text-align: center;font-size: 18px;margin-bottom: 15px;">'+shopName+'</p><p style="text-align: center;font-size: 16px;margin-bottom: 20px;">店铺编码：'+shopCode+'</p>'
                });
            });
        },
        StringBuffer:function(str) {
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
    },
        getParam: function () {
            var par = {};
            par.token = $.cookie('userToken');
            return par;
        },
        getData: function (par) {
            var _self = this;
            par.pageIndex = _self.pageIndex;
            par.pageSize = _self.pageSize;
            $.ajax({
                url: global.url.findShopList,
                type: 'GET',
                dataType: 'json',
                data: par,
                beforeSend: function () {
                    _self.layer_index = layer.load(2);
                },
                success: function (data) {
                    layer.close(_self.layer_index);
                    if (undefined != data.data && null != data.data && data.code == 200) {
                        var dataList = data.data.content;
                        var html = "";
                        var len = dataList.length;
                        if (len > 0) {
                            for (var i = 0; i < len; i++) {
                                html += '<tr>';
                                html += '<td>' + (i - 0 + 1) + '</td>';
                                html += '<td><a data-ct="' + dataList[i].shopName + '"</a>' + dataList[i].shopName + '</td>';
                                html += '<td data-ct="' + dataList[i].mobile +'">' + dataList[i].mobile + '</td>';
                                html += '<td data-ct="' + dataList[i].shopCode +'">' + dataList[i].shopCode + '</td>';
                                if(dataList[i].shopType==1){
                                    html += '<td data-ct="' + dataList[i].shopType +'">4S店</td>';
                                }else if(dataList[i].shopType==2){
                                    html += '<td data-ct="' + dataList[i].shopType +'">市场店铺</td>';
                                }
                                html += '<td ><a data-ct="' + dataList[i].provinceName +dataList[i].cityName +dataList[i].districtName +dataList[i].addressDetail +'"</a>' + dataList[i].provinceName +dataList[i].cityName +dataList[i].districtName +dataList[i].addressDetail+ '</td>';
                                html += '<td>' + dataList[i].createTimeStr + '</td>';
                                html += '<td>'
                                    + '<a data-ct="查看店铺二维码" href="javascript:void(0);" data-shopcode="' + dataList[i].shopCode + '" data-shopname="' + dataList[i].shopName + '" data-imgurl="' + dataList[i].qrCodeUrl + '" class="layui-btn layui-btn-mini layui-btn-primary btn-twocode">二维码</a>'
                                    + '<a href="javascript:void(0);" data-id="' + dataList[i].id + '" data-shopname="' + dataList[i].shopName + '" data-shopphone="' + dataList[i].mobile + '" data-provincename="' + dataList[i].province + '" data-cityname="' + dataList[i].city + '" data-areaname="' + dataList[i].district +'" data-shoptype="' + dataList[i].shopType + '" data-address="' + dataList[i].addressDetail + '" class="layui-btn layui-btn-mini btn-edit">编辑</a>'
                                    + '<a href="javascript:void(0);" data-id="' + dataList[i].id + '" class="layui-btn layui-btn-mini layui-btn-danger btn-del">删除</a>'
                                    + '</td>';
                                html += '</tr>';
                            }
                            $("#dg_list tbody").empty().append(html);

                            _self.totalSize = data.data.totalSize;
                            _self.totalPage = Math.ceil(_self.totalSize / _self.pageSize);
                            $('.pager-footer').show();
                            simplePager.setup({
                                item: '.simple-pager-wrapper .simple-pager',
                                data: data.data,
                                pageIndex: _self.pageIndex,
                                pageSize: _self.pageSize,
                                showPageCount: 5,
                                cbclick: function (pageIndex) {

                                    _self.pageIndex = pageIndex;
                                    _self.getData(par);
                                    return false;
                                }
                            });
                        } else {
                            $("#dg_list tbody").empty();
                            layer.msg("没有相关数据", { time: 1200 });
                        }
                        if (typeof successCallback === "function") {
                            successCallback(data.code);
                        }
                        setTimeout(function () {
                            $('#myIframe', parent.document).height($('#myIframe', parent.document).contents().find('body').height());
                        }, 100)
                    } else {
                        $("#dg_list tbody").empty();
                        $('.pager-footer').hide();
                        setTimeout(function () {
                            $('#myIframe', parent.document).height($('#myIframe', parent.document).contents().find('body').height());
                            layer.msg("没有相关数据", { time: 1200 });
                        }, 100)
                        if (data.code == 510) {
                            layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                window.parent.location.href = 'login.html';
                            });
                        }
                    }
                },
                error: function (e) {
                    layer.close(_self.layer_index);
                    layer.msg('获取数据失败，请稍后重试！', { time: 1000 });
                }
            })
        },
        addProductAction: function (flag) {
            var _self = this;

            $('.js-btn-update').bind('click', function () {
                if (_self.checkForm()) {
                    var par = _self.getParam();

                    _self.layer_index = layer.load(2);
                    par.provinceName = $('.layui-layer-content [name=provinceName]').val();

                    var formData = new FormData($("#uploadForm")[0]);
                    formData.append("token",$.cookie('userToken'));
                    $.ajax({
                        url: global.url.addShop,
                        type: 'POST',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        beforeSend: function () {
                            $('.js-btn-update')[0].disabled = true;
                        },
                        success: function (data) {
                            layer.close(_self.layer_index);
                            if (undefined != data && null != data && data.code == 200) {
                                var fmsg='新增成功！';
                                if (flag==1){
                                    fmsg='编辑成功！';
                                }
                                layer.msg(fmsg, { time: 500 }, function () {
                                    _self.getData(_self.par);
                                    layer.close(_self.layer_open_index);
                                });
                            } else {
                                $('.js-btn-update')[0].disabled = false;
                                if (data.code == 510) {
                                    layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                        window.parent.location.href = 'login.html';
                                    });
                                }else{
                                    layer.msg('操作失败！', { time: 1800 });
                                }
                            }
                        },
                        error: function (e) {
                            $('.js-btn-update')[0].disabled = false;
                            layer.close(_self.layer_index);
                            layer.msg('系统错误，请稍后重试！', { time: 1000 });
                        }
                    })
                }
            });
        },
        toRoundOff: function (num) {
            if (num.toString().indexOf('.') > -1) {
                num = Number(num.toString().substring(0, num.toString().indexOf('.') + 3));
            }
            return num;
        },
        getCityByProvinceId: function (param, callback) {
            var _self = this;
            var par = {};
            par.token = $.cookie('userToken');
            par.pageIndex = 1;
            par.pageSize = 9999;
            par.level=3;
            par.parent = param;

            $.ajax({
                url: global.url.findAllArea,
                type: 'GET',
                dataType: 'json',
                data: par,
                success: function (result) {
                    var sb = new _self.StringBuffer();
                    $.each(result.data.content, function (i, val) {
                        sb.append("<option value='" + val.id + "'>" + val.name + "</option>");
                    });
                    var op = "<option class='chooseCity-add' value='-1'>请选择城市</option>";
                    $(".city-add").empty().append(op).append(sb.toString());
                    if(callback){
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
            par.level=4;
            par.city = param;
            par.province = province;
            $.ajax({
                url: global.url.findAllDistrict,
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
                    var sb = new _self.StringBuffer();
                    $.each(result.data.content, function (i, val) {
                        sb.append("<option value='" + val.id + "'>" + val.name + "</option>");
                    });
                    var op = "<option id='chooseCounty' value='-1'>请选择区/县</option>";
                    $("#county-add").empty().append(op).append(sb.toString());
                    form.render('select');
                }
            })
        },
        checkForm: function () {
            var provincename = $('.layui-layer-content [name=province]').val();
            if (!provincename||-1==provincename) {
                layer.msg('省份名称不能为空！', { time: 1200 });
                return false;
            }
            var cityname = $('.layui-layer-content [name=city]').val();
            if (!cityname||-1==cityname) {
                layer.msg('城市名称不能为空！', { time: 1200 });
                return false;
            }
            var areaname = $('.layui-layer-content [name=district]').val();
            if (!areaname||-1==areaname) {
                layer.msg('区/县名称不能为空！', { time: 1200 });
                return false;
            }
            var shoptype = $('.layui-layer-content [name=shopType]').val();
            if (!shoptype||-1==shoptype) {
                layer.msg('店铺类型不能为空！', { time: 1200 });
                return false;
            }
            var shopname = $('.layui-layer-content [name=shopName]').val();
            if (!shopname) {
                layer.msg('4S店名称不能为空！', { time: 1200 });
                return false;
            }
            var shopphone = $('.layui-layer-content [name=mobile]').val();
            if (!shopphone) {
                layer.msg('4S店电话不能为空！', { time: 1200 });
                return false;
            }
            var address = $('.layui-layer-content [name=addressDetail]').val();
            if (!address) {
                layer.msg('详细地址不能为空！', { time: 1200 });
                return false;
            }
            return true;
        }
    }

    var page = new Page();
    page.init();
})
