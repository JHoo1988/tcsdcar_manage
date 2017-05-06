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
        this.par = this.getParam();
    };

    Page.prototype = {

        init: function () {
            var _self = this;
            upmobui.common.pageFunc(); // 页面共用方法
            simplePager.init();
            upmobui.common.findBalanceForParent();
            var codeNameHash = location.hash;
            salesmanid = codeNameHash.substring(1);
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
                }
                var city = $('.content-box [name=selectcity]').val();
                if (city && city != '-1') {
                    _self.par.city = city;
                }
                var district = $('.content-box [name=area]').val();
                if (district && district != '-1') {
                    _self.par.district = district;
                }
                //param.size = _self.pageSize;
                _self.pageIndex = 1;
                _self.getData(_self.par);
            });
            var selectprovince;
            form.on('select(selectprovince)', function () {
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
            form.on('select(selectcity)', function () {
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
            form.on('select(selectprovince-add)', function () {
                selectprovinceadd = $('.layui-layer-content .province option:selected').val();
                _self.getCityByProvinceId(selectprovinceadd);
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
            // 批量删除
            $('.delete').bind('click', function () {
                layer.confirm('是否取消分配选中的店铺?', {
                    btn: ['是', '否']
                }, function () {
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
                    par.ids = tempids.toString();
                    $.post(global.url.deleteRelatedById, par, function (data, textStatus, xhr) {
                        if (data.code == 200) {
                            $("input[type='checkbox'][name='allChoose']")[0].checked=false;
                            $('.delete').addClass('layui-btn-disabled');
                            layer.msg('取消分配成功！', { time: 1000 }, function () {
                                _self.getData(_self.par);
                            });
                        } else if (data.code == 510) {
                            layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                window.parent.location.href = 'login.html';
                            });
                        } else {
                            layer.msg("取消分配失败，请重试！", { time: 1000 });
                        }
                    });
                }, function () {
                    layer.closeAll();
                });
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

            // 删除项
            $(document).on('click', '.del_shop', function (event) {
                event.preventDefault();
                var id = $(this).data('id');
                var par = _self.getParam();
                par.ids= id;
                layer.confirm('是否取消分配这个店铺?', {
                    btn: ['是', '否']
                }, function () {
                    $.post(global.url.deleteRelatedById, par, function (data, textStatus, xhr) {
                        if (data.code == 200) {
                            $("input[type='checkbox'][name='allChoose']")[0].checked=false;
                            $('.delete').addClass('layui-btn-disabled');
                            layer.msg('取消分配成功！', { time: 1000 }, function () {
                                _self.getData(_self.par);
                            });
                        } else if (data.code == 510) {
                            layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                window.parent.location.href = 'login.html';
                            });
                        } else {
                            layer.msg("取消分配失败，请重试！", { time: 1000 });
                        }
                    });
                }, function () {
                    layer.closeAll();
                });
            });

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
                    $('.delete').removeClass('layui-btn-disabled');
                } else {
                    $('.delete').addClass('layui-btn-disabled');
                }
            });

            // 编辑项
            var edit_win = $("#pop_up");
            $(document).on('click', '.edt_shop', function () {
                var id = $(this).data('id');
                var statu = $(this).data('statu');
                var content = edit_win.html();
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: '编辑合作状态',
                    area: ['700px', '300px'], //宽高
                    fixed: false, //不固定
                    maxmin: true,
                    content: content
                });
                $('.layui-layer-content [name=statu]').val(statu);
                $('.layui-layer-content [name=id]').val(id);
                form.render();
                $("#pop_up").remove();
                _self.addProductAction();

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
                $('.delete').removeClass('layui-btn-disabled');
            }
        },
        unSelectAll: function () {
            var checkboxList = $("input[type='checkbox'][name='singlChoose']");
            for (var i = 0; i < checkboxList.length; i++) {
                $("input[type='checkbox'][name='singlChoose']")[i].checked = false;
            }
            $('.delete').addClass('layui-btn-disabled');
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
            // par.salesManId = salesmanid;
            $.ajax({
                url: global.url.findSalesManRelatedShop + salesmanid,
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
                                html += '<td><input type="checkbox" class="singlChoose" name="singlChoose" value="' + dataList[i].id + '"> 选择</td>';
                                html += '<td>' + (i - 0 + 1) + '</td>';
                                html += '<td>' + dataList[i].shopName + '</td>';
                                html += '<td>' + dataList[i].shopCode + '</td>';
                                html += '<td>' + dataList[i].provinceName + dataList[i].cityName + dataList[i].districtName + dataList[i].addressDetail + '</td>';
                                switch (dataList[i].statu) {//dataList[i].type
                                    case 0:
                                        html += '<td>未合作</td>';
                                        break;
                                    case 1:
                                        html += '<td class="in_cooperation">合作中</td>';
                                        break;
                                    case 2:
                                        html += '<td class="cooperative_termination">合作终止</td>';
                                        break;
                                }
                                html += '<td>' +
                                    '<a data-ct="修改合作状态" data-id="' + dataList[i].id + '" data-statu="' + dataList[i].statu + '" class="edt_shop" href="javascript:;">编辑</a>' +
                                    '<a data-ct="取消分配给他" data-id="' + dataList[i].id + '" class="del_shop" href="javascript:;">取消分配</a>' +
                                    '</td>';
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
        addProductAction: function () {
            var _self = this;
            $('.js-btn-update').bind('click', function () {
                if (_self.checkForm()) {
                    _self.layer_index = layer.load(2);
                    var formData = new FormData($("#uploadForm")[0]);
                    formData.append("token", $.cookie('userToken'));
                    $.ajax({
                        url: global.url.updateRelated,
                        type: 'POST',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        beforeSend: function () {
                            _self.layer_index = layer.load(2);
                        },
                        success: function (data) {
                            layer.close(_self.layer_index);
                            if (undefined != data && null != data && data.code == 200) {
                                layer.msg('编辑成功！', { time: 500 }, function () {
                                    _self.getData(_self.par);
                                    layer.close(_self.layer_open_index);
                                });
                            } else {
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
            var shopname = $('.layui-layer-content [name=statu]').val();
            if (!shopname&shopname!='-1') {
                layer.msg('请选择合作状态', { time: 1200 });
                return false;
            }
            // var shopphone = $('.layui-layer-content [name=mobile]').val();
            // if (!shopphone) {
            //     layer.msg('4S店电话不能为空！', { time: 1200 });
            //     return false;
            // }
            // var provincename = $('.layui-layer-content [name=province]').val();
            // if (!provincename || -1 == provincename) {
            //     layer.msg('省份名称不能为空！', { time: 1200 });
            //     return false;
            // }
            // var cityname = $('.layui-layer-content [name=city]').val();
            // if (!cityname || -1 == cityname) {
            //     layer.msg('城市名称不能为空！', { time: 1200 });
            //     return false;
            // }
            // var areaname = $('.layui-layer-content [name=district]').val();
            // if (!areaname || -1 == areaname) {
            //     layer.msg('区/县名称不能为空！', { time: 1200 });
            //     return false;
            // }
            // var address = $('.layui-layer-content [name=addressDetail]').val();
            // if (!address) {
            //     layer.msg('详细地址不能为空！', { time: 1200 });
            //     return false;
            // }
            return true;
        }
    }

    var page = new Page();
    page.init();
})
