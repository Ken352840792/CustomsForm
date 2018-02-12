import {
    app
} from "../../../Comment/basepage";
(function() {
    let dropDown = function(options) {
        let defaults = {
            Form: {},
            placeholder: options.placeholder || '',
            Url: '/data/Server/getBatchNo.json',
            initCallback: function() {}, //加载前
            completeCallback: function() {}, //加载完成后
        };
        this.opts = $.extend({}, defaults, options);
        this.opts.initCallback(this.opts);
        this.opts.completeCallback(this.opts, this);
        this.server = app.server;
        this.server.add({
            source: this.opts.Url
        })
        this.init();
        return this;
    }
    dropDown.prototype = {
        init: function() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            _this.createComponent()
        },

        //创建dom元素
        createComponent: function() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.content = $('<div class = "ui-field-contain"></div>');
            form.lable = $('<label for="fname" class="lable">' + opts.lable + '</label>');
            form.content.append(form.lable);
            if (opts.regexp && opts.regexp.require) form.lable.append($('<i style ="color: red"> * </i>'));
            form.customBox = $('<div class="custom-ui-block-b"></div>')
            form.input = $(opts.input);
            form.input.attr({ 'value': 0 }, { 'placeholder': '那个啥' });
            form.form = $('<form class="ui-filterable clearfix"></form>');
            form.inputHidden = $('<input id="autocomplete-input" autocomplete="off" data-type="search" placeholder="' + opts.placeholder + '">');
            form.ul = $('<ul data-role="listview" data-inset="true" class="dataURL clearfix" data-filter="true" data-input="#autocomplete-input"></ul>');
            form.input.attr('type', 'hidden');
            form.form.append(form.inputHidden);
            form.customBox.append(form.input);
            form.customBox.append(form.form);
            form.customBox.append(form.ul);
            form.content.append(form.customBox);
            opts._selfFrom.append(form.content);
            form.inputHidden.textinput();
            _this.createFilterablebeforefilter();
        },
        // 内层监听
        createFilterablebeforefilter: function() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            // 这个地方用change 会报错
            form.ul.on('filterablebeforefilter', function(e, data) {
                var $input = $(data.input),
                    value = $input.val(),
                    html = "";
                form.ul.html("");
                if (value && value.length > 0) {
                    form.ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
                    form.ul.listview("refresh");
                    var params = {
                        q: $input.val()
                    }
                    params = $.extend({}, params, opts.params);
                    // _this.server.source.get({
                    //     data: params,
                    //     success: function(obj) {
                    //         if (obj.Status) {
                    //             $.each(obj.Obj, function(i, val) {
                    //                 for (var key in val) {
                    //                     var li = $("<li>" + val[key] + "</li>");
                    //                     li.click(function() {
                    //                         $input.val(val[key]);
                    //                         form.ul.empty();
                    //                         form.input.val(key);
                    //                     });
                    //                 }
                    //                 form.ul.append(li);
                    //             });
                    //         }
                    //         //$ul.html(html);
                    //         form.ul.listview("refresh");
                    //         form.ul.trigger("updatelayout");
                    //     }
                    // });
                    $.ajax({
                        url: opts.Url,
                        type: 'get',
                        dataType: "json",
                        data: params,
                        success: function(data) {
                            if (data.Status) {
                                $.each(data.Obj, function(i, val) {
                                    for (var key in val) {
                                        var li = $("<li>" + val[key] + "</li>");
                                        li.click(function() {
                                            $input.val(val[key]);
                                            form.ul.empty();
                                            form.input.val(key);
                                        });
                                    }
                                    form.ul.append(li);
                                });
                            }
                            //$ul.html(html);
                            form.ul.listview("refresh");
                            form.ul.trigger("updatelayout");
                        }
                    })
                }
            })
        },
        getValue: function() {
            //获取当前tab的信息
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            return form.input.val();
        },
        setValue: function(values) {
            //设置当前选中
            return null;
        }

    }
    window.dropDown = dropDown;
})()
export {
    dropDown
}