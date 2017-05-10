/**
 * Created by dell on 2016/10/11.
 */
/**
 * Created by dell on 2016/9/23.
 */
layui.use(['jquery', 'layedit', 'md5', 'simplePager', 'laydate', 'layer', 'cookie', 'global', 'upmobui', 'form'], function () {
    var $ = layui.jquery,
        layer = layui.layer,
        simplePager = layui.simplePager,
        global = layui.global,
        form = layui.form(),
        upmobui = layui.upmobui;

    var Page = function () {
        this.pageIndex = 1;
        this.pageSize = 14;
        this.totalPage = 0;
        this.totalSize = 0;
        this.defaultPay = 0;
        this.oldCodeData;
        this.layer_open_index;
        this.layer_load_index;
        this.pollingTime = 60 * 1000;
        this.businessDiscount = 10;
        this.param = this.getParam();
        this.param.status = '1,2,5';
        // this.param.userId = $.cookie('userId');
    }

    Page.prototype = {
        init: function () {
            var _self = this;
            upmobui.common.pageFunc();	// 页面共用方法
            upmobui.common.findBalanceForParent();
            simplePager.init();

            _self.initOrderInPage(_self.param);
            global.getAllProvince();
            _self.bindEvent();
            var userModel = decodeURIComponent($.cookie('userModel'));
            if (userModel == '0') {
                $('.carno').css('display', 'block');
                $('.kehumobile').css('display', 'block');
            }
        },
        bindEvent: function () {
            var _self = this;

            //查询
            $('#btn-search').on('click', function () {
                // param.userId = $.cookie('userId');
                var statu = $('#statu option:selected').val();
                if (statu && statu != '-1') {
                    _self.param.status = statu;
                } else {
                    _self.param.status = '1,2,5';
                }
                var timeLimit = $('#timelimit option:selected').val();
                if (timeLimit && timeLimit != '-1') {
                    _self.param.timeLimit = timeLimit;
                } else {
                    delete _self.param.timeLimit;
                }
                var endTime = $('#orderEndTime').val();
                if (endTime) {
                    _self.param.endTime = endTime;
                } else {
                    delete _self.param.endTime;
                }
                var startTime = $('#orderStartTime').val();
                if (startTime) {
                    _self.param.startTime = startTime;
                } else {
                    delete _self.param.startTime;
                }
                var queryStr = $('#keyWord').val();
                if (queryStr) {
                    _self.param.queryStr = queryStr;
                } else {
                    delete _self.param.queryStr;
                }
                _self.param.pageSize = _self.pageSize;
                _self.pageIndex = 1;
                _self.initOrderInPage(_self.param);
            });
            var edit_win = $("#pop_up");
            // 编辑订单
            $('#table-list').on('click', '.btn-edit', function () {
                    // var speed=200;//滑动的速度
                    // $('#table-list').animate({ scrollTop: 0 }, speed);
                    var content = edit_win.html();
                    _self.layer_open_index = layer.open({
                        type: 1,
                        title: '编辑订单',
                        area: ['700px', 'auto'], //宽高
                        fixed: false, //不固定
                        maxmin: true,
                        offset: '100px',
                        content: content
                    });
                    var id = $(this).data('id');
                    var mobile = $(this).data('mobile');
                    var carbodyno = $(this).data('carbodyno');
                    var statu = $(this).data('statu');
                    var product = $(this).data('product');
                    $('.layui-layer-content [name=id]').val(id);
                    $('.layui-layer-content [name=mobile]').val(mobile);
                    $('.layui-layer-content [name=carBodyNo]').val(carbodyno);
                    $('.layui-layer-content [name=statu]').val(statu);
                    $('.layui-layer-content [name=product]').val(product);
                    form.render();
                    $("#pop_up").remove();
                    _self.addProductAction();
                }
            );
            // 删除订单
            $('#table-list').on('click', '.btn-del', function () {
                    event.preventDefault();
                    var id = $(this).data('id');
                    _self.param.ids = id;
                    layer.confirm('是否删这个订单?', {
                        btn: ['是', '否']
                    }, function () {
                        $.post(global.url.deleteOrder, _self.param, function (data, textStatus, xhr) {
                            if (data.code == 200) {
                                layer.msg('删除成功！', { time: 500 }, function () {
                                    _self.initOrderInPage(_self.param);
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
            // $('.track-tab-title', parent.document).on('click', 'li', function () {
            //
            //     $(this).addClass('track-this').siblings().removeClass('track-this');
            //     var index = $(this).index();
            //     $('.track-tab-content').find('.track-tab-item').eq(index).addClass('track-show').siblings().removeClass('track-show');
            // });

            $('.upp-close').bind('click', function () {
                $('.discount').hide();
            });
            // 全选
            $('.allChoose').on('change', function () {
                if ($("input[type='checkbox'][name='allChoose']")[0].checked) {
                    _self.selectAll();
                    $('#btn-export').removeClass('layui-btn-disabled');
                } else {
                    _self.unSelectAll();
                    $('#btn-export').addClass('layui-btn-disabled');
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
                    $('#btn-export').removeClass('layui-btn-disabled');
                } else {
                    $('#btn-export').addClass('layui-btn-disabled');
                }
            });


            //批量发短信
            $('#btn-export').on('click', function () {
                var checkboxList = $("input[type='checkbox'][name='singlChoose']");
                var checked = false;
                for (var i = 0; i < checkboxList.length; i++) {
                    if ($("input[type='checkbox'][name='singlChoose']")[i].checked) {
                        checked = true;
                        break;
                    }
                }
                if (checked) {
                    layer.confirm('是否发送续保短信?', {
                        btn: ['是', '否']
                    }, function () {
                        var par = _self.getParam();
                        var ids = '[';
                        var id = new Array();
                        var checkboxList = $("input[type='checkbox'][name='singlChoose']");
                        for (var i = 0; i < checkboxList.length; i++) {
                            if ($("input[type='checkbox'][name='singlChoose']")[i].checked) {
                                ids += $("input[type='checkbox'][name='singlChoose']")[i].value + ",";
                                id.push($("input[type='checkbox'][name='singlChoose']")[i].value);
                            }
                        }
                        ids += ']';
                        // par.ids = ids;
                        par.ids = id.toString();
                        layer.closeAll();
                        $.post(global.url.sendmms, par, function (data, textStatus, xhr) {
                            if (data.code == 200) {
                                layer.msg('短信发送成功！', { time: 500 });
                            } else {
                                layer.msg("短信发送失败，请重试！", { time: 500 });
                            }
                        });
                    }, function () {
                        layer.closeAll();
                    });
                } else {
                    layer.msg('请选择一个订单', { time: 1200 });
                }
            });
            $(document).on('click', '.checkpaids', function (){
                var _self = this;
                var param = {};
                param.pageIndex = 1;
                param.pageSize = 99;
                var id = $(this).data('id');
                if (!id) {
                    return;
                } else {
                    param.orderId = id;
                }
                $.ajax({
                    url: global.url.findPaidRecordsList,
                    type: 'GET',
                    dataType: 'json',
                    data: param,
                    beforeSend: function () {
                        _self.layer_index = layer.load(2);
                    },
                    success: function (result) {
                        layer.close(_self.layer_index);
                        if (result.code == 200) {
                            var content = result.data.content;
                            var text = '<div>';
                            if (content && content.length > 0) {
                                for (var i = 0; i < content.length; i++) {
                                    text+='<p>第' + (i+1) + '次赔付时间：' + content[i].createTime+'</p><br>';
                                }
                            } else {
                                text += '<p>暂无赔付记录</p><br>';
                            }
                            text+='</div>';
                            layer.open({
                                title: '赔付记录'
                                ,content: text
                            });
                        }
                    }
                });
            });
        },
        selectAll: function () {
            // var checkboxList = $("input[type='checkbox'][name='singlChoose']");
            // for (var i = 0; i < checkboxList.length; i++) {
            //     $("input[type='checkbox'][name='singlChoose']")[i].checked = true;
            // }

            var checkboxList = $("input[type='checkbox'][name='singlChoose']");
            var num = 0;
            for (var i = 0; i < checkboxList.length; i++) {
                $("input[type='checkbox'][name='singlChoose']")[i].checked = true;
                num = i;
            }
            if (num > 0) {
                $('#btn-export').removeClass('layui-btn-disabled');
            }
        },
        unSelectAll: function () {
            // var checkboxList = $("input[type='checkbox'][name='singlChoose']");
            // for (var i = 0; i < checkboxList.length; i++) {
            //     $("input[type='checkbox'][name='singlChoose']")[i].checked = false;
            // }
            var checkboxList = $("input[type='checkbox'][name='singlChoose']");
            for (var i = 0; i < checkboxList.length; i++) {
                $("input[type='checkbox'][name='singlChoose']")[i].checked = false;
            }
            $('#btn-export').addClass('layui-btn-disabled');
        },
        initOrderInPage: function (param) {
            var _self = this;
            param.pageIndex = _self.pageIndex;
            param.pageSize = _self.pageSize;
            $.ajax({
                url: global.url.findOrderList,
                type: 'GET',
                dataType: 'json',
                data: param,
                beforeSend: function () {
                    _self.layer_index = layer.load(2);
                },
                success: function (result) {
                    layer.close(_self.layer_index);
                    if (result.code == 200) {
                        $('#table-list').empty();
                        var data = result.data;
                        var orderStatus;
                        var orderproduct;
                        var orderStatusContent;
                        var tableHead = '';
                        if (data != undefined) {
                            $.each(data.content, function (i, val) {
                                var tableItem = $('<div class="table-item"></div>');
                                orderStatus = val.statu;
                                orderproduct = val.product;
                                orderStatusContent = _self.checkOrderStatus(orderStatus);
                                tableHead = '<div class="table-item-head">'
                                    + '<table><tr><td><input style="width:18px;height: 18px;" type="checkbox" class="singlChoose" name="singlChoose" value="' + val.id + '"><span style="line-height: 42px;margin-left: 5px;">选择</span> </td><td><b class="c-blue">' + '' + '</b><span class="td-sequence" >质保时间：' + val.createTimeStr + ' 至 ' + val.endTimeStr + '</span><span class="td-sequence" >订单号：' + val.orderNo + '</span></td></tr></table></div>';

                                var tableListContent = '<div class="table-list-c"><table><thead>'
                                    + '<th style="width: 65%;"></th> <th style="width: 17.5%;"></th><th style="width: 17.5%;"></th></thead>'
                                    + '<tbody>';

                                var productsListLength = 1;
                                // var productsListLength = val.products.length - 1;
                                // if (productsListLength > 4) {
                                //     productsListLength = 4;
                                // }

                                // for (var j = 0; j < productsListLength; j++) {
                                //     tableListContent += '<tr><td>产品名称：' + val.productName + '</td>'
                                //         + '<td>￥' + val.twelveCyclePrice + '</td>'
                                //         + '<td>' + val.twelveCyclePrice + '</td></tr>'
                                // }

                                // if (val.products.length > 5) {
                                //     tableListContent += '<tr><td>产品名称：' + val.products[productsListLength].productName + '</td>'
                                //         + '<td>￥' + val.products[productsListLength].totalAmount + '</td>'
                                //         + '<td>' + val.products[productsListLength].productNum + '</td></tr><tr><td class="border-bottom-none"><a href="javascript:void(0)" class="tb-detail">查看更多产品 >></a></td></tr></div>'
                                //         + '</tbody></table>';
                                // } else {
                                tableListContent += '<tr><td class="border-bottom-none">产品名称：' + val.name + '<br/>订单来源：' + val.shopName + '</td>'
                                    + '<td class="border-bottom-none">￥' + val.totalAmount + '</td>'
                                    + '<td class="border-bottom-none" style="color: #1D8CE0">' + val.timeLimit + '期</td></tr></div></tbody></table>';
                                // }

                                //判断产品是否有折扣
                                var originTotalAmountHtml = '';
                                var saveAmountHtml = '';
                                if (val.productAttribution > 0) {
                                    originTotalAmountHtml = '<p><b style="text-decoration: line-through; color: #999">订单总额：' + val.totalAmount + '</b></p>';
                                    saveAmountHtml = '<p class="c-red">节省：' + val.totalAmount + '</p>';
                                }

                                var tableContent = '<div class="table-item-cont"><table class="table-list-p" data-code="' + val.twelveCyclePrice + '">'
                                    + '<thead>'
                                    + '<th style="width: 40%"></th>'
                                    + '<th style="width: 18%"></th>'
                                    + '<th style="width: 10%"></th>'
                                    + '<th style="width: 10%"></th>'
                                    + '<th style="width: 12%"></th>'
                                    + '</thead>'
                                    + '<tbody>'
                                    + '<tr><td>' + tableListContent + '</td>'
                                    + '<td><p>电话：' + val.mobile + '</p><p>车身号：' + val.carBodyNo + '</p></td>'
                                    + '<td class="js-totalAmount" data-totalAmount="' + val.totalAmount + '">' + originTotalAmountHtml + '<p style="font-size: 18px; color:#FF6C60">￥' + val.totalAmount + '</p>' + saveAmountHtml + '</td>'
                                if (orderStatus == 1) {
                                    tableContent += '<td class="js-orderStatus" data-status="' + orderStatus + '"style="font-size: 16px;color: #0bb20c"><p>' + orderStatusContent + '</p><a class="checkpaids"  data-id="' + val.id + '" href="javascript:;" style="font-size: 14px;color: #01AAED;">查看赔付记录</a></td>'
                                } else if (orderStatus == 2) {
                                    tableContent += '<td class="js-orderStatus" data-status="' + orderStatus + '"style="font-size: 16px;color: #FF4949"><p>' + orderStatusContent + '</p><a class="checkpaids"  data-id="' + val.id + '" href="javascript:;" style="font-size: 14px;color: #01AAED;">查看赔付记录</a></td>'
                                } else if (orderStatus == 3 || orderStatus == 4) {
                                    tableContent += '<td class="js-orderStatus" data-status="' + orderStatus + '"style="font-size: 16px;color: #8492A6"><p>' + orderStatusContent + '</p><a class="checkpaids"  data-id="' + val.id + '" href="javascript:;" style="font-size: 14px;color: #01AAED;">查看赔付记录</a></td>'
                                } else {
                                    tableContent += '<td class="js-orderStatus" data-status="' + orderStatus + '"style="font-size: 16px"><p>' + orderStatusContent + '</p><a class="checkpaids"  data-id="' + val.id + '" href="javascript:;" style="font-size: 14px;color: #01AAED;">查看赔付记录</a></td>'
                                }
                                if (orderStatus != 4) {
                                    tableContent += '<td> <p><a href="javascript:void(0)" class="layui-btn layui-btn-mini btn-edit"  data-id="' + val.id + '" data-mobile="' + val.mobile + '" data-carbodyno="' + val.carBodyNo + '" data-statu="' + orderStatus + '" data-product="' + orderproduct + '">编辑订单</a></p>';
                                    tableContent += '<p class="editedd" style="display: none"><a href="javascript:void(0)" class="layui-btn layui-btn-mini layui-btn-danger btn-del" data-id="' + val.id + '">删除订单</a></p></td></tr></tbody></table></div>';
                                } else {
                                    tableContent += '<td></td></tr></tbody></table></div>';
                                }


                                tableItem.append(tableHead);
                                tableItem.append(tableContent);
                                $('#table-list').append(tableItem)
                            });


                            _self.totalSize = data.totalSize;
                            _self.totalPage = Math.ceil(_self.totalSize / _self.pageSize);
                            $('.pager-footer').show();
                            simplePager.setup({
                                item: '.simple-pager-wrapper .simple-pager',
                                data: data,
                                pageIndex: _self.pageIndex,
                                pageSize: _self.pageSize,
                                showPageCount: 5,
                                cbclick: function (pageIndex) {

                                    _self.pageIndex = pageIndex;
                                    _self.initOrderInPage(param);
                                    return false;
                                }
                            });

                        } else {
                            $('.pager-footer').hide();
                            layer.msg('没有相关数据', { time: 1200 });
                        }
                        setTimeout(function () {
                            $('#myIframe', parent.document).height($('#myIframe', parent.document).contents().find('body').height());
                        }, 0);
                        $("input[type='checkbox'][name='singlChoose']").css({
                            "position": "relative",
                            "top": "4px"
                        });
                        var userModel = decodeURIComponent($.cookie('userModel'));
                        if (userModel == '0') {
                            $('.editedd').css('display', 'block');
                        }

                    } else {
                        if (result.code == 510) {
                            layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                // window.parent.location.href = 'login.html';
                            });
                        } else {
                            layer.msg('获取订单失败，请稍后重试！', { time: 1200 });
                        }
                    }
                }
            });
        },
        addProductAction: function () {
            var _self = this;
            $('.js-btn-update').bind('click', function () {
                if (_self.checkForm()) {
                    _self.layer_index = layer.load(2);
                    var formData = new FormData($("#uploadForm")[0]);
                    formData.append("token", $.cookie('userToken'));
                    $.ajax({
                        url: global.url.addOrder,
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
                                layer.msg('编辑成功！', { time: 500 }, function () {
                                    _self.initOrderInPage(_self.param);
                                    layer.close(_self.layer_open_index);
                                });
                            } else {
                                $('.js-btn-update')[0].disabled = false;
                                if (data.code == 510) {
                                    layer.msg('登录已失效，请重新登录...', { time: 1200 }, function () {
                                        window.parent.location.href = 'login.html';
                                    });
                                } else {
                                    layer.msg('编辑失败！', { time: 1500 });
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
        checkForm: function () {
            var statu = $('.layui-layer-content [name=statu]').val();
            if (!statu || -1 == statu) {
                layer.msg('请选择状态', { time: 1200 });
                return false;
            }
            var carBodyNo = $('.layui-layer-content [name=carBodyNo]').val();
            if (!carBodyNo) {
                layer.msg('车身号不能为空', { time: 1200 });
                return false;
            }
            var mobile = $('.layui-layer-content [name=mobile]').val();
            if (!mobile) {
                layer.msg('客户电话不能为空！', { time: 1200 });
                return false;
            }
            return true;
        },
        magicNumber: function (obj, val) {
            obj.animate({ count: val }, {
                duration: 1500,
                step: function () {
                    if (val >= 20) {
                        obj.text(String(Math.ceil(this.count)) + '+')
                    } else {
                        obj.text(String(Math.ceil(this.count)))
                    }
                }
            })
        },
        toRoundOff: function (num) {
            if (num.toString().indexOf('.') > -1) {
                num = Number(num.toString().substring(0, num.toString().indexOf('.') + 3));
            }
            return num;
        },
        getParam: function () {
            var param = {};
            param.token = $.cookie('userToken');
            return param;
        },
        checkOrderStatus: function (orderStatus) {
            var orderStatusContent;
            switch (orderStatus) {
                case 0:
                    orderStatusContent = "未支付";
                    break;
                case 1:
                    orderStatusContent = "质保中";
                    break;
                case 2:
                    orderStatusContent = "已赔付";
                    break;
                case 3:
                    orderStatusContent = "已过期";
                    break;
                case 4:
                    orderStatusContent = "已删除";
                    break;
                case 5:
                    orderStatusContent = "理赔已受理";
                    break;
            }
            return orderStatusContent;
        },
    }
    var page = new Page();
    page.init();
})

