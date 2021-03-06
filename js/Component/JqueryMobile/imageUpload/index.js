(function() {
    let inputUpload = function(options) {
        let defaults = {
            Form: {},
            initCallback: function() {}, //加载前
            completeCallback: function() {}, //加载完成后
        };
        this.opts = $.extend({}, defaults, options);
        this.opts.initCallback(this.opts);
        this.opts.completeCallback(this.opts, this);
        this.init();
        return this;
    }
    inputUpload.prototype = {
        init: function() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            _this.createComponent();
            _this.createImagesWidget(form.input, opts);
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
            form.input = $(opts.input);
            form.input.attr('value', '1111');
            // console.log( )
            // form.input.parent('div').css('border', '0px');
            form.content.append(form.input);
            form.input.textinput();
            opts._selfFrom.append(form.content);
        },
        //组件初始化
        createImagesWidget: function(element, options) {
            element.hide();
            element.imageUpload({
                //multiple: (attributes[options["name"]] && attributes[options["name"]]["multiple"] ? true : false),
                multiple: options.multiple,
                imageNum: options.filetotal,
                fileSize: options.filesize,
                url: app.server.CustomTableImageUpLoadFile.url,
                success: function(data) {
                    if (data && data.Status) {
                        var list = element.data("upload_list");
                        if (!list) {
                            list = {};
                        }
                        list[data.Data] = 1;
                        var d = [];
                        $.each(list, function(key, val) {
                            d.push(key);
                        });
                        element.data("upload_list", list).val(d.join(',')); //赋值给文件关联字段用于表单提交
                    } else if (data && data.ErrorCode) {

                    } else {

                    }
                    contentCollapsibleMethod("ShiftNoteImagesUpLoad");
                },
                error: function(data) {

                },
                del: app.server.CustomTableDeleteUpLoadFile.url,
                delType: "DELETE",
                delData: function(data) {
                    return {
                        "": data.Data
                    }
                },
                delSuccess: function(data, res) {
                    if (data && data.Status) {
                        var list = element.data("upload_list");
                        delete list[res.Data];
                        var d = [];
                        $.each(list, function(key, val) {
                            d.push(key);
                        });
                        element.data("upload_list", list).val(d.join(','));
                        contentCollapsibleMethod("ShiftNoteImagesUpLoad");
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        },
        getValue: function() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            return form.input.val();
        },
        setValue: function(arr) {
            return "";
        }
    }

    window.inputUpload = inputUpload;
})()
export {
    inputUpload
}