/**
 * 基础数据 - 产品列表
 */
layui.use(['jquery', 'simplePager', 'laydate', 'form', 'layer', 'cookie', 'global', 'upmobui', 'region'], function () {
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
            // global.getAllProvince();
        },

        bindEvent: function () {
            var _self = this;
            $("#btn-search").bind('click', function () {
                var statu = $('.content-box [name=statu]').val();
                if (statu && statu != '-1') {
                    _self.par.statu = statu;
                } else {
                    delete  _self.par.statu;
                }
                var counponType = $('.content-box [name=counponType]').val();
                if (counponType && counponType != '-1') {
                    _self.par.counponType = counponType;
                } else {
                    delete _self.par.counponType;
                }
                var startTime = $('.content-box [name=startTime]').val();
                if (startTime) {
                    _self.par.startTime = startTime;
                } else {
                    delete  _self.par.startTime;
                }
                var expireTime = $('.content-box [name=expireTime]').val();
                if (expireTime) {
                    _self.par.expireTime = expireTime;
                } else {
                    delete  _self.par.expireTime;
                }
                //param.size = _self.pageSize;
                _self.pageIndex = 1;
                _self.getData(_self.par);
            });
            var selectprovince;
            form.on('select(selectprovince)', function () {
                selectprovince = $('.province option:selected').val();

                if (selectprovince == '-1') {
                    var ops = "<option class='chooseCity-add' value='-1'>请选择城市</option>";
                    $(".city").empty().append(ops);
                    form.render('select');
                    $('.city option:selected').val(-1);

                    var op = "<option id='chooseCounty' value='-1'>请选择区/县</option>";
                    $("#county").empty().append(op);
                    form.render('select');
                    $('#county option:selected').val(-1);
                } else {
                    global.getCityByProvinceId(selectprovince);
                }
            });
            form.on('select(selectcity)', function () {
                var city = $('.city option:selected').val();
                if (city == '-1') {
                    var op = "<option id='chooseCounty' value='-1'>请选择区/县</option>";
                    $("#county").empty().append(op);
                    form.render('select');
                    $('#county option:selected').val(-1);
                } else {
                    global.getAreaByCityId(city, selectprovince);
                }
            });


            var selectprovinceadd;
            form.on('select(selectprovince-add)', function () {
                selectprovinceadd = $('.layui-layer-content .province option:selected').val();
                _self.getCityByProvinceId(selectprovinceadd);
            });
            form.on('select(selectcity-add)', function () {
                var city = $('.layui-layer-content .city option:selected').val();
                _self.getAreaByCityId(city, selectprovinceadd);
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
                    area: ['700px', 'auto'], //宽高
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
                        } else if (data.code == 510) {
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
                    area: ['700px', 'auto'], //宽高
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
        },
        StringBuffer: function (str) {
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
                url: global.url.findAllCoupon,
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
                                var couponTypeStr='';
                                var couponType = dataList[i].couponType;
                                if(couponType=='1'){
                                    couponTypeStr='现金券30元';
                                }else if(couponType=='2'){
                                    couponTypeStr='现金券50元';
                                }else if(couponType=='3'){
                                    couponTypeStr='现金券100元';
                                }else if(couponType=='4'){
                                    couponTypeStr='现金券150元';
                                }else if(couponType=='5'){
                                    couponTypeStr='现金券200元';
                                }else if(couponType=='6'){
                                    couponTypeStr='现金券300元';
                                }
                                html += '<td>' + couponTypeStr + '</td>';
                                html += '<td>' + dataList[i].amount + '元</td>';
                                html += '<td>' + dataList[i].code + '</td>';
                                switch (dataList[i].statu) {
                                    case 0:
                                        html += '<td>未分配</td>';
                                        break;
                                    default:
                                        break;
                                }
                                html += '<td >' + dataList[i].startTimeStr + '</td>';
                                html += '<td>' + dataList[i].expireTimeStr + '</td>';
                                html += '<td data-ct="' + dataList[i].couponDesc + '">' + dataList[i].couponDesc + '</td>';
                                html += '</tr>';
                            }
                            $("#dg_list tbody").empty().append(html);

                            _self.totalSize = data.data.totalSize;
                            _self.totalPage = data.data.totalPage;
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
                    _self.layer_index = layer.load(2);
                    var formData = new FormData($("#uploadForm")[0]);
                    formData.append("token", $.cookie('userToken'));
                    $.ajax({
                        url: global.url.generateCouponBatch,
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
                                var fmsg = '新增成功！';
                                if (flag == 1) {
                                    fmsg = '编辑成功！';
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
                                } else {
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
            par.level = 3;
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
            var couponType = $('.layui-layer-content [name=couponType]').val();
            if (!couponType || -1 == couponType) {
                layer.msg('请选择卡券类型！', { time: 1200 });
                return false;
            }
            var startTime = $('.layui-layer-content [name=startTime]').val();
            if (!startTime) {
                layer.msg('请选择卡券生效时间！', { time: 1200 });
                return false;
            }
            var expireTime = $('.layui-layer-content [name=expireTime]').val();
            if (!expireTime) {
                layer.msg('请选择卡券失效时间！', { time: 1200 });
                return false;
            }
            var total = $('.layui-layer-content [name=total]').val();
            if (!total || total <= 0) {
                layer.msg('请填写生成卡券的数量！', { time: 1200 });
                return false;
            } else if (total > 1000000) {
                layer.msg('好贪心，你居然要生成这么多卡券！', { time: 3000 });
                return false;
            }
            var amount = $('.layui-layer-content [name=amount]').val();
            if (!amount || amount <= 0) {
                layer.msg('请填写每张卡券面额！', { time: 1200 });
                return false;
            }
            var couponDesc = $('.layui-layer-content [name=couponDesc]').val();
            if (!couponDesc) {
                layer.msg('请填写描述！', { time: 1200 });
                return false;
            }
            return true;
        }
    }

    var page = new Page();
    page.init();
})
