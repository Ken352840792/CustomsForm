(function() {
    let Nav = function(options) {
        let defaults = {
            form: {},
            arr: [],
            initData: [{ 'TableName': 'ceshi2', 'customForm': [{ 'name': 'username', 'value': '123' }] }],
            value: "" //双向数据绑定字段
        };
        this.opts = $.extend({}, defaults, options);
        this.init();
        return this;
    };
    Nav.prototype = {
        init: function() {
            this.begin();
            this.tableSwitch();
        },
        // 切换 和切换时的数据交换
        tableSwitch: function() {
            var _this = this,
                opts = _this.opts,
                form = opts.form;
            form.flag = true;
            $('#ul_label').on('click', 'li', function() {
                var index = $(this).index();
                $("#ul_box > div")
                    .eq(index)
                    .addClass("ul_selected")
                    .siblings()
                    .removeClass("ul_selected");
                if ($('#ul_a').is('.ui-btn-active')) {
                    if (form.flag) {
                        _this.createComponent(form.arr);
                        form.flag = false;
                    }

                }
            });


            _this.buttonStart()
        },
        // 数据初始化:
        begin: function() {
            var _this = this,
                opts = _this.opts,
                form = opts.form;
            var url = '../data/tab.json',
                data = {},
                type = 'get',
                callback = function(data) {
                    form.arr = data;
                };
            this.Interaction(url, type, data, callback);
        },
        // 数据渲染
        createComponent: function(data, callback) {
            var _this = this,
                opts = _this.opts,
                form = opts.form;
            form.lable = $('#lable');
            form.num = 0;
            form.array = [];

            form.lable_div = $('#lable_div');
            data.forEach(function(item, index) {

                form.table_s = $('<div class = "swiper-slide selected"> ' + item.Name + ' </div>')
                form.table = $('<div class = "swiper-slide "> ' + item.Name + ' </div>')
                form.swiper = $('<div class="swiper-slide swiper-no-swiping"></div>')

                if (item.type === 0) {
                    form.save = $('<a class="ui-btn ui-mini ui-corner-all ui-btn-inline ui-btn-color save"> 确定</a>');
                    if (Object.is(index, 0)) {
                        form.lable.append(form.table_s);

                    } else {
                        form.lable.append(form.table);
                    }
                    form.swiper.append(form.save);


                    var customForm = _this.formdata(form.swiper, function() {
                        opts.initData.forEach(function(it) {
                            if (item.TableName === it.TableName) {
                                customForm.setValue(it.customForm);
                            }
                        });
                    });


                } else if (item.type === 1) {
                    form.type = $(' <table data-role="table" class="ui-responsive" ></table>')
                    if (Object.is(index, 0)) {
                        form.lable.append(form.table_s);

                    } else {
                        form.lable.append(form.table);
                    }

                    form.swiper.append(form.type);
                    new CustomTable({
                        _selfFrom: form.type,
                        sourceUrl: '/data/customTable.json',
                        headHandle: {
                            'username': '用户名',
                            'age': '年龄'
                        },
                        delUrl: '/data/del.json',
                        delParams: {
                            'tableName': 'ceshi'
                        },
                        saveParams: {
                            'tableName': 'saveceshi'
                        },
                        sourceParams: {
                            'tableName': 'selectceshi'
                        },
                        customFormSetting: {
                            myRuleGuid: '1111',
                            sourceData: [],
                            ruleUrl: "/data/ruledata.json",
                            sourceUrl: "/data/ceshi.json",
                            completeCallback: function() {
                                console.log('我是全部加载完了!');
                                console.log(new Date());
                            },
                            saveUrl: "/data/save.json"
                        }
                    })
                }

                form.lable_div.append(form.swiper);


                form.save.data('customForm', customForm);
            });
            _this.btnData();
            _this.transfer();
            _this.BOXheight();
        },
        // ajax请求
        Interaction: function(url, type, data, callback) {
            $.ajax({
                url: url,
                type: type,
                data: data,
                async: true,
                success: function(data) {
                    callback(data);
                }
            })
        },
        // 高度计算
        BOXheight: function() {
            var _this = this;
            var height = $(window).height() - ($('.ui-content').innerHeight() - $('.ui-content').height()) - $('.ui-navbar').height() - $('#lable').height() - 20;
            var height_table = $(window).height() - ($('.ui-content').innerHeight() - $('.ui-content').height()) - $('.ui-navbar').height() - 20;
            $('.swiper-no-swiping').height(height);
            $('#form').height(height_table);
        },
        // div 组件运行
        formdata: function(data, callback) {
            return data.customFrom({
                myRuleGuid: '1111',
                sourceData: [],
                ruleUrl: "/data/ruledata.json",
                sourceUrl: "/data/nav.json",
                saveUrl: "/data/save.json",
                completeCallback: callback
            });
        },
        // 插件执行
        transfer: function() {
            function setCurrentSlide(ele, index) {
                $(".swiper1 .swiper-slide").removeClass("selected");
                ele.addClass("selected");
            }

            var swiper1 = new Swiper('.swiper1', {
                //					设置slider容器能够同时显示的slides数量(carousel模式)。
                //					可以设置为number或者 'auto'则自动根据slides的宽度来设定数量。
                //					loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides。
                slidesPerView: 8,
                paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                spaceBetween: 10, //slide之间的距离（单位px）。
                freeMode: true, //默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
                loop: false, //是否可循环
                onTab: function(swiper) {
                    var n = swiper1.clickedIndex;
                }
            });
            swiper1.slides.each(function(index, val) {
                var ele = $(this);
                ele.on("click", function() {
                    setCurrentSlide(ele, index);
                    swiper2.slideTo(index, 0, false);
                });
            });

            var swiper2 = new Swiper('.swiper2', {
                //freeModeSticky  设置为true 滑动会自动贴合  
                direction: 'horizontal', //Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)。
                loop: false,
                autoHeight: false, //自动高度。设置为true时，wrapper和container会随着当前slide的高度而发生变化。
                onSlideChangeEnd: function(swiper) { //回调函数，swiper从一个slide过渡到另一个slide结束时执行。
                    var n = swiper.activeIndex;
                    setCurrentSlide($(".swiper1 .swiper-slide").eq(n), n);
                    swiper1.slideTo(n, 0, false);
                }
            });
        },
        // button 数据调用
        buttonStart: function() {
            var _this = this;
            var formData = function() {
                var objs = {};
                $.get('/data/buttons.json', function(obj) {
                    obj.forEach(function(item) {
                        item._selfFrom = $('#form');
                        objs[item.name] = new Buttons(item);
                        _this.BOXheight();
                    });
                });
                this.Buttons = objs;
            };
            formData.prototype = {
                getValue: function() {
                    var obj = {};
                    for (const key in this.Buttons) {
                        var val = this.Buttons[key].getValue();
                        if (val.length != 0) {
                            obj[key] = val;
                        }

                    }
                    return obj;
                },
                setValue: function(values) {
                    for (const key in this.Buttons) {
                        var button = this.Buttons[key],
                            buttonOpts = button.opts;
                        values.forEach(function(item) {
                            if (item.name === key) {
                                if (item.value instanceof Array) {
                                    button.setValue(item.value);
                                } else {
                                    var array = [];
                                    array.push(item.value);
                                    button.setValue(array);
                                }
                            }
                        });
                    }
                }
            };
            $(function() {
                window.ff = new formData();
            });
            var event = $('#btn');
            event.on('click', function() {
                    console.log(ff.getValue());
                })
                // _this.btnData(event)
        },
        // btn 获取数据
        btnData: function(eve) {
            $('.save').click(function() {
                console.log($(this).data('customForm').getValue());
            });
        }

    };
    window.Nav = Nav;
})();
export {
    Nav
}