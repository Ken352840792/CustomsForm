; (function ($, window, document, undefined) {
    //构造函数
    var ImageUpload = function (ele, opt) {
        this.$element = ele,
        this.$fileInput = null,
        this.$imgContainer = null,
        this.$upLoadBtn = null,
        this.$z_file = null,
        this.imgList = [],
        this.options = $.extend({}, this.defaults, opt)
    }
    ImageUpload.defaults = {
        url: "",
        fileType: ["jpg", "png", "bmp", "jpeg", "JPG", "PNG", "JPEG", "BMP"], // 上传文件的类型
        fileSize: 1024 * 1024 * 10, // 上传文件的大小 10M
        count: 0,
        imageNum: 5,
        success: null,
        error: null,
        multiple: false
    };
    ImageUpload.LOCALES = {};
    ImageUpload.LOCALES['zh-CN'] = {
        countMsg: function (size) {
            return '上传图片数目不可以超过' + size + '个，请重新选择';
        },
        sizeMaxMsg: function (size) {
            return '文件超过(' + (size / 1024).toFixed(2) + ')K不能上传';
        },
        typeErrMsg: function (name) {
            return '您上传的"' + file.name + '"不符合上传类型'
        },
        typeUnMsg: function (name) {
            return '您上传的"' + file.name + '"无法识别类型'
        },
        imgBtnMsg: function () {
            return '';
        },
        removeMsg: function () {
            return '删除';
        },
        titleLabel: function () {
            return '图片上传:';
        },
        countMaxLabel: function (size) {
            return '最多可以上传' + size + '张图片';
        },
        uploadBtnMsg: function () {
            return '点击上传';
        },
        waitMsg: function () {
            return '等待上传';
        },
        onUpLoadMsg: function () {
            return '正在上传';
        },
        successMsg: function () {
            return '上传成功';
        },
        errorMsg: function () {
            return '上传失败'
        },
        doneMsg: function () {
            return '完成'
        },
    }
    $.extend(ImageUpload.defaults, ImageUpload.LOCALES['zh-CN']);
    //方法
    ImageUpload.prototype = {
        init: function () {
            var $this = this;
            var thisParent = $this.$element.parent();//插入位置

            var pluginsDiv = $("<div>").appendTo(thisParent);
            pluginsDiv.addClass("row_img");

            var accept = "image/" + $this.options.fileType.join(",image/");

            var addImages = $([
                '<div class="img-box full">',
                   '<section class="img-section">',
                       '<p class="up-p">' + $this.options.titleLabel() + '<span class="up-span">' + $this.options.countMaxLabel($this.options.imageNum) + '</span></p>',
                       '<div class="z_photo upimg-div">',
                           '<div class="clearfix"></div>' +

                           '<div class="clearfix"><section class="z_file">',
                               '<span class="add-img">' + $this.options.imgBtnMsg() + '</span>',
                               '<input type="file" id="help_' + $this.$element[0].id + '" class="file" accept="' + accept + '"' + ($this.options.multiple ? "multiple" : "") + ' />',
                           '</section></div>',
                        '</div>',
                   '</section>',
               '</div>'
            ].join(" "));
            $this.$fileInput = addImages.find('input');
            $this.$imgContainer = addImages.find('.z_photo');
            $this.$z_file = addImages.find('.z_file');
            addImages.appendTo(pluginsDiv);

            var msg = $('<p class="hint"></p>').appendTo(pluginsDiv);
            $this.ohint = msg;
            //var uploadBtn =
            //    $(['<div class="row row_action">',
            //               '<div class="col-md-offset-10 col-md-2">',
            //                  '<button type="button" class="btn blue" id="btn">点击上传</button>',
            //                '</div>',
            //            '</div>'
            //    ].join(" "));

            //uploadBtn.appendTo(pluginsDiv);
            //$this.$upLoadBtn = uploadBtn.find("button");
            /* 点击上传图片的文本框 */
            $this.$fileInput.change(function () {

                // $this.imgList = [];//清空选择项
                // $this.$imgContainer.find(".up-section").remove();
                var fileList = $this.$fileInput[0].files; // 获取的图片文件
                //   var input = $(this).parent(); // 文本框的父亲元素
                var imgArr = [];
                var numUp = $this.imgList.length;

                var totalNum = numUp + fileList.length; // 总的数量

                if (fileList.length > $this.options.imageNum || totalNum > $this.options.imageNum) {

                    $this.msgShow($this.options.countMsg($this.options.imageNum));

                } else if (numUp < $this.options.imageNum) {
                    fileList = $this.validateUp(fileList, $this.options);
                    for (var i = 0; i < fileList.length; i++) {
                        var imgUrl = window.URL.createObjectURL(fileList[i]);
                        imgArr.push(imgUrl);
                        var $section = $("<section class='up-section fl'>");
                        $this.$imgContainer.find(".z_file").parent().prev("div").append($section);
                        var $span = $("<span class='up-span'>");
                        $span.appendTo($section);
                        var $img0 = $("<div class='close-upimg'>").on("click", function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                            var section = $(this).parent();
                            var index = section.index();
                            $this.imgList.splice(index, 1);//删除文件
                            section.remove();

                        });
                        //$img0.attr("src", "/Areas/BPM/js/plugins/imageupload/img/a7.png").appendTo($section);
                        $img0.appendTo($section);
                        var $img = $("<img class='up-img'>");
                        $img.attr("src", imgArr[i]);
                        $img.appendTo($section);
                        var $p = $("<p class='img-name-p'>");
                        $p.html(fileList[i].name).appendTo($section);
                    };
                    var up_section = $this.$imgContainer.find(".up-section");
                    var length = $this.imgList.length;
                    $.each(fileList, function (key, content) {
                        $this.imgList.push(fileList[i]);//添加文件
                        var obj = up_section.eq(length + key);//正在上传的那个文件
                        obj.addClass("loading");
                        obj.find(".up-img").addClass("up-opcity");
                        $this.uploadImg($this.options, content, obj);
                    });
                    // $this.imgList = [];
                }
                //if ($this.imgList.length >= $this.options.imageNum) {//等于限制个数
                //    $this.$z_file.hide();//隐藏添加按钮
                //};
                //input内容清空
                $this.$fileInput.val("");
                //$this.$element.data("upload_list", "").val("");
                //绑定上传事件
            });
            //$this.$upLoadBtn.click(function () {

            //    if ($this.imgList.length > 0) {
            //        var up_section = $this.$imgContainer.find(".up-section")
            //        $.each($this.imgList, function (key, content) {
            //            var obj = up_section.eq(key);//正在上传的那个文件
            //            obj.addClass("loading");
            //            obj.find(".up-img").addClass("up-opcity");
            //            $this.uploadImg($this.options, content, obj);
            //        });
            //        $this.imgList = [];
            //    } else {
            //        if ($this.$imgContainer.find(".up-section").length > 0) {

            //            $this.msgShow("添加的图片都以上传完成,上传失败的请点击重传");
            //        } else {
            //            $this.msgShow("没有要上传的图片请先添加要上传的图片");
            //        }

            //    }
            //});
            return $this;
        },
        // 验证文件的合法性
        validateUp: function (files, defaults) {
            var $this = this;
            var arrFiles = []; // 替换的文件数组
            for (var i = 0, file; file = files[i]; i++) {
                // 获取文件上传的后缀名
                var newStr = file.name.split("").reverse().join("");
                if (newStr.split(".")[0] != null) {
                    var type = newStr.split(".")[0].split("")
                        .reverse().join("");

                    if (jQuery.inArray(type, defaults.fileType) > -1) {
                        // 类型符合，可以上传
                        if (file.size >= defaults.fileSize) {//文件超过限制大小
                            $this.msgShow($this.options.sizeMaxMsg(defaults.fileSize));
                        } else {
                            arrFiles.push(file);
                        }
                    } else {

                        $this.msgShow($this.options.typeErrMsg(file.name));//类型错误

                    }
                } else {
                    $this.msgShow($this.options.typeUnMsg(file.name));//未识别
                }
            }
            return arrFiles;
        },
        uploadImg: function (opt, file, obj) {
            var $this = this;

            // 验证通过图片异步上传
            var url = opt.url;
            var data = new FormData();
            // data.append("path", opt.formData.path);
            data.append("name", file.name)
            data.append("file", file);
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (data) {

                    $this.msgShow($this.options.successMsg());//上传成功;

                    // 上传成功

                    obj.removeClass("loading");
                    obj.find(".up-img").removeClass("up-opcity");
                    //obj.find(".close-upimg").remove();
                    obj.find(".up-span").append("<label>" + $this.options.doneMsg() + "</label>").addClass("success");

                    obj.find(".close-upimg").off().on("click", function () {
                        $this.deleteImg(obj, data);
                    });

                    if (typeof $this.options.success == 'function') {
                        $this.options.success(data);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //var err = "上传失败，请联系管理员！";



                    obj.removeClass("loading");//去掉菊花
                    obj.find(".up-img").removeClass("up-opcity");//去掉透明度
                    var span = obj.find(".up-span").addClass("error").empty();

                    var a = $("<a>").addClass("btn-link").text($this.options.errorMsg()).click(function () {
                        obj.find(".up-span").addClass("error").empty();
                        obj.addClass("loading");
                        obj.find(".up-img").addClass("up-opcity");
                        $this.uploadImg(opt, file, obj);//单独上传

                    }).appendTo(span);

                    if (typeof $this.options.error == 'function') {
                        $this.options.error(XMLHttpRequest, textStatus, errorThrown);
                    }
                }
            })
        },
        deleteImg: function (obj, data) {
            var $this = this;
            $.ajax({
                type: $this.options.delType,
                url: $this.options.del,
                data: $this.options.delData(data),
                success: function (d) {

                    if ($this.options["delSuccess"] && typeof $this.options.delSuccess == 'function') {
                        var res = $this.options.delSuccess(d, data);//回调方法决定是否删除成功
                        if (res) {
                            var index = obj.index();
                            obj.remove(); //删除这一行
                            $this.imgList.splice(index, 1); //删除数据
                        } else {
                            //$this.msgShow("删除失败");
                            $this.msgShow($this.options.errorMsg());
                        }
                    } else {//没有回调默认删除成功
                        var index = obj.index();
                        obj.remove(); //删除这一行
                        $this.imgList.splice(index, 1); //删除数据
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if ($this.options["delError"] && typeof $this.options.delError == 'function') {
                        $this.options.delError(data, XMLHttpRequest, textStatus, errorThrown);
                    }
                }
            });

        },
        //消息提示
        msgShow: function (msg) {
            var $this = this;
            $this.ohint.html(msg);//文件内容为空，不能上传
            $this.ohint.show(500);
            setTimeout(function () {
                $this.ohint.hide(500);
            }, 2000);
        },
    }
    //在插件中使用对象
    $.fn.imageUpload = function (option) {
        //配置传参
        var options = $.extend({}, ImageUpload.defaults,
                 typeof option === 'object' && option);
        //创建的实体
        var upload = new ImageUpload(this, options);
        //调用其方法
        return upload.init();
    }
})(jQuery, window, document);