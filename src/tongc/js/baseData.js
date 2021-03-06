/**
 * 基础数据 - 产品列表
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
        this.pageSize = 13;
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
                par.productName = $("#productName").val();

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
                    title: '新增产品',
                    area: ['700px', '500px'], //宽高
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
                layer.confirm('是否删除此产品?', {
                    btn: ['是', '否']
                }, function () {
                    $.post(global.url.deleteProduct, par, function (data, textStatus, xhr) {
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
                var productName = $(this).data('productname');
                var productAttribution = $(this).data('productattribution');
                var twelveCyclePrice = $(this).data('twelvecycleprice');
                var twentyFourCyclePrice = $(this).data('twentyfourcycleprice');
                var thirtySixCyclePrice = $(this).data('thirtysixcycleprice');
                var productDesc = $(this).data('productdesc');
                var par = _self.getParam();
                par.id = id;
                par.productName = productName;
                par.productAttribution = productAttribution;
                par.twelveCyclePrice = twelveCyclePrice;
                par.twentyFourCyclePrice = twentyFourCyclePrice;
                par.thirtySixCyclePrice = thirtySixCyclePrice;
                par.productDesc = productDesc;

                var content = edit_win.html();
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: '编辑产品',
                    area: ['700px', '500px'], //宽高
                    content: content
                });
                $('.layui-layer-content [name=productName]').val(productName);
                $('.layui-layer-content [name=id]').val(id);
                $('.layui-layer-content [name=twelveCyclePrice]').val(twelveCyclePrice);
                $('.layui-layer-content [name=twentyFourCyclePrice]').val(twentyFourCyclePrice);
                $('.layui-layer-content [name=thirtySixCyclePrice]').val(thirtySixCyclePrice);
                $('.layui-layer-content [name=productDesc]').val(productDesc);
                $('.layui-layer-content [name=productAttribution]').val(productAttribution);
                form.render();
                $("#pop_up").remove();
                _self.addProductAction(1);

            });

            // 车型类别
            form.on('select(productAttribution)', function () {
                var productAttribution = $('.layui-layer-content [name=productAttribution]').val();
                // alert(productAttribution);

            });
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
                url: global.url.findProductList,
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
                                html += '<td><img style="height: 30px;" src="../../../images/product/' + dataList[i].id + '.png"></td>';
                                // html += '<td><img style="height: 30px;" src="' + dataList[i].imageUrl + '"></td>';
                                html += '<td>' + dataList[i].brandsName +dataList[i].productName + '</td>';
                                html += '<td>' +dataList[i].bigCategoryName+dataList[i].smallCategoryName + '</td>';
                                html += '<td>￥<span style="color: #FF5722">' + dataList[i].twelveCyclePrice + '</span> /12期；￥<span style="color: #FF5722">'+dataList[i].twentyFourCyclePrice+'</span> /24期；￥<span style="color: #FF5722">'+dataList[i].thirtySixCyclePrice+'</span> /36期；</td>';
                                html += '<td>' + dataList[i].createTimeStr + '</td>';
                                html += '<td >' + dataList[i].productDesc + '</td>';
                                html += '<td>'
                                    + '<a href="javascript:void(0);" data-productdesc="' + dataList[i].productDesc + '" data-thirtysixcycleprice="' + dataList[i].thirtySixCyclePrice + '" data-twentyfourcycleprice="' + dataList[i].twentyFourCyclePrice + '" data-twelvecycleprice="' + dataList[i].twelveCyclePrice + '" data-productattribution="' + dataList[i].productAttribution + '" data-id="' + dataList[i].id + '" data-productname="' + dataList[i].productName + '" class="layui-btn layui-btn-mini btn-edit">编辑</a>'
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
                            layer.msg("暂无产品", { time: 1200 });
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
                    layer.msg('获取数据失败，请稍后重试！', { time: 500 });
                }
            })
        },
        addProductAction: function (flag) {
            var _self = this;

            $('.js-btn-update').bind('click', function () {
                if (_self.checkForm(flag)) {
                    // var par = _self.getParam();
                    // par.productName = $('.layui-layer-content [name=productName]').val();
                    // par.productAttribution = $('.layui-layer-content [name=productAttribution]').val();
                    // par.twelveCyclePrice = $('.layui-layer-content [name=twelveCyclePrice]').val();
                    // par.twentyFourCyclePrice = $('.layui-layer-content [name=twentyFourCyclePrice]').val();
                    // par.thirtySixCyclePrice = $('.layui-layer-content [name=thirtySixCyclePrice]').val();
                    // par.productDesc = $('.layui-layer-content [name=productDesc]').val();

                    _self.layer_index = layer.load(2);
                    var formData = new FormData($("#uploadForm")[0]);
                    formData.append("token",$.cookie('userToken'));
                    //36ee4dd84f8448ab9343cff51899813a 大众
                    //24347abc21b042458259f124553615fb 奥迪
                    // formData.append("brands",'44d77e1ee14e47d390b3ee02b0ad5a47');//宝马
                    // formData.append("bigCategory",'52bb8da7fe60427e97c294dd739f0d76');//进口轿车
                    // formData.append("smallCategory",'935d67cea04342cd8a8a916f45381371');
                    $.ajax({
                        url: global.url.addProduct,
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
            var name = $('.layui-layer-content [name=productName]').val();
            if (!name) {
                layer.msg('产品名称不能为空！', { time: 1200 });
                return false;
            }
            var twelveCyclePrice = $('.layui-layer-content [name=twelveCyclePrice]').val();
            if (!twelveCyclePrice) {
                layer.msg('12期价格不能为空！', { time: 1200 });
                return false;
            }

            var twentyFourCyclePrice = $('.layui-layer-content [name=twentyFourCyclePrice]').val();
            if (!twentyFourCyclePrice) {
                layer.msg('24期价格不能为空！', { time: 1200 });
                return false;
            }

            var thirtySixCyclePrice = $('.layui-layer-content [name=thirtySixCyclePrice]').val();
            if (!thirtySixCyclePrice) {
                layer.msg('36期价格不能为空！', { time: 1200 });
                return false;
            }
            var namef = $('.layui-layer-content [name=imagefile]').val();
            if (!namef&&flag!=1) {
                layer.msg('图片不能为空！', { time: 1200 });
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
