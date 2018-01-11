import {
    _selfFrom
} from "../CustomFrom";
(function () {
    let Text = function (options) {
        let defaults = {
            Form: {},
            value: "" //双向数据绑定字段
        };
        this.opts = $.extend({}, defaults, options);
        this.init();
        return this;
    };
    Text.prototype = {
        init: function () {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            _this.createComponent();
            _this.Events();
            //调用自定义事件
            if (opts.customEvent) {
                opts.customEvent.oninitialize ? opts.customEvent.oninitialize(_this.input, _this) : '';
            }
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
            _this.input.on('keyup', function () {
                opts.des = this.value;
            })
        },
        //创建Component表
        createComponent: function () {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.content = $('<div class = "ui-field-contain"></div>');
            form.lable = $('<label for="fname">' + opts.lable + '</label>');
            form.content.append(form.lable);
            //必选lable上给星号
            if (opts.regexp && opts.regexp.require) form.content.append($('<i style ="color: red"> * </i>'));
            _this.input = $(opts.input)
            _this.input.attr('placeholder', opts.placeholder);
            form.content.append(_this.input);
            _selfFrom.append(form.content);
        },
        getValue: function () {
            return this.opts.value;
        },
        setValue: function (val) {
            this.opts.des = val;
        },
        valid: function () {
            var  opts = this.opts;
            if (opts.regexp && opts.regexp.test) {
                return new RegExp(opts.regexp.test).test(opts.value);
            } else {
                return true;
            }
        }
    };
    window.Text = Text;
})();
export {
    Text
}