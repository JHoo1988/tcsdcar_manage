/**
 * 基础数据 - 产品列表
 */
layui.use(['jquery', 'simplePager', 'laydate', 'form', 'element', 'layer', 'cookie', 'global', 'upmobui', 'region'], function () {
    var $ = layui.jquery,
        element = layui.element(),
        layer = layui.layer,
        simplePager = layui.simplePager,
        global = layui.global,
        form = layui.form(),
        upmobui = layui.upmobui;

    //监听折叠
    element.on('collapse(salesmanitem)', function (data) {
        layer.msg('展开状态：' + data.show);
    });

    var Page = function () {
        this.layer_index = null;
        this.layer_open_index = null;
        this.currentProductPrice = 0;
        this.layer_tips = null;
        this.layer_content = null;
        this.rangeBegin = 1;
        this.rangeEnd = 9999;
        this.pageIndex = 1;
        this.pageSize = 13;
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
                _self.par.queryStr = $("#querystr").val();
                //param.size = _self.pageSize;
                _self.pageIndex = 1;
                _self.getData(_self.par);
            });
            // form.on('select(selectprovince)', function () {
            //     var selectprovince = $('.province option:selected').val();
            //     global.getCityByProvinceId(selectprovince);
            // });
            // form.on('select(selectcity)', function () {
            //     var city = $('.city option:selected').val();
            //     global.getAreaByCityId(city);
            // });

            $('.layui-tab-title').on('click', 'li', function () {
                $('#myIframe', parent.document).attr('src', $(this).data('href'));
            });
            // 分配任务
            $(document).on('click', '.btn-distibution', function (evt) {
                var id = $(this).data('id');
                $('#myIframe', parent.document).attr('src', 'distribution.html#'+id);
                // 阻止事件冒泡传递
                evt.stopPropagation();
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
            });
            $(document).on('click', '.btn-hashdistibuted', function () {
                var id = $(this).data('id');
                $('#myIframe', parent.document).attr('src', 'distributed.html#'+id);
            });

            var edit_win = $("#pop_up");
            $("#btn_add").bind('click', function (event) {
                var content = edit_win.html();
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: '新增业务员',
                    area: ['700px', 'auto'], //宽高
                    fixed: false, //不固定
                    maxmin: true,
                    content: content
                });
                form.render();
                $("#pop_up").remove();
                _self.addProductAction();
            });

            // 删除项
            $(document).on('click', '.btn_delete', function (event) {
                    event.preventDefault();
                    var id = $(this).data('id');
                    var par = _self.getParam();
                    par.ids = id;
                    layer.confirm('是否删这个业务员?', {
                        btn: ['是', '否']
                    }, function () {
                        $.post(global.url.deleteSalesMan, par, function (data, textStatus, xhr) {
                            if (data.code == '200') {
                                layer.msg('删除成功！', { time: 500 }, function () {
                                    _self.getData(par);
                                });
                            } else {
                                layer.msg("删除失败，请重试！", { time: 500 });
                            }
                        });
                    }, function () {
                        layer.closeAll();
                    });
                }
            );

            // 编辑项
            $(document).on('click', '.btn-edit', function () {
                var id = $(this).data('id');
                var name = $(this).data('name');
                var mobile = $(this).data('mobile');
                var content = edit_win.html();
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: '编辑业务员',
                    area: ['700px', 'auto'], //宽高
                    fixed: false, //不固定
                    maxmin: true,
                    content: content
                });
                $('.layui-layer-content [name=name]').val(name);
                $('.layui-layer-content [name=mobile]').val(mobile);
                form.render();
                $("#pop_up").remove();
                _self.addProductAction(id);

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
        }
        ,
        getParam: function () {
            var par = {};
            par.token = $.cookie('userToken');
            return par;
        }
        ,
        getData: function (par) {
            var _self = this;
            par.pageIndex = _self.pageIndex;
            par.pageSize = _self.pageSize;
            $.ajax({
                url: global.url.findSalesMan,
                type: 'GET',
                dataType: 'json',
                data: par,
                beforeSend: function () {
                    _self.layer_index = layer.load(2);
                },
                success: function (data) {
                    layer.close(_self.layer_index);
                    if (undefined != data.data && null != data.data && data.code == '200') {
                        var dataList = data.data.content;
                        var html = "";
                        var len = dataList.length;
                        var flag = false;
                        if (len > 0) {
                            for (var i = 0; i < len; i++) {
                                html += '<tr>';
                                html += '<td>' + (i - 0 + 1) + '</td>';
                                // html += '<td data-ct="查看分配给他的店铺">' + dataList[i].productName + '</td>';
                                html += '<td><a data-ct="查看分配给他的店铺" href="javascript:void(0);" data-id="' + dataList[i].id + '" class="btn-hashdistibuted">' + dataList[i].name + '</a></td>';
                                html += '<td>' + dataList[i].mobile + '</td>';
                                html += '<td>'
                                    + '<a data-ct="为他给分配店铺" href="javascript:void(0);" data-id="' + dataList[i].id + '" class="btn-distibution">分配店铺</a>'
                                    + '<a href="javascript:void(0);" data-id="' + dataList[i].id + '" data-name="' + dataList[i].name + '" data-mobile="' + dataList[i].mobile + '" class="btn-edit">编辑</a>'
                                    + '<a data-ct="删除这个业务员" href="javascript:void(0);" data-id="' + dataList[i].id + '" class="btn_delete">删除</a>'
                                    + '</td>';
                                html += '</tr>';
                            }
                            $("#dg_list tbody").empty().append(html);

                            if (flag) {
                                $('.js-p-discount').show();
                            } else {
                                $('.js-p-discount').hide();
                            }


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
                            $('.pager-footer').hide();
                            layer.msg("没有相关数据", { time: 1200 });
                        }
                        if (typeof successCallback === "function") {
                            successCallback(data.code);
                        }
                        setTimeout(function () {
                            $('#myIframe', parent.document).height($('#myIframe', parent.document).contents().find('body').height());
                        }, 100)
                    } else {
                        // $("#dg_list tbody").empty();
                        $('.pager-footer').hide();
                        if (data.code == 510) {
                            layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                window.parent.location.href = 'login.html';
                            });
                        }else{
                            setTimeout(function () {
                                $('#myIframe', parent.document).height($('#myIframe', parent.document).contents().find('body').height());
                                layer.msg("没有相关数据", { time: 1200 });
                            }, 100);
                        }
                    }
                },
                error: function (e) {
                    layer.close(_self.layer_index);
                    layer.msg('获取数据失败，请稍后重试！', { time: 500 });
                }
            })
        }
        ,
        addProductAction: function (id) {
            var _self = this;
            var flagmsg = '新增';
            $('.js-btn-update').bind('click', function () {
                if (_self.checkForm()) {
                    _self.layer_index = layer.load(2);
                    var formData = new FormData($("#uploadForm")[0]);
                    formData.append("token", $.cookie('userToken'));
                    if (id) {
                        flagmsg = '编辑';
                        formData.append("id", id);
                    }
                    $.ajax({
                        url: global.url.saveSalesMan,
                        type: 'POST',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        beforeSend: function () {
                            // $('.js-btn-update')[0].disabled = true;
                            $('#btn-update').addClass('layui-btn-disabled');
                        },
                        success: function (data) {
                            layer.close(_self.layer_index);
                            if (undefined != data && null != data && data.code == '200') {
                                layer.msg(flagmsg + '成功！', { time: 500 }, function () {
                                    _self.getData(_self.par);
                                    layer.close(_self.layer_open_index);
                                });
                            }else if(data.code == '500'){
                                layer.msg(flagmsg + '失败！已存在相同手机号的业务员', { time: 1500 },function () {
                                    $('#btn-update').removeClass('layui-btn-disabled');
                                });
                            } else {
                                layer.msg(flagmsg + '失败！请稍后重试', { time: 1000 },function () {
                                    $('#btn-update').removeClass('layui-btn-disabled');
                                });
                            }
                        },
                        error: function (e) {
                            // $('.js-btn-update')[0].disabled = false;
                            $('#btn-update').removeClass('layui-btn-disabled');
                            layer.close(_self.layer_index);
                            layer.msg('系统错误，请稍后重试！', { time: 1000 });
                        }
                    })
                }
            });
        }
        ,
        checkForm: function () {
            var name = $('.layui-layer-content [name=name]').val();
            if (!name) {
                layer.msg('业务员名称不能为空！', { time: 1200 });
                return false;
            }
            var mobile = $('.layui-layer-content [name=mobile]').val();
            if (!mobile) {
                layer.msg('业务员电话不能为空！', { time: 1200 });
                return false;
            }
            if (!global.isPhone(mobile)) {
                layer.msg('请输入正确的手机号码！', { time: 1200 });
                return false;
            }
            // var provincename = $('.layui-layer-content [name=selectprovince]').val();
            // if (!provincename || -1 == provincename) {
            //     layer.msg('省份名称不能为空！', { time: 1200 });
            //     return false;
            // }
            // var cityname = $('.layui-layer-content [name=selectcity]').val();
            // if (!cityname || -1 == cityname) {
            //     layer.msg('城市名称不能为空！', { time: 1200 });
            //     return false;
            // }
            // var areaname = $('.layui-layer-content [name=areaname]').val();
            // if (!areaname || -1 == areaname) {
            //     layer.msg('区/县名称不能为空！', { time: 1200 });
            //     return false;
            // }
            // var address = $('.layui-layer-content [name=address]').val();
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
