/**
 * Created by 焦红 on 2016/12/27.
 */
(function (win, $) {
    //显示更多价格信息
    $('.show_more').on('click', function () {
        $('.price_table').css('height', 'auto');
        $(this).hide();
        $('.close_more').show();
    });
    //隐藏更多价格信息
    $('.close_more').on('click', function () {
        $('.price_table').css('height', '16rem');
        $(this).hide();
        $('.show_more').show();
    });
    //关闭客服图标
    $('.close_chat').on('click', function () {
        $('.customerservice').css('display', 'none');
    });

    //不同的hash值显示不同的内容
    // $(location.hash).css('display', 'block');
    var title = "热水器";
    var banner_img_src = "images/banner/banner_rsq.jpg";
    var item1 = "拆机";
    var item2 = "装机";
    var item3 = "漏水";
    var item4 = "水不热/水过热";
    var item5 = "插电跳闸";
    var item6 = "不出热水";
    if (location.hash == "#fridges") {
        title = "冰箱";
        banner_img_src = "images/banner/banner_bx.jpg";
        item1 = "拆门安装";
        item2 = "装机";
        item3 = "不工作";
        item4 = "漏水";
        item5 = "结冰问题";
        item6 = "漏电";
    } else if (location.hash == "#water_heater") {
        title = "热水器";
        banner_img_src = "images/banner/banner_rsq.jpg";
        item1 = "拆机";
        item2 = "装机";
        item3 = "漏水";
        item4 = "水不热/水过热";
        item5 = "插电跳闸";
        item6 = "不出热水";
    } else if (location.hash == "#washing_machine") {
        title = "洗衣机";
        banner_img_src = "images/banner/banner_xyj.jpg";
        item1 = "波轮安装";
        item2 = "开不了机";
        item3 = "排水问题";
        item4 = "外观破损";
        item5 = "漏电";
        item6 = "门打不开";
    } else if (location.hash == "#cooker") {
        title = "燃气灶具";
        banner_img_src = "images/banner/banner_rqz.jpg";
        item1 = "安装";
        item2 = "拆机";
        item3 = "黄火焰";
        item4 = "火焰脱底";
        item5 = "燃气灶出现回火";
        item6 = "打不着火";
    } else if (location.hash == "#tv") {
        title = "彩电";
        banner_img_src = "images/banner/banner_ds.jpg";
        item1 = "不含挂架安装";
        item2 = "含挂架安装";
        item3 = "拆机+安装";
        item4 = "背光不亮";
        item5 = "屏横线";
        item6 = "屏竖线";
    } else if (location.hash == "#air_conditioner") {
        title = "空调";
        banner_img_src = "images/banner/banner_ktgj.jpg";
        item1 = "拆装机";
        item2 = "单拆";
        item3 = "单装";
        item4 = "不制冷";
        item5 = "不制热";
        item6 = "加氟利昂";
    } else if (location.hash == "#hood") {
        title = "油烟机";
        banner_img_src = "images/banner/banner_yyj.jpg";
        item1 = "拆机";
        item2 = "装机";
        item3 = "通电不工作";
        item4 = "按键不灵";
        item5 = "吸烟效果差";
        item6 = "漏油";
    } else if (location.hash == "#sterilizer") {
        title = "消毒柜";
        banner_img_src = "images/banner/banner_xdg.jpg";
        item1 = "拆机";
        item2 = "安装";
        item3 = "不加热";
        item4 = "紫外线灯不亮或闪动";
        item5 = "开不了机";
        item6 = "不工作";
    } else if (location.hash == "#water_purifier") {
        title = "净水器";
        banner_img_src = "images/banner/banner_jsq.jpg";
        item1 = "上门安装";
        item2 = "上门清洗保养滤芯";
        item3 = "漏水";
        item4 = "不出水";
        item5 = "出水量小";
        item6 = "增压泵不工作";
    } else if (location.hash == "#water_dispenser") {
        title = "饮水机";
        banner_img_src = "images/banner/banner_ysj.jpg";
        item1 = "上门安装";
        item2 = "上门清洗保养滤芯";
        item3 = "漏水";
        item4 = "不出水";
        item5 = "出水量小";
        item6 = "增压泵不工作";
    } else {
        window.location.href = "buyoutprice_main_m.html";
        return;
    }
    $('.head_title').text(title);
    $('.price_title').text(title + '维修价格');
    $('.banner_img').attr('src', banner_img_src);
    $('.item1').text(item1);
    $('.item2').text(item2);
    $('.item3').text(item3);
    $('.item4').text(item4);
    $('.item5').text(item5);
    $('.item6').text(item6);
    $('.js-form-subscribe').find('[name="bookingDesc"]').val(title + '维修');


    //不同的hash值显示不同的内容
    $('.'+location.hash.slice(1)).css('display', 'block');
})(window, jQuery);