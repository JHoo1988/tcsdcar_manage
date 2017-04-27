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
    };

    Page.prototype = {

        init: function () {
            var _self = this;
            var par = _self.getParam();
            upmobui.common.pageFunc(); // 页面共用方法
            simplePager.init();
            upmobui.common.findBalanceForParent();
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
                if(province&&province!='-1'){
                    par.province = province;
                }
                par.level = 4;
                var city = $('.content-box [name=selectcity]').val();
                if (city&&city!='-1'){
                    par.city = city;
                }
                _self.pageIndex = 1;
                _self.getData(par);
            });

            form.on('select(selectprovince)', function(){
                var selectprovince = $('.province option:selected').val();
                global.getCityByProvinceId(selectprovince);
            });

            form.on('select(selectprovince-add)', function(){
                var selectprovince = $('.layui-layer-content .province option:selected').val();
                _self.getCityByProvinceId(selectprovince);
                // alert(selectprovince);
            });

            $('.layui-tab-title').on('click', 'li', function () {
                $('#myIframe', parent.document).attr('src', $(this).data('href'));
            });

            $('#dg_list').on('mouseover mouseout', 'td', function (event) {

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
                    title: '新增区/县',
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
                var par = _self.getParam();
                par.id = id;
                layer.confirm('是否删这一地区?', {
                    btn: ['是', '否']
                }, function () {
                    $.post(global.url.deleteProduct, par, function (data, textStatus, xhr) {
                        if (data.code == 200) {
                            layer.msg('删除成功！', { time: 500 }, function () {
                                _self.getData(par);
                            });
                        } else {
                            if (data.code == 510) {
                                layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                    window.parent.location.href = 'login.html';
                                });
                            }else{
                                layer.msg("删除失败，请重试！", { time: 500 });
                            }
                        }
                    });
                }, function () {
                    layer.closeAll();
                });
            });

            // 编辑项
            $(document).on('click', '.btn-edit', function () {
                var id = $(this).data('id');
                var cityName = $(this).data('cityname');
                var provinceName = $(this).data('provincename');
                var name = $(this).data('name');
                var par = _self.getParam();
                par.id = id;
                par.cityName = cityName;
                par.provinceName = provinceName;

                var content = edit_win.html();
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: '编辑城市',
                    area: ['700px', 'auto'], //宽高
                    fixed: false, //不固定
                    maxmin: true,
                    content: content
                });
                // $('.layui-layer-content [name=selectprovince-add]').val(provinceName);
                // $('.layui-layer-content [name=parent]').val(cityName);
                $('.layui-layer-content [name=name]').val(name);
                $('.layui-layer-content [name=id]').val(id);
                form.render();
                $("#pop_up").remove();
                _self.addProductAction(1);

            });
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
                url: global.url.findAllDistrict,
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
                                html += '<td data-ct="' + dataList[i].name + '">' + dataList[i].name + '</td>';
                                html += '<td data-ct="' + dataList[i].provinceName +'">' + dataList[i].provinceName + '</td>';
                                html += '<td data-ct="' + dataList[i].cityName +'">' + dataList[i].cityName + '</td>';
                                html += '<td>' + dataList[i].createTimeStr + '</td>';
                                html += '<td>'
                                    + '<a href="javascript:void(0);" data-id="' + dataList[i].id + '" data-provincename="' + dataList[i].province + '" data-cityname="' + dataList[i].city + '" data-name="' + dataList[i].name + '" class="layui-btn layui-btn-mini btn-edit">编辑</a>'
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
                            $("#dg_list tbody").empty().append(html);
                            layer.msg('没有相关数据！', { time: 1500 });
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
                    formData.append("level",4);
                    formData.append("token",$.cookie('userToken'));
                    $.ajax({
                        url: global.url.addArea,
                        type: 'POST',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        beforeSend: function () {
                            $('.js-btn-update')[0].disabled = true;
                        },
                        success: function (data) {
                            if (undefined != data && null != data && data.code == 200) {
                                layer.close(_self.layer_index);
                                var fmsg = '新增成功！';
                                if(flag==1){
                                    fmsg = '编辑成功！';
                                }
                                layer.msg(fmsg, { time: 500 }, function () {
                                    var par = _self.getParam();
                                    _self.getData(par);
                                    layer.close(_self.layer_open_index);
                                });
                            } else {
                                layer.close(_self.layer_index);
                                $('.js-btn-update')[0].disabled = false;
                                if (data.code == 510) {
                                    layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                        window.parent.location.href = 'login.html';
                                    });
                                }else{
                                    layer.msg("删除失败，请重试！", { time: 500 });
                                }
                            }
                        },
                        error: function (e) {
                            $('.js-btn-update')[0].disabled = false;
                            layer.close(_self.layer_index);
                            layer.msg('系统错误，请稍后重试！', { time: 500 });
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
        checkForm: function () {
            var provincename = $('.layui-layer-content [name=selectprovince-add]').val();
            if (provincename&&provincename=='-1') {
                layer.msg('省份名称不能为空！', { time: 1200 });
                return false;
            }
            var cityname = $('.layui-layer-content [name=parent]').val();
            if (cityname&&cityname=='-1') {
                layer.msg('城市名称不能为空！', { time: 1200 });
                return false;
            }
            var areaname = $('.layui-layer-content [name=name]').val();
            if (!areaname) {
                layer.msg('区/县名称不能为空！', { time: 1200 });
                return false;
            }
            return true;
        }
    }

    var page = new Page();
    page.init();
})
