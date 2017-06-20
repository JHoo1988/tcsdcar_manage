/**
 * 基础数据 - 产品列表
 */
layui.use(['jquery', 'simplePager', 'laydate', 'form', 'layer', 'cookie', 'global','upload', 'upmobui'], function () {
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
        this.pageSize = 10;
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
            //加载产品类别
            _self.getBigCategory(par);
        },

        bindEvent: function () {
            var _self = this;
            $("#btn-search").bind('click', function () {
                var par = _self.getParam();
                // par.startDate = $("#startDate").val();
                // par.endDate = $("#endDate").val();
                var parent =$('.content-box [name=parent]').val();
                if(parent!="-1"){
                    par.parent = parent;
                }
                par.queryStr = $("#cityName").val();

                //param.size = _self.pageSize;
                _self.pageIndex = 1;
                _self.getData(par);
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
                    title: '新增卡券赠送规则',
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
                var par = _self.getParam();
                par.ids = id;
                layer.confirm('是否删这个卡券赠送规则?', {
                    btn: ['是', '否']
                }, function () {
                    $.post(global.url.deleteCouponRole, par, function (data, textStatus, xhr) {
                        if (data.code == 200) {
                            layer.msg('删除成功！', { time: 500 }, function () {
                                _self.getData(par);
                            });
                        } else {
                            layer.msg("删除失败，请重试！", { time: 1000 });
                        }
                    });
                }, function () {
                    layer.closeAll();
                });
            });

            // 编辑项
            $(document).on('click', '.btn-edit', function () {
                var id = $(this).data('id');
                var couponType = $(this).data('coupontype');

                var content = edit_win.html();
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: '编辑卡券赠送规则',
                    area: ['700px', '550px'], //宽高
                    fixed: false, //不固定
                    maxmin: true,
                    content: content
                });
                $('.layui-layer-content [name=couponType]').val(couponType);
                $('.layui-layer-content [name=id]').val(id);
                form.render();
                $("#pop_up").remove();
                _self.addProductAction(1);

            });
            // 选择大类后，调用查询小类接口
            form.on('select(bigCategory)', function () {
                var par = _self.getParam();
                var selectBigCategory = $('.bigCategory option:selected').val();
                _self.getSmallCategory(par, selectBigCategory);
            });
        },
        getParam: function () {
            var par = {};
            par.token = $.cookie('userToken');
            return par;
        },
        getData: function (par) {
            var _self = this;
            par.pageIndex = _self.pageIndex;
            par.pageSize = 14;
            $.ajax({
                url: global.url.findAllCouponRole,
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
                                html += '<td data-ct="' + couponTypeStr + '">' + couponTypeStr + '</td>';
                                html += '<td data-ct="' + dataList[i].parentName+ dataList[i].productCategroyName +'">' + dataList[i].parentName+ dataList[i].productCategroyName + '</td>';
                                // html += '<td>' + dataList[i].createTime + '</td>';
                                html += '<td>'
                                    + '<a href="javascript:void(0);" data-id="' + dataList[i].id + '" data-coupontype="' + dataList[i].couponType + '" class="layui-btn layui-btn-mini btn-edit">编辑</a>'
                                    + '<a href="javascript:void(0);" data-id="' + dataList[i].id + '" class="layui-btn layui-btn-mini layui-btn-danger btn-del">删除</a>'
                                    + '</td>';
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
                if (_self.checkForm(flag)) {
                    _self.layer_index = layer.load(2);
                    var formData = new FormData($("#uploadForm")[0]);
                    formData.append("token",$.cookie('userToken'));
                    $.ajax({
                        url: global.url.saveCouponRole,
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
                                var flagmsg='新增成功！';
                                if(flag==1){
                                    flagmsg='编辑成功！';
                                }
                                layer.msg(flagmsg, { time: 500 }, function () {
                                    var par = _self.getParam();
                                    _self.getData(par);
                                    layer.close(_self.layer_open_index);
                                });
                            } else {
                                $('.js-btn-update')[0].disabled = false;
                                if (data.code == 510) {
                                    layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                        window.parent.location.href = 'login.html';
                                    });
                                }else{
                                    layer.msg('请求失败，请重试', { time: 1200 });
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
        getBigCategory: function (par) {
            var _self = this;
            par.pageIndex = 1;
            par.pageSize = 999;
            par.level = 1;
            $.ajax({
                url: global.url.findAllProductCategory,
                type: 'GET',
                dataType: 'json',
                data: par,
                success: function (data) {
                    if (undefined != data.data && null != data.data && data.code == 200) {
                        var dataList = data.data.content;
                        var len = dataList.length;
                        if (len > 0) {
                            var sb = new _self.StringBuffer();
                            for (var i = 0; i < len; i++) {
                                sb.append("<option value='" + dataList[i].id + "'>" + dataList[i].name + "</option>");
                            }
                            var op = "<option class='bigCategory-option' value='-1'>请选择车型类别一</option>";
                            $(".bigCategory").empty().append(op).append(sb.toString());
                            form.render('select');
                        }

                    }
                }
            })
        },
        getSmallCategory: function (par, selectBigCategory) {
            var _self = this;
            par.pageIndex = 1;
            par.pageSize = 999;
            par.level = 2;
            par.parent = selectBigCategory;
            $.ajax({
                url: global.url.findAllProductCategory,
                type: 'GET',
                dataType: 'json',
                data: par,
                success: function (data) {
                    if (undefined != data.data && null != data.data && data.code == 200) {
                        var dataList = data.data.content;
                        var len = dataList.length;
                        if (len > 0) {
                            var sb = new _self.StringBuffer();
                            for (var i = 0; i < len; i++) {
                                sb.append("<option value='" + dataList[i].id + "'>" + dataList[i].name + "</option>");
                            }
                            var op = "<option class='categroyId-option' value='-1'>请选择车型类别二</option>";
                            $(".productCategroyId").empty().append(op).append(sb.toString());
                            form.render('select');
                        }

                    }
                }
            })
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
        toRoundOff: function (num) {
            if (num.toString().indexOf('.') > -1) {
                num = Number(num.toString().substring(0, num.toString().indexOf('.') + 3));
            }
            return num;
        },
        checkForm: function (flag) {
            var productCategroyId = $('.layui-layer-content [name=productCategroyId]').val();
            if (!productCategroyId || productCategroyId == -1) {
                layer.msg('车型类别二不能为空！', { time: 1200 });
                return false;
            }
            var couponType = $('.layui-layer-content [name=couponType]').val();
            if (!couponType && flag != 1) {
                layer.msg('卡券类型不能为空！', { time: 1200 });
                return false;
            }
            return true;
        }
    }

    var page = new Page();
    page.init();
    layui.upload();
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
})
