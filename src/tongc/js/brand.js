/**
 * 基础数据 - 品牌列表
 */
layui.use(['jquery', 'simplePager', 'laydate', 'form', 'layer', 'cookie', 'global', 'upload','upmobui'], function () {
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
            _self.getData(par);
            _self.bindEvent();
        },

        bindEvent: function () {
            var _self = this;
            $("#btn-search").bind('click', function () {
                var par = _self.getParam();
                par.startDate = $("#startDate").val();
                par.endDate = $("#endDate").val();
                par.queryStr = $("#queryStr").val();

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
                    title: '新增品牌',
                    area: ['700px', '500px'], //宽高
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
                layer.confirm('是否删除此品牌?', {
                    btn: ['是', '否']
                }, function () {
                    $.post(global.url.deleteProductBrands, par, function (data, textStatus, xhr) {
                        if (data.code == 200) {
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
            });

            // 编辑项
            $(document).on('click', '.btn-edit', function () {
                var id = $(this).data('id');
                var name = $(this).data('name');
                var firstChar = $(this).data('firstchar');
                var par = _self.getParam();
                par.id = id;
                par.name = name;
                par.firstChar = firstChar;

                var content = edit_win.html();
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: '编辑品牌',
                    area: ['700px', '500px'], //宽高
                    fixed: false, //不固定
                    maxmin: true,
                    content: content
                });
                $('.layui-layer-content [name=name]').val(name);
                $('.layui-layer-content [name=id]').val(id);
                $('.layui-layer-content [name=firstChar]').val(firstChar);
                form.render();
                $("#pop_up").remove();
                _self.addProductAction(1);

            });

            // 车型类别
            form.on('select(firstChar)', function () {
                var firstChar = $('.layui-layer-content [name=firstChar]').val();
                // alert(firstChar);

            });
            // // 点击图片填充名字
            // $(document).on('change', '.layui-upload-file', function () {
            //     var f = document.getElementsByClassName('layui-upload-file');
            //     var filename = f.logofile.files[0].name;
            //     filename = filename.substring(0,filename.indexOf('.'));
            //     $("input[type='text'][name='name']").val(filename);
            //    // alert(filename) ;
            // });
        },
        getParam: function () {
            var par = {};
            par.token = $.cookie('userToken');
            return par;
        },
        getData: function (par) {
            var _self = this;
            par.pageIndex= _self.pageIndex;
            par.pageSize = _self.pageSize;
            $.ajax({
                url: global.url.findAllProductBrands,
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
                                // html += '<td><img style="height: 30px;" src="' + dataList[i].logo + '"></td>';
                                html += '<td><img style="width: 30px;" src="../../../images/brand/' + dataList[i].id + '.png"></td>';
                                html += '<td>' + dataList[i].firstChar + '</td>';
                                html += '<td>' + dataList[i].name + '</td>';
                                html += '<td>'
                                    + '<a href="javascript:void(0);" data-firstChar="' + dataList[i].firstChar + '" data-id="' + dataList[i].id + '" data-name="' + dataList[i].name + '" class="layui-btn layui-btn-mini btn-edit">编辑</a>'
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
                            layer.msg("暂无品牌", { time: 1200 });
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
                    layer.msg('获取数据失败，请稍后重试！', { time: 500 });
                }
            })
        },
        addProductAction: function (flag) {
            var _self = this;

            $('.js-btn-update').bind('click', function () {
                if (_self.checkForm(flag)) {
                    _self.layer_index = layer.load(2);
                    // var par = _self.getParam();
                    // par.productName = $('.layui-layer-content [name=productName]').val();
                    // par.firstChar = $('.layui-layer-content [name=firstChar]').val();

                    var formData = new FormData($("#uploadForm")[0]);
                    formData.append("token",$.cookie('userToken'));
                    $.ajax({
                        url: global.url.saveProductBrands,
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
                                    layer.msg('操作失败!', { time: 1200 });
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
        checkForm: function (flag) {
            var name = $('.layui-layer-content [name=name]').val();
            if (!name) {
                layer.msg('品牌名称不能为空！', { time: 1200 });
                return false;
            }
            var namef = $('.layui-layer-content [name=logofile]').val();
            if (!namef&&flag!=1) {
                layer.msg('品牌logo不能为空！', { time: 1200 });
                return false;
            }
            return true;
        }
    }

    var page = new Page();
    page.init();

    layui.upload({
        url: 'http://www.baidu.com'
        ,success: function(res){
            console.log(res); //上传成功返回值，必须为json格式
            alert(res);
        }
    });
})
