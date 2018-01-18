import {
    _selfFrom
} from "../CustomFrom";
import {
    app
} from "../../../Comment/basepage";
(function() {
    let Buttons = function(options) {
        let defaults = {
            Form: {},
            buttons: {},
            key: "id", //唯一键
            Name: 'name', //显示的名称
            value: [] //双向数据绑定字段
        };
        this.opts = $.extend({}, defaults, options);
        this.init();
        this.server = app.server;
        this.server.add({
            ruleUrl: options.sourceUrl
        })
        return this;
    };
    Buttons.prototype = {
        init: function() {
            let _this = this;
            _this.createComponent()
            _this.Events()
            _this.behavior()
        },
        // 双向数据绑定
        Events: function() {
            var _this = this,
                opts = this.opts,
                arrData = opts.sourceData.data;
            Object.defineProperty(opts, 'des', {
                get: function() { //获取数据
                    return this.value;
                },
                set: function(arr) { //设置值
                    for (let a in opts.buttons) {
                        opts.buttons[a].removeClass('ui-btn-active');
                    }
                    arr.forEach((item) => {
                        opts.buttons[item.id].addClass('ui-btn-active');
                    });
                    this.value = arr;
                }
            });
        },
        getValue: function() {
            return this.opts.value;
        },
        // 创建菜单
        createComponent: function() {
            let _this = this,
                opts = this.opts,
                form = opts.Form;
            form.content = $('<div id="OperatorWorkShopContentId" class="overflow-auto clearfix">');
            form.lable = $(' <div class="grid-div-label">' + opts.lable + '</div>');
            form.content.append(form.lable)

            let Data = opts.sourceData.data ? opts.sourceData.data : null;
            if (Data) {
                Component(Data)
            } else {
                _this.server.ruleUrl.get({
                    data: {},
                    async: false,
                    success: function(data) {
                        Data == data.sourceData.data;
                        Component(Data)
                    }
                })
            }
            // 按钮部分的数据渲染
            function Component(data) {
                opts.buttons = [];
                let arr = data;
                form.Now = $('<div class="grid-div-content" data-childunitype="1" data-child="#select_line_Now" ref-open="false"></div>')
                for (let value of arr) {
                    if (value.isTrue) {
                        form.a = $('<a class="ui-btn ui-mini ui-corner-all ui-btn-inline ui-btn-active" >' + value[opts.Name] + '</a>')
                    } else {
                        form.a = $('<a class="ui-btn ui-mini ui-corner-all ui-btn-inline" >' + value[opts.Name] + '</a>')
                    }
                    form.a.data('a', value);
                    form.Now.append(form.a);
                    opts.buttons[value.id] = form.a;
                }
                form.tool = $('<div class="grid-div-tool"></div>')
                form.arrow = $('<a href="#"  class="ui-btn  ui-btn-icon-notext ui-icon-carat-d ui-corner-all"></a>');
                form.tool.append(form.arrow);
                form.content.append(form.Now)
                form.hr = $('<hr class="hr-line">')
                form.content.append(form.tool)
                _selfFrom.append(form.content);
                _selfFrom.append(form.hr);
            }
        },
        // 按钮的行为变化
        behavior: function() {
            let _this = this,
                opts = this.opts,
                form = opts.Form;
            // 实现按钮的展开或者关闭
            form.arrow.on('click', function() {
                _this.CollapseClick(form.arrow)
            })
            this.Multiple(opts.sourceData.data)
        },

        // 展开关闭操作
        CollapseClick: function(obj) {
            var div = $(obj).parent().prev(".grid-div-content");
            var isOpen = div.attr("ref-open");
            if (isOpen == "false") {
                $(obj).removeClass("ui-icon-carat-d").addClass("ui-icon-carat-u");
                div.attr("ref-open", "true")
                div.css("height", "auto");
            } else {
                div.attr("ref-open", "false");
                $(obj).removeClass("ui-icon-carat-u").addClass("ui-icon-carat-d");
                div.css("overflow", "hidden").css("height", "48px");
            }
        },
        // 按钮多选操作
        Multiple: function(data) {
            let _this = this,
                opts = this.opts,
                arr = data;
            opts.Form.Now.delegate('a', 'click', function(ev) {
                let arrData = [];
                for (let i of arr) {
                    if ($(this).data('a') == i) {
                        i.isTrue = !i.isTrue;
                    }
                }
                for (let i of arr) {
                    if (i.isTrue) {
                        arrData.push(i)
                    }
                }
                // 点击的时候如果有回调函数执行回调函数
                let callback = $(this).data('a').callback ? $(this).data('a').callback : null;
                if (callback && $(this).data('a').isTrue) {
                    callback();
                }
                opts.des = arrData;
            })
        }
    }
    window.Buttons = Buttons;
})();
export {
    Buttons
}