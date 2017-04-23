/**
 * Created by Ryan on 2016/7/30.
 */

(function (win, $) {

    var fixedBottomCookieName = 'fixed_bottom_status';

    function Slider() {
        this.element = $('#slider');
        this.contentList = this.element.find('.slider-content ul');
        this.numberList = this.element.find('.slider-number li');
        this.step = this.contentList.find('li').eq(0).height();
    }

    Slider.prototype = {
        constructor: Slider,
        reStep: function () {
            this.step = this.contentList.find('li').eq(0).height();
        },
        go: function (n) {
            this.contentList.css('top', -(n * this.step));
            this.numberList.eq(n).addClass('active').siblings('.active').removeClass('active');
        }
    };

    var slider = new Slider();

    // 页面动画
    function Animation() {
        this.sliderTop = 0;
    }

    Animation.prototype = {
        constructor: Animation,
        init: function () {

            this.initSliderTop();

            if ($(window).width() >= 768) {
                this.bindScrollEvent();
            } else {
                slider.go(0);
                slider.element.removeClass('fixed');
                slider.element.attr('style', '');
                slider.element.find('ul').attr('style', '');
            }

            this.bindResizeEvent();

        },
        getWinScrollTop: function () {
            return parseInt($(document).scrollTop());
        },
        getWinHeight: function () {
            return parseInt($(window).height());
        },
        initSliderTop: function () {
            var $slider = $('#slider');
            var $sliderOffset = $slider.offset();
            this.sliderTop = parseInt($sliderOffset.top);
        },
        // 优势
        superiorityAnimation: function () {
            var $slider = $('#slider');
            var $sliderHeight = $slider.height();
            var $sliderOffset = $slider.offset();
            var $sliderTop = this.sliderTop;
            var $sliderLeft = parseInt($sliderOffset.left);
            var $box = $('#sec-superiority');
            var $boxOffset = $box.offset();
            var $boxTop = $boxOffset.top;
            var $boxHeight = $box.height();
            //var winHeight = $(window).height();
            var winScrollTop = this.getWinScrollTop();
            var setFixed = function () {
                $slider.addClass('fixed');
                $slider.css('left', $sliderLeft);
            };

            // 执行动画
            // 120 是 slider 元素 fixed 定位的 top 值
            // 60 是 slider 元素 absolute 定位的 bottom 值

            if (winScrollTop + 120 > $sliderTop && winScrollTop < ($boxTop + $boxHeight - ($sliderHeight + 60) - 120)) {
                $slider.attr('style', '');
                setFixed();
                //console.log('setFixed');
                //console.log(winScrollTop + '>' + $sliderTop + '+' + $boxHeight + '*' + 2);
                //console.log(winScrollTop + ' >' + $sliderTop + ' +' + $boxHeight);
                // todo 待优化
                if (winScrollTop > $sliderTop + $boxHeight / 3) {
                    slider.go(2);
                } else if (winScrollTop > $sliderTop) {
                    slider.go(1);
                } else {
                    slider.go(0);
                }

            } else {
                $slider.removeClass('fixed');
                $slider.attr('style', '');
                if (winScrollTop + 120 > $sliderTop) {
                    $slider.css({
                        position: 'absolute',
                        bottom: '60px'
                    });
                    slider.go(2);
                    //console.log('absolute');
                } else {
                    slider.go(0);
                }

            }

        },
        commonAnimation: function (id) {
            var $element = $('#' + id);
            var $offset = $element.offset();
            var $offsetTop = parseInt($offset.top);
            var winScrollTop = this.getWinScrollTop();
            var winHeight = this.getWinHeight();
            $element.find('.animated').hide();
            if (winScrollTop - $offsetTop + winHeight / 2 > 0) {
                $element.find('.animated').show().addClass('slideInUp');
            }
        },
        // 清洗
        washAnimation: function () {
            this.commonAnimation('sec-wash');
        },
        // 安装维修
        repairAnimation: function () {
            this.commonAnimation('sec-repair');
        },
        // 回收
        recoverAnimation: function () {
            this.commonAnimation('sec-recover');
        },
        // 手机维修
        phoneRepairAnimation: function () {
            this.commonAnimation('sec-phone-repair');
        },
        bindScrollEvent: function () {
            var self = this;
            $(window).on('scroll.resize', function () {
                self.run();
            });
        },
        bindResizeEvent: function () {
            var self = this;
            $(window).off('resize');
            $(window).on('resize', function () {
                $(window).off('scroll.resize');
                self.init();
            });
        },
        run: function () {
            this.superiorityAnimation();
            this.washAnimation();
            this.repairAnimation();
            this.recoverAnimation();
            this.phoneRepairAnimation();
        },
        reset: function () {
            $(document).off('scroll');
        },
        clear: function () {
            $(document).off('scroll');
        }
    };


    var animation = new Animation();
    animation.init();

    var $body = $('body');

    var animationEndEvent = (function (element) {
        var transitions = {
            'animation': 'animationend', /*IE10 才支持 animationend*/
            'oAnimation': 'oAnimationEnd',
            'MozAnimation': 'mozAnimationEnd',
            'webkitAnimation': 'webkitAnimationEnd'
        };
        for (var key in transitions) {
            if (key in element.style) {
                return transitions[key];
            }
        }
        return null;
    })(document.createElement('div'));


    $body.on('click', '.js-fixed-bottom-show', function () {
        $.cookie(fixedBottomCookieName, 1, {expires: 1});

        var $this = $(this);
        var $fixedBox = $this.parents('.fixed-bottom');
        var min = $fixedBox.find('.min');
        var max = $fixedBox.find('.max');

        if (!animationEndEvent) {
            $fixedBox.addClass('open');
            return;
        }

        min.addClass('slideOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            min.removeClass('slideOutLeft');

            $fixedBox.addClass('open');
            max.addClass('slideInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                max.removeClass('slideInLeft');
            });

        });

    });

    $body.on('click', '.js-fixed-bottom-hide', function () {
        $.cookie(fixedBottomCookieName, 0, {expires: 1});

        var $this = $(this);
        var $fixedBox = $this.parents('.fixed-bottom');
        var min = $fixedBox.find('.min');
        var max = $fixedBox.find('.max');
        var mobile = $fixedBox.find('.mobile');

        mobile.hide();

        if (!animationEndEvent) {
            $fixedBox.removeClass('open');
            return;
        }

        max.addClass('slideOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            max.removeClass('slideOutLeft');
            $fixedBox.removeClass('open');

            min.addClass('slideInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                min.removeClass('slideInLeft');
            });
        });
    });


    // 预约表单
    function ReserveForm() {
        var haUrl = window.haUrl;
        var haServiceUrl = haUrl.base;
        this.form = $('form[name=reserveForm]');
        this.formAction = haServiceUrl + 'userBooking/addBookingInfo';
        this.layerIndex = null;
    }

    ReserveForm.prototype = {
        constructor: ReserveForm,
        init: function () {
            var self = this;
            this.bind();
            this.saveCategory();
            setTimeout(function () {
                self.initPlaceholder();
            }, 800)
        },

        // 是否为空，或只输入了空白符
        isEmpty: function (value) {
            if (value === '') {
                return true;
            }
            return /^\s+$/.test(value);
        },

        // 是否为手机号码
        isMobile: function (value) {
            return /^1[34578]\d{9}$/.test(value);
        },

        // 验证表单
        validate: function () {
            var form = this.form;
            var userAppellation = form.find('input[name=userAppellation]');
            var userAppellationVal = userAppellation.val();
            var phoneNum = form.find('input[name=phoneNum]');
            var phoneNumVal = phoneNum.val();
            var bookingDescVal = form.find('input[name=bookingDesc]').val();

            if (this.isEmpty(bookingDescVal)) {
                layer.tips('请选择服务项目', '.category', {
                    tips: [1, '#f00']
                });
                return false;
            }

            if (this.isEmpty(userAppellationVal)) {
                userAppellation.focus();
                layer.tips('称呼不能为空', '.form-name', {
                    tips: [1, '#f00']
                });
                return false;
            }

            if (this.isEmpty(phoneNumVal)) {
                phoneNum.focus();
                layer.tips('手机号不能为空', '.form-mobile', {
                    tips: [1, '#f00']
                });
                return false;
            }

            if (!this.isMobile(phoneNumVal)) {
                phoneNum.focus();
                layer.tips('手机号码不正确', '.form-mobile', {
                    tips: [1, '#f00']
                });
                return false;
            }

            return true;
        },

        saveCategory: function () {
            var form = this.form;
            var $category = form.find('.category');
            var bookingDesc = [];
            $category.find('span').each(function () {
                var $this = $(this);
                if ($this.hasClass('selected')) {
                    bookingDesc.push($this.text());
                }
            });

            form.find('[name=bookingDesc]').val(bookingDesc.join(','));
        },
        // 选择分类
        selectCategory: function (item) {

            if (item.hasClass('selected')) {
                item.removeClass('selected');
            } else {
                item.addClass('selected');
            }

            this.saveCategory();
        },

        resetForm: function () {
            var form = this.form;
            var $category = form.find('.category');

            form.find('[name=userAppellation]').val('');
            form.find('[name=phoneNum]').val('');

            $category.find('span').each(function (i) {
                var $this = $(this);
                //if (i === 0) {
                //    $this.addClass('selected')
                //} else {
                $this.removeClass('selected')
                //}
            });

            this.saveCategory();

        },

        initPlaceholder: function () {
            var form = this.form;
            var name = form.find('.form-name');
            var nameVal = name.val();
            var mobile = form.find('.form-mobile');
            var mobileVal = mobile.val();

            if (nameVal === '') {
                name.addClass('placeholder');
            } else {
                name.removeClass('placeholder');
            }

            if (mobileVal === '') {
                mobile.addClass('placeholder');
            } else {
                mobile.removeClass('placeholder');
            }
        },

        // 保存表单
        save: function (form) {
            var self = this;

            $.ajax({
                method: 'POST',
                url: self.formAction,
                data: form.serializeArray(),
                dataType: 'JSON',
                //xhrFields: {
                //    withCredentials: true
                //},
                success: function (res) {

                    var serverMsg = '服务器发生错误';
                    form.find('.btn-reserve')[0].disabled = false;

                    // 返回错误的格式
                    if (typeof res !== 'object') {
                        layer.tips(serverMsg, '.btn-reserve', {
                            tips: [1, '#f00']
                        });
                        return;
                    }

                    // 提交成功
                    if (res.flag == 'success') {
                        self.resetForm();
                        self.layerIndex = layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 0,
                            shadeClose: true,
                            area: ['640px', '200px'],
                            skin: 'reserve-success-msg',
                            content: '<span class="js-reserve-success-msg-close" title="关闭窗口">X</span>'
                        });

                        return;
                    }

                    layer.tips(res.msg || serverMsg, '.btn-reserve', {
                        tips: [1, '#f00']
                    });

                },
                error: function (xhr) {
                    form.find('.btn-reserve')[0].disabled = false;
                    layer.tips(xhr.statusText, '.btn-reserve', {
                        tips: [1, '#f00']
                    });
                }
            });
        },

        // 绑定事件
        bind: function () {
            var self = this;

            $body.on('click', '.js-reserve-success-msg-close', function () {
                if (self.layerIndex !== null) {
                    layer.close(self.layerIndex);
                }
            });

            $body.on('click', '.btn-reserve', function () {
                var $this = $(this);
                var $form = $this.parents('form');
                $this[0].disabled = true;
                if (self.validate($form)) {
                    self.save($form);
                } else {
                    $form.find('.btn-reserve')[0].disabled = false;
                }
            });

            $body.on('click', '.category span', function () {
                self.selectCategory($(this));
            });

            $body.on('focus', '.form-name, .form-mobile', function () {
                var $this = $(this);
                $this.removeClass('placeholder');
            });

            $body.on('blur', '.form-name, .form-mobile', function () {
                var $this = $(this);
                if ($this.val() === '') {
                    $this.addClass('placeholder');
                } else {
                    $this.removeClass('placeholder');
                }
            });

        }

    };

    var reserveForm = new ReserveForm();
    reserveForm.init();


    (function () {

        var fixedBottom = $('.fixed-bottom');

        if ($.cookie(fixedBottomCookieName) == 0) {
            fixedBottom.removeClass('open');
        } else {
            fixedBottom.addClass('open');
        }

        //$(window).on('scroll.fixed', function () {
        //    var winScrollTop = parseInt($(document).scrollTop());
        //    var winWidth = $(window).width();
        //    if ((winScrollTop > 300 && winWidth >= 1024) || winWidth < 1024) {
        //        fixedBottom.show();
        //    } else {
        //        fixedBottom.hide();
        //    }
        //});

    }());

    (function () {

        function showVideo() {
            layer.open({
                type: 2,
                title: false,
                shadeClose: false,
                shade: 0.8,
                area: ['800px', '550px'],
                content: 'http://v.qq.com/iframe/player.html?vid=y0335e0ox6y&tiny=0&auto=1'
            });
        }

        $('body').on('click','.js-show-video', function(){
            showVideo();
        });

    }());

    //弹窗
    //(function(){
    //    var isOpen = sessionStorage.getItem('ha_open_wind');
    //    var h = $(window).height();
    //    if(h < 600){
    //        $('.win-ad .win-div').css('top','5%');
    //    }else if(h < 700){
    //        $('.win-ad .win-div').css('top','10%');
    //    }else if(h < 800){
    //        $('.win-ad .win-div').css('top','15%');
    //    }else if(h < 850){
    //        $('.win-ad .win-div').css('top','20%');
    //    }
    //    console.log(h);
    //    if(isOpen == null){
    //        $('.win-ad').show();
    //        sessionStorage.setItem('ha_open_wind',1);
    //    }
    //    $('.win-ad .close').on('click',function(){
    //        $('.win-ad').fadeOut();
    //    });
    //})();

    var swiper = new Swiper('.swiper-container', {
//		nextButton: '.swiper-button-next',
//        prevButton: '.swiper-button-prev',
        pagination: '.swiper-pagination',
        paginationClickable: true,
        // Disable preloading of all images
        preloadImages: false,
        // Enable lazy loading
        lazyLoading: true,
        autoplay: 6000,
        autoplayDisableOnInteraction: false,
        loop: true
    });
    swiper.startAutoplay();
    swiper.params.speed = 800;
    $('.swiper-slide').mousemove(function () {
        swiper.stopAutoplay();
    });
    $('.swiper-slide').mouseout(function () {
        swiper.startAutoplay();
    });
}(window, jQuery));

