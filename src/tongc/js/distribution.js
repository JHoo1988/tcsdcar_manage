/**
 * 分配店铺
 */
layui.use(['jquery', 'simplePager', 'laydate', 'form', 'layer', 'cookie', 'global', 'upmobui', 'region'], function () {
    var $ = layui.jquery,
        layer = layui.layer,
        simplePager = layui.simplePager,
        global = layui.global,
        form = layui.form(),
        upmobui = layui.upmobui;
    var salesmanid = '';

    var Page = function () {
        this.layer_index = null;
        this.layer_open_index = null;
        this.currentProductPrice = 0;
        this.layer_tips = null;
        this.layer_content = null;
        this.rangeBegin = 1;
        this.rangeEnd = 9999;
        this.pageIndex = 1;
        this.pageSize = 12;
        this.totalPage = 0;
        this.totalSize = 0;
    };

    Page.prototype = {

        init: function () {
            var _self = this;
            var par = _self.getParam();
            upmobui.common.pageFunc(); // 页面共用方法
            simplePager.init();
            upmobui.common.findBalanceForParent();
            var codeNameHash = location.hash;
            salesmanid = codeNameHash.substring(1);
            _self.getData(par);
            _self.bindEvent();
            global.getAllProvince();
        },

        bindEvent: function () {
            var _self = this;
            $("#btn-search").bind('click', function () {
                var par = _self.getParam();
                par.queryStr = $("#productName").val();
                var province = $('.content-box [name=selectprovince]').val();
                if (province && province != '-1') {
                    par.province = province;
                }
                var city = $('.content-box [name=selectcity]').val();
                if (city && city != '-1') {
                    par.city = city;
                }
                var district = $('.content-box [name=area]').val();
                if (district && district != '-1') {
                    par.district = district;
                }
                //param.size = _self.pageSize;
                _self.pageIndex = 1;
                _self.getData(par);
            });
            var selectprovince;
            form.on('select(selectprovince)', function () {
                selectprovince = $('.province option:selected').val();
                global.getCityByProvinceId(selectprovince);
            });
            form.on('select(selectcity)', function () {
                var city = $('.city option:selected').val();
                global.getAreaByCityId(city, selectprovince);
            });

            form.on('select(selectcity-add)', function () {
                var city = $('.layui-layer-content .city option:selected').val();
                _self.getAreaByCityId(city, selectprovinceadd);
            });
            // // 点击头部显示
            // $('.layui-tab-title').on('click', 'li', function () {
            //     $('#myIframe', parent.document).attr('src', $(this).data('href'));
            // });

            // 返回
            $('.jumpa').bind('click', function () {
                window.history.go(-1);
            });
            // 立即分配
            $('.distribution').bind('click', function () {
                var checkboxList = $("input[type='checkbox'][name='singlChoose']");
                var tempids = new Array();
                for (var i = 0; i < checkboxList.length; i++) {
                    if ($("input[type='checkbox'][name='singlChoose']")[i].checked) {
                        var id = $("input[type='checkbox'][name='singlChoose']")[i].value;
                        tempids.push(id);
                    }
                }
                if (tempids.length <= 0) {
                    layer.msg('请选择店铺', { time: 500 });
                    return false;
                }
                var par = _self.getParam();
                par.salesManId = salesmanid;
                par.shopIds = tempids.toString();
                par.statu = 0;
                _self.saveRelated(par);
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

            // 全选
            $('.allChoose').on('change', function () {
                if ($("input[type='checkbox'][name='allChoose']")[0].checked) {
                    _self.selectAll();
                } else {
                    _self.unSelectAll();
                }
            });

            // 选择事件
            $(document).on('change', '.singlChoose', function () {
                var checkboxList = $("input[type='checkbox'][name='singlChoose']");
                var num = false;
                for (var i = 0; i < checkboxList.length; i++) {
                    if ($("input[type='checkbox'][name='singlChoose']")[i].checked) {
                        num = true;
                        break;
                    }
                }
                if (num) {
                    $('.distribution').removeClass('layui-btn-disabled');
                } else {
                    $('.distribution').addClass('layui-btn-disabled');
                }
            });

        },
        selectAll: function () {
            var checkboxList = $("input[type='checkbox'][name='singlChoose']");
            var num = false;
            for (var i = 0; i < checkboxList.length; i++) {
                $("input[type='checkbox'][name='singlChoose']")[i].checked = true;
                num = true;
            }
            if (num) {
                $('.distribution').removeClass('layui-btn-disabled');
            }
        },
        unSelectAll: function () {
            var checkboxList = $("input[type='checkbox'][name='singlChoose']");
            for (var i = 0; i < checkboxList.length; i++) {
                $("input[type='checkbox'][name='singlChoose']")[i].checked = false;
            }
            $('.distribution').addClass('layui-btn-disabled');
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
                url: global.url.findUnRelatedShop+salesmanid,
                // url: global.url.findShopList,
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
                                html += '<td><input data-id="' + dataList[i].id + '" class="singlChoose" type="checkbox" name="singlChoose" value="' + dataList[i].id + '"> 选择</td>';
                                html += '<td>' + (i - 0 + 1) + '</td>';
                                html += '<td>' + dataList[i].shopName + '</td>';
                                html += '<td>' + dataList[i].shopCode + '</td>';
                                html += '<td>' + dataList[i].provinceName + dataList[i].cityName + dataList[i].districtName + dataList[i].addressDetail + '</td>';
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
        saveRelated: function (par) {
            var _self = this;
            $.ajax({
                url: global.url.saveRelated,
                type: 'POST',
                dataType: 'json',
                data: par,
                beforeSend: function () {
                    _self.layer_index = layer.load(2);
                },
                success: function (data) {
                    layer.close(_self.layer_index);
                    if (undefined != data && null != data && data.code == 200) {
                        layer.msg("店铺分配成功", { time: 1200 }, function () {
                            var par = _self.getParam();
                            $("input[type='checkbox'][name='allChoose']")[0].checked=false;
                            $('.distribution').addClass('layui-btn-disabled');
                            _self.getData(par);
                        });
                    } else if (data.code == 510) {
                        layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                            window.parent.location.href = 'login.html';
                        });
                    } else {
                        layer.msg('店铺分配失败，请稍后重试', { time: 1200 });
                    }
                },
                error: function (e) {
                    layer.close(_self.layer_index);
                    layer.msg('店铺分配失败，请稍后重试！', { time: 1000 });
                }
            })
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
            var provincename = $('.layui-layer-content [name=province]').val();
            if (!provincename || -1 == provincename) {
                layer.msg('省份名称不能为空！', { time: 1200 });
                return false;
            }
            var cityname = $('.layui-layer-content [name=city]').val();
            if (!cityname || -1 == cityname) {
                layer.msg('城市名称不能为空！', { time: 1200 });
                return false;
            }
            var areaname = $('.layui-layer-content [name=district]').val();
            if (!areaname || -1 == areaname) {
                layer.msg('区/县名称不能为空！', { time: 1200 });
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
