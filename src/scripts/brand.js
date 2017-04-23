/**
 * Created by Ryan on 2016/7/30.
 */

(function (win, $) {

    function Animation() {
    }

    Animation.prototype = {
        constructor: Animation,
        init: function () {

            if ($(window).width() >= 768) {
                this.bindScrollEvent();
            }

            this.bindResizeEvent();

        },
        getWinScrollTop: function () {
            return parseInt($(document).scrollTop());
        },
        getWinHeight: function () {
            return parseInt($(window).height());
        },
        advantageAnimation: function () {
            var $advantage = $('#sec-advantage');
            var $offset = $advantage.offset();
            var $top = parseInt($offset.top);
            var winHeight = this.getWinHeight();
            var winScrollTop = this.getWinScrollTop();
            $advantage.find('.animated').hide();
            if (winScrollTop - $top + winHeight / 2 > 0) {
                $advantage.find('.animated').show().addClass('slideInUp');
            }
        },
        cityAnimation: function () {
            var $city = $('#sec-city');
            var $offset = $city.offset();
            var $top = parseInt($offset.top);
            var winHeight = this.getWinHeight();
            var winScrollTop = this.getWinScrollTop();
            $city.find('.animated').hide();
            if (winScrollTop - $top + winHeight / 2 > 0) {
                $city.find('.animated').show().addClass('fadeIn');
            }
        },
        bindScrollEvent: function () {
            var self = this;
            $(window).on('scroll', function () {
                self.run();
            });
        },
        bindResizeEvent: function () {
            var self = this;
            $(window).off('resize');
            $(window).on('resize', function () {
                $(window).off('scroll');
                self.init();
            });
        },
        run: function () {
            this.advantageAnimation();
            this.cityAnimation();
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


}(window, jQuery));
