/**
 * 基础数据 - 产品列表
 */
layui.use(['jquery', 'simplePager', 'laydate', 'form', 'layer', 'cookie', 'global', 'upload', 'upmobui'], function () {
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
        this.par = this.getParam();
    };

    Page.prototype = {

        init: function () {
            var _self = this;
            upmobui.common.pageFunc(); // 页面共用方法
            simplePager.init();
            upmobui.common.findBalanceForParent();
            _self.getAllBrands(_self.par);
            _self.getData(_self.par);
            _self.bindEvent();
        },

        bindEvent: function () {
            var _self = this;
            $("#btn-search").bind('click', function () {
                _self.par.brands = $(".brands_search").val();
                _self.pageIndex=1;
                if(_self.par.brands&&_self.par.brands!=-1){
                    _self.getDataM(_self.par);
                }else {
                    _self.getData(_self.par);
                }
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
                var brands = $(this).data('brands');

                var content = edit_win.html();
                _self.layer_open_index = layer.open({
                    type: 1,
                    title: '编辑产品',
                    area: ['700px', '500px'], //宽高
                    fixed: false, //不固定
                    maxmin: true,
                    content: content
                });
                $('.layui-layer-content [name=productName]').val(productName);
                $('.layui-layer-content [name=id]').val(id);
                $('.layui-layer-content [name=twelveCyclePrice]').val(twelveCyclePrice);
                $('.layui-layer-content [name=twentyFourCyclePrice]').val(twentyFourCyclePrice);
                $('.layui-layer-content [name=thirtySixCyclePrice]').val(thirtySixCyclePrice);
                $('.layui-layer-content [name=productDesc]').val(productDesc);
                $('.layui-layer-content [name=productAttribution]').val(productAttribution);
                $('.layui-layer-content [name=brands]').val(brands);
                form.render();
                $("#pop_up").remove();
                _self.addProductAction(1);

            });

            // 车型类别
            form.on('select(productAttribution)', function () {
                var productAttribution = $('.layui-layer-content [name=productAttribution]').val();
                // alert(productAttribution);

            });
            // 点击图片填充名字
            // $(document).on('change', '.layui-upload-file', function () {
            //     var f = document.getElementsByClassName('layui-upload-file');
            //     var filename = f.imagefile.files[0].name;
            //     filename = filename.substring(0,filename.indexOf('.'));
            //     // var fileArray= filename.split('-');
            //     $("input[type='text'][name='productName']").val(filename);
            //     // $("input[type='text'][name='productName']").val(fileArray[0]);
            //     // $("input[type='text'][name='twelveCyclePrice']").val(fileArray[1]);
            //     // $("input[type='text'][name='twentyFourCyclePrice']").val(fileArray[2]);
            //     // $("input[type='text'][name='thirtySixCyclePrice']").val(fileArray[3]);
            //     // alert(filename) ;
            // });
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
                                html += '<td><img style="width: 30px;" src="../../../images/product/' + dataList[i].id + '.png"></td>';
                                // html += '<td><img style="height: 30px;" src="' + dataList[i].imageUrl + '"></td>';
                                html += '<td>' + dataList[i].brandsName + dataList[i].productName + '</td>';
                                // html += '<td>' + dataList[i].bigCategoryName + dataList[i].smallCategoryName + '</td>';
                                html += '<td>￥<span style="color: #FF5722">' + dataList[i].twelveCyclePrice + '</span> /12期；￥<span style="color: #FF5722">' + dataList[i].twentyFourCyclePrice + '</span> /24期；￥<span style="color: #FF5722">' + dataList[i].thirtySixCyclePrice + '</span> /36期；</td>';
                                html += '<td>' + dataList[i].createTimeStr + '</td>';
                                html += '<td >' + dataList[i].productDesc + '</td>';
                                html += '<td>'
                                    + '<a href="javascript:void(0);" data-productdesc="' + dataList[i].productDesc + '" data-thirtysixcycleprice="' + dataList[i].thirtySixCyclePrice + '" data-twentyfourcycleprice="' + dataList[i].twentyFourCyclePrice + '" data-twelvecycleprice="' + dataList[i].twelveCyclePrice + '" data-productattribution="' + dataList[i].productAttribution + '" data-id="' + dataList[i].id + '"  data-brands="' + dataList[i].brands + '" data-productname="' + dataList[i].productName + '" class="layui-btn layui-btn-mini btn-edit">编辑</a>'
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
        getDataM:function (par) {
            var _self = this;
            par.pageIndex = _self.pageIndex;
            par.pageSize = _self.pageSize;
            $.ajax({
                url: global.url.findProductListm,
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
                                html += '<td><img style="width: 30px;" src="../../../images/product/' + dataList[i].id + '.png"></td>';
                                // html += '<td><img style="height: 30px;" src="' + dataList[i].imageUrl + '"></td>';
                                html += '<td>' + dataList[i].brandsName + dataList[i].productName + '</td>';
                                // html += '<td>' + dataList[i].bigCategoryName + dataList[i].smallCategoryName + '</td>';
                                html += '<td>￥<span style="color: #FF5722">' + dataList[i].twelveCyclePrice + '</span> /12期；￥<span style="color: #FF5722">' + dataList[i].twentyFourCyclePrice + '</span> /24期；￥<span style="color: #FF5722">' + dataList[i].thirtySixCyclePrice + '</span> /36期；</td>';
                                html += '<td>' + dataList[i].createTimeStr + '</td>';
                                html += '<td >' + dataList[i].productDesc + '</td>';
                                html += '<td>'
                                    + '<a href="javascript:void(0);" data-productdesc="' + dataList[i].productDesc + '" data-thirtysixcycleprice="' + dataList[i].thirtySixCyclePrice + '" data-twentyfourcycleprice="' + dataList[i].twentyFourCyclePrice + '" data-twelvecycleprice="' + dataList[i].twelveCyclePrice + '" data-productattribution="' + dataList[i].productAttribution + '" data-brands="' + dataList[i].brands + '" data-id="' + dataList[i].id + '" data-productname="' + dataList[i].productName + '" class="layui-btn layui-btn-mini btn-edit">编辑</a>'
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
                                    _self.getDataM(par);
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
                    _self.layer_index = layer.load(2);
                    var formData = new FormData($("#uploadForm")[0]);
                    formData.append("token", $.cookie('userToken'));
                    // formData.append("brands",'44d77e1ee14e47d390b3ee02b0ad5a47');//宝马
                    formData.append("bigCategory", '341b79aef4844d0c9fc2645fe5fdac42');//国产轿车
                    formData.append("smallCategory", 'a89e758c691f4979b97b766b7ac40c4d');//中型
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
                                if (flag == 1) {
                                    fmsg = '编辑成功！';
                                }
                                layer.msg(fmsg, { time: 500 }, function () {
                                    if(_self.par.brands&&_self.par.brands!=-1){
                                        _self.getDataM(_self.par);
                                    }else {
                                        _self.getData(_self.par);
                                    }
                                    // _self.getData(_self.par);
                                    layer.close(_self.layer_open_index);
                                });
                            } else {
                                layer.close(_self.layer_index);
                                $('.js-btn-update')[0].disabled = false;
                                if (data.code == 510) {
                                    layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                        window.parent.location.href = 'login.html';
                                    });
                                } else {
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
            var brandid = $('.layui-layer-content [name=brands]').val();
            if (!brandid || brandid == -1) {
                layer.msg('所属品牌不能为空！', { time: 1200 });
                return false;
            }
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
            if (!namef && flag != 1) {
                layer.msg('图片不能为空！', { time: 1200 });
                return false;
            }
            return true;
        },
        getAllBrands: function (par) {
            var _self = this;
            par.pageIndex = 1;
            par.pageSize = 99999;
            $.ajax({
                url: global.url.findAllProductBrands,
                type: 'GET',
                dataType: 'json',
                data: par,
                success: function (data) {
                    if (undefined != data.data && null != data.data && data.code == 200) {
                        var dataList = data.data.content;
                        var sb = new _self.StringBuffer();
                        $.each(dataList, function (i, val) {
                            sb.append("<option value='" + val.id + "'>" + val.name + "</option>");
                        });
                        var op = "<option class='brands-option' value='-1'>请选择品牌</option>";
                        $(".brands_search").empty().append(op).append(sb.toString());
                        $(".brands").empty().append(op).append(sb.toString());
                        form.render('select');
                    }
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
        }
    }

    var page = new Page();
    page.init();

    layui.upload({
        url: 'http://www.baidu.com'
        , success: function (res) {
            console.log(res); //上传成功返回值，必须为json格式
            alert(res);
        }
    });
})
