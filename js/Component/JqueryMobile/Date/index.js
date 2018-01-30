(function () {
    let DateSelect = function (options) {
        let defaults = {
            Form: {},
            _selfFrom: '', //要添加到的位置
            initCallback: function () {}, //加载前
            completeCallback: function () {}, //加载完成后
            value: "" //双向数据绑定字段
        };
        debugger;
        this.opts = $.extend({}, defaults, options);
        this.init();
        return this;
    };
    DateSelect.prototype = {
        init: function () {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            opts.initCallback(this.opts);
            _this.createComponent();
            _this.Events();
            _this.mobiscroll()
            opts.completeCallback();
        },
        Events: function () {
            var _this = this,
                opts = this.opts;
            Object.defineProperty(opts, 'des', {
                get: function () { //获取数据
                    return this.value;
                },
                set: function (val) { //设置值
                    _this.input.val(val);
                    this.value = val;
                }
            });
            _this.input[0].onchange = function () {
                opts.des = this.value;
            }
        },
        //创建Component表
        createComponent: function () {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.content = $('<div class = "ui-field-contain"></div>');
            form.lable = $('<label for="fname" class="lable">' + opts.lable + '</label>');
            form.content.append(form.lable);
            //必选lable上给星号
            if (opts.regexp && opts.regexp.require) form.lable.append($('<i style ="color: red"> * </i>'));
            _this.input = $(opts.input);
            _this.input.attr('placeholder', opts.placeholder);
            form.content.append(_this.input);
            _this.input.textinput();
            opts._selfFrom.append(form.content);
        },
        // 插件 初始化
        mobiscroll: function () {
            let _this = this;
            var currYear = (new Date()).getFullYear();
            mobiscroll.date(_this.input, {
                lang: "zh",
                theme: 'android-holo-light',
                display: 'center',
                layout: 'fixed',
                startYear: currYear - 10,
                endYear: currYear + 10,
                dateFormat: "yy-mm-dd",
                onInit: function (event, inst) {
                    var setBtn = inst.buttons.set;
                    var setCancel = inst.buttons.cancel;
                    inst.buttons.set = setCancel;
                    inst.buttons.cancel = setBtn;
                }
            });
        },
        getValue: function () {
            return this.opts.value;
        },
        setValue: function (val) {
            this.opts.des = val;
        }
    };
    window.DateSelect = DateSelect;
})();
export {
    DateSelect
}