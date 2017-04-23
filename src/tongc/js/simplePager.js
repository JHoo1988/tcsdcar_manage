/**
 * Created by wang on 16/10/13.
 */

layui.define(['jquery'], function (exports) {
    var jQuery = $ = layui.jquery;
    var Pager = function () {

    };

    Pager.prototype = {
        init : function () {

            var _self = this;
            $.fn.pageBar = function (options) {
                var configs = {
                    PageIndex: 1,
                    PageSize: 10,
                    TotalPage: 0,
                    RecordCount: 0,
                    showPageCount: 5,
                    onPageClick: function (pageIndex) {
                        return false;   //默认的翻页事件
                    }
                };
                $.simplePagerConfig = configs;

                $.extend($.simplePagerConfig, options);
                var tmp = "",
                    i = 0,
                    j = 0,
                    a = 0,
                    totalpage = parseInt(configs.RecordCount / configs.PageSize);

                totalpage = configs.RecordCount % configs.PageSize > 0 ? totalpage + 1 : totalpage;
                tmp += '<span class="pager-message">总记录数:' + configs.RecordCount + '条 </span > ';
                tmp += " <span class=\"pager-message\">总页数:" + totalpage + "页</span>";


                tmp += '<span style="display:inline-block; float:right">';
                tmp += '';
                tmp += '<a >&lt</a>';
                i = 1;
                if (totalpage > configs.showPageCount) {
                    j = configs.showPageCount - 1;
                    a = 1;
                }
                else {
                    j = totalpage;
                }

                for (; i <= j; i++) {
                    if (i != configs.PageIndex)
                        tmp += '<a>' + i + '</a>';
                    else
                        tmp += '<a class="cur">' + i + '</a>';
                }
                if (a) {
                    tmp += '<span class="pager-ellipse">...</span>';
                    tmp += '<a>' + totalpage + '</a>'
                }
                tmp += "<a>&gt</a>";
                tmp += "<input type=\"text\" /><a>跳转</a>";
                tmp += '</span>';
                var pager = this.html(tmp);
                _self.bindEvent(pager);
            };
        },

        setup: function(param) {

            //var visible = $(param.item).css('visibility');
            //if (visible == 'hidden') {
            var recordCount = param.data.totalSize;
            var totalPage = Math.ceil(recordCount / param.pageSize);


            if (recordCount <= param.pageSize)
            {
                $(param.item).css('visibility', 'hidden');
            } else {
                var pagerOptions = {
                    AllowPaging: true,
                    PageIndex: param.pageIndex,       //设置当前页码
                    PageSize: param.pageSize,       //设置分页大小
                    RecordCount: recordCount,  //设置数据总数
                    TotalPage: totalPage,      //设置总页数
                    showPageCount: param.showPageCount,
                    onPageClick: function(pageIndex) {
                        param.cbclick(pageIndex);
                        return false;
                    }
                };

                var visible = $(param.item).css('visibility');
                if (visible == 'hidden') {
                    $(param.item).css('visibility', 'visible').pageBar(pagerOptions);
                } else {

                    if (param.pageIndex == 1) {
                        $(param.item).css('visibility', 'visible').pageBar(pagerOptions);
                    }
                }
            }
            //}
        },

        bindEvent: function (pager) {
            var _self = this;
            var index = pager.find('input')[0];
            pager.find('a').click(function () {
                var cls = $(this).attr('class');

                if ($(this).text() == '<') {
                    if (cls != 'no') {
                        _self.adjustPager(pager, -1);

                    }
                } else if ($(this).text() == '>') {
                    if (cls != 'no') {
                        _self.adjustPager(pager, -2);
                    }
                } else if (this.innerHTML == '跳转') {
                    if (!isNaN(index.value)) {
                        var indexvalue = parseInt(index.value);
                        var totalPage = $.simplePagerConfig.TotalPage;
                        indexvalue = indexvalue < 1 ? 1 : indexvalue;
                        indexvalue = indexvalue > totalPage ? totalPage : indexvalue;
                        _self.adjustPager(pager, indexvalue);
                    }
                } else {
                    if (cls != 'cur') {
                        _self.adjustPager(pager, parseInt(this.innerHTML));
                    }
                }
            });
        },

        adjustPager: function (parent, direction) {
            _self = this;

            var totalPage = $.simplePagerConfig.TotalPage, activePage;
            var currPage = $.simplePagerConfig.PageIndex;
            var from, to, beginE = 0, endE = 0;


            if (direction == -1) {
                activePage = currPage - 1;
                if (activePage <= 0) {
                    activePage = currPage;
                }
            } else if (direction == -2) {
                activePage = parseInt(currPage) + 1;
                if (activePage > totalPage) {
                    activePage = currPage;
                }
            } else {
                if (direction > 0 && direction <= totalPage) {
                    activePage = direction;
                } else {
                    return;
                }
            }
            if ($.simplePagerConfig.PageIndex != activePage) {
                $.simplePagerConfig.PageIndex = activePage;
                $.simplePagerConfig.onPageClick(activePage);
            } else {
                return;
            }

            var curr0 = $($(parent).find('a')[1]).text();


            if (totalPage - activePage <= $.simplePagerConfig.showPageCount - 2) {
                beginE = totalPage <= $.simplePagerConfig.showPageCount?0:1;
                from = totalPage - $.simplePagerConfig.showPageCount <= 0? 1:totalPage - $.simplePagerConfig.showPageCount + 2;
                to = totalPage;
            } else {
                if (direction == -1) {

                    if (activePage < curr0) {
                        curr0 = (activePage > 1) ? activePage : 1;
                    }
                    if (activePage - curr0 > $.simplePagerConfig.showPageCount - 2) {
                        curr0 =  activePage - $.simplePagerConfig.showPageCount + 2;
                    }
                    from = curr0;
                    to = parseInt(curr0) + $.simplePagerConfig.showPageCount - 2 > totalPage? totalPage: parseInt(curr0) + $.simplePagerConfig.showPageCount - 2;

                } else{

                    from = parseInt(curr0) + $.simplePagerConfig.showPageCount - 2 > activePage? curr0: parseInt(activePage) - $.simplePagerConfig.showPageCount + 2;
                    to =  parseInt(from) + $.simplePagerConfig.showPageCount - 2 > totalPage? totalPage: parseInt(from) + $.simplePagerConfig.showPageCount - 2;
                }
            }
            endE = to < totalPage? 1: 0;



            $span = $($(parent).find('span')[2]);


            var tmp = '';
            tmp += '<a >&lt</a>';

            if (beginE) {
                tmp += '<a >1</a>';
                tmp += '<span class="pager-ellipse">...</span>';
            }


            for (var i = from; i <= to; i++) {
                tmp += '<a>' + i + '</a>'
            }
            if (endE) {
                tmp += '<span class="pager-ellipse">...</span>';
                tmp += '<a>' + totalPage + '</a>'
            }
            tmp += "<a>&gt</a>";
            tmp += "<input type=\"text\" /><a>跳转</a>";
            tmp += '</span>';
            $span.empty().append(tmp);

            $span.children().each(function () {

                var i = $(this).text();
                if (i == activePage) {
                    $(this).addClass('cur');
                }
            });

            _self.bindEvent(parent);
        }
    };

    //return new Pager();
    exports('simplePager', new Pager());
})