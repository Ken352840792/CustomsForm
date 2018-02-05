import {
    app
} from "../../../Comment/basepage";

(function() {
    let DataNav = function(options) {
        let defaults = {
            tabComponents: {}, //每个Table都有自己的
            initCallback: function() {}, //加载前
            completeCallback: function() {}, //加载完成后
            sourceUrl: {}, //数据源URL
            sourceParams: {}, //数据源发送附带参数
            sourceData: [], //直接数据源
            sourceConvertCall: undefined //自定义转换数据
        };
        this.opts = $.extend({}, defaults, options);
        this.init();
        return this;
    };
    DataNav.prototype = {
        init: function() {
            var _this = this,
                opts = this.opts;
            opts.initCallback(this.opts);
            _this.initData();
        },
        EventInit: function() {
            var _this = this,
                opts = this.opts;
            opts.SwiperSelect = new Swiper(opts.ele_selectBody, {
                slidesPerView: 8,
                paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                spaceBetween: 10, //slide之间的距离（单位px）。
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true, //修改swiper的父元素时，自动初始化swiper
                freeMode: true, //默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
                loop: false //是否可循环
            });
            opts.SwiperBody = new Swiper(opts.ele_divBody, {
                //freeModeSticky  设置为true 滑动会自动贴合  
                direction: 'horizontal', //Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)。
                loop: false,
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true, //修改swiper的父元素时，自动初始化swiper
                autoHeight: false
            });
        },
        convertData: function(data) { //默认处理转换方法
            var _this = this,
                opts = this.opts;
            var arr = [];
            data.forEach(function(item) {
                arr.push({
                    'Id': item.FormTempleteId,
                    'Name': item.FormListName,
                    'TableName': item.ConfigFileName,
                    'type': item.InputFrequency
                });
            });
            return arr;
        },
        initData: function() {
            var _this = this,
                opts = this.opts;
            if (!opts.sourceData || opts.sourceData.length === 0) {
                opts.sourceUrl.post({
                    data: opts.sourceParams,
                    success: function(obj) {
                        //转换数据
                        var data = opts.sourceConvertCall ? opts.sourceConvertCall(obj, _this) : _this.convertData(obj);
                        _this.createComponent(data);
                    }
                });
            } else {
                _this.createComponent(opts.sourceData);
            }
        },
        //创建Component表
        createComponent: function(data) {
            var _this = this,
                opts = this.opts,
                tabs = opts.tabs;
            var context = $('<div class="container"></div>');
            //tab内容
            var selectBody = $('<div class="swiper-container swiper1"></div>');
            //对应Tab的内容
            var selectBody_wrapper = $('<div class="swiper-wrapper"></div>');
            var divBody = $('<div class="swiper-container swiper2"></div>');
            var divBody_wrapper = $('<div class="swiper-wrapper"></div>');
            var swiper = [];
            data.forEach(function(item, index) {
                var cur = {};
                cur.data = item;
                cur.lab = $('<div class = "swiper-slide ">' + item.Name + '</div>');
                cur.lab.click(function() {
                    opts.tabComponents.forEach(function(it) {
                        it.lab.removeClass("selected");
                    });
                    $(this).addClass("selected");
                    opts.SwiperBody.slideTo($(this).index(), 0, false);
                });
                selectBody_wrapper.append(cur.lab);
                cur.div = $('<div class="swiper-slide swiper-no-swiping"></div>');
                swiper.push(cur);
                divBody_wrapper.append(cur.div);
            });
            selectBody.append(selectBody_wrapper);
            divBody.append(divBody_wrapper);
            opts._selfFrom.html('');
            context.append(selectBody).append(divBody);
            opts._selfFrom.append(context);
            opts._ele_context = context;
            opts.ele_selectBody = selectBody;
            opts.ele_divBody = divBody;
            opts.tabComponents = swiper;
            _this.opts.completeCallback(opts, _this); //最终执行完后回调执行方法
            _this.EventInit();
            _this.autoHeight();
        },
        autoHeight: function() {
            var _this = this,
                opts = _this.opts;
            opts.ele_divBody.height(opts._ele_context.height() - 50);
        },
        getValue: function() {
            //获取当前tab的信息
            return null;
        },
        setValue: function(values) {
            //设置当前选中
            return null;
        }
    };
    window.DataNav = DataNav;
})();
export {
    DataNav
}