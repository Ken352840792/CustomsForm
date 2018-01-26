import {
    app
} from "../../../Comment/basepage";
(function () {
    let Nav = function (options) {
        let defaults = {
            form: {},
            arr: [],
            //**//initData: [],
            initData: apiUrl + '/FormManager/GetFormDataList',
             //**//initData: '/data/Server/GetFormDataList.json',
            initDataParams: {
                pageindex: 1,
                pagesize: 1,
                order: 'createTime desc'
            },
            ButtonsSelectUrl: apiUrl + '/FormList/GetFormListById/1',
            //**//ButtonsSelectUrl: '/data/Server/GetFormListById.json',
            navUrl: apiUrl + '/FormList/Select',
            //**//navUrl: '/data/Server/Select.json',
            MultiData: {},
            curMultiData: {}, //当前多维数据选择的项
            navParams: {},
            navSource: [],
            value: "" //双向数据绑定字段
        };
        this.opts = $.extend({}, defaults, options);
        this.server = app.server;
        this.server.add({
            NavUrl: this.opts.navUrl,
            initData: this.opts.initData,
            ButtonsSelectUrl: this.opts.ButtonsSelectUrl
        })
        this.init();
        return this;
    };
    Nav.prototype = {
        init: function () {
            this.tableSwitch();
        },
        // 切换 和切换时的数据交换
        tableSwitch: function () {
            var _this = this,
                opts = _this.opts,
                form = opts.form;
            $('#ul_label').on('click', 'li', function () {
                var index = $(this).index();
                $("#ul_box > div")
                    .eq(index)
                    .addClass("ul_selected")
                    .siblings()
                    .removeClass("ul_selected");
                if (index === 1 && opts.curMultiData !== opts.MultiData) {
                    _this.begin();
                }
            });
            _this.buttonStart()
        },
        // 数据初始化:
        begin: function () {
            var _this = this,
                opts = _this.opts,
                form = opts.form;
            if (opts.navSource.length > 0) {
                form.arr = opts.navSource;
            } else {
                _this.server.NavUrl.post({
                    data: opts.MultiData,
                    success: function (data) {
                        //数据转换
                        var arr = [];
                        data.forEach(function (item) {
                            arr.push({
                                'Name': item.FormListName,
                                'TableName': item.ConfigFileName,
                                'type': item.InputFrequency
                            });
                        });
                        opts.curMultiData = opts.MultiData;
                        _this.createComponent(arr);
                    }
                });
            }
        },
        // 数据渲染
        createComponent: function (data, callback) {
            $('#lable').html('');
            $('#lable_div').html('');
            var _this = this,
                opts = _this.opts,
                form = opts.form;
            form.lable = $('#lable');
            form.num = 0;
            form.array = [];
            form.lable_div = $('#lable_div');
            data.forEach(function (item, index) {
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
                    var customForm = _this.formdata(form.swiper, item, function (callbackOpts) {
                        _this.server.initData.get({
                            data: $.extend({}, opts.initDataParams, callbackOpts.initParams),
                            success: function (obj) {
                                var data = obj.data[0];
                                var cusArr = [];
                                if (!data) {
                                    return;
                                }
                                for (const key in data) {
                                    var customData = {};
                                    customData.name = key;
                                    customData.value = data[key];
                                    cusArr.push(customData);
                                }
                                customForm.setValue(cusArr);
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
                        //**//sourceUrl: '/data/customTable.json',
                        sourceUrl:_this.server.initData,
                        sourceParams:$.extend({}, opts.initDataParams,{'tablename':item.TableName,'pagesize':5} ),
                        headHandle: {
                            'username': '用户名',
                            'age': '年龄',
                            'birthday':'出生年月日'
                        },
                        //**//delUrl: '/data/del.json',
                        delUrl: apiUrl+'/FormManager/DelFormData',
                        delParams: {
                            'tableName': item.TableName
                        },
                        saveParams: {
                            'tableName': 'saveceshi'
                        },
                        customFormSetting: {
                            completeCallback: function () {
                                console.log('我是全部加载完了!');
                                console.log(new Date());
                            },
                            myRuleGuid: app.Cookie('RoleIds') ? app.Cookie('RoleIds').split(',') : ['cb33b16e-b088-4124-92d8-918fdd2a5922'],
                            sourceData: [],
                            //**//ruleUrl: '/data/Server/GetCustomFormRoleRelation.json',
                            ruleUrl: apiUrl + "/FormManager/GetCustomFormRoleRelation",
                            ruleParams: {
                                'TableName': item.TableName
                            }, 
                            //**//sourceUrl: "/data/Server/LoadFormView.json",
                            sourceUrl: "/FormManager/LoadFormView",
                            sourceParams: {
                                'formName': item.TableName
                            },
                            //**//saveUrl: '/data/Server/AddFormData.json',
                            saveUrl: apiUrl + "/FormManager/AddFormData",
                            saveParams: {
                                'tablename': item.TableName
                            },
                            initParams: {
                                'tablename': item.TableName
                            }
                        }
                    })
                }
                form.lable_div.append(form.swiper);
                if(form.save){
                    form.save.data('customForm', customForm);
                }
            });
            _this.btnData();
            _this.transfer();
            _this.BOXheight();
        },
        // 高度计算
        BOXheight: function () {
            var _this = this;
            var height = $(window).height() - ($('.ui-content').innerHeight() - $('.ui-content').height()) - $('#lable').height() - 80;
            var height_table = $(window).height() - ($('.ui-content').innerHeight() - $('.ui-content').height()) - 80;
            // var height = $(window).height() - ($('.ui-content').innerHeight() - $('.ui-content').height()) - $('.ui-navbar').height() - $('#lable').height() - 20;
            // var height_table = $(window).height() - ($('.ui-content').innerHeight() - $('.ui-content').height()) - $('.ui-navbar').height() - 20;
            $('.swiper-no-swiping').height(height);
            $('#form').height(height_table);
        },
        // div 组件运行
        formdata: function (data, item, callback) {
            return data.customFrom({
                myRuleGuid: app.Cookie('RoleIds') ? app.Cookie('RoleIds').split(',') : ['cb33b16e-b088-4124-92d8-918fdd2a5922'],
                sourceData: [],
                //**//ruleUrl: '/data/Server/GetCustomFormRoleRelation.json',
                ruleUrl: apiUrl + "/FormManager/GetCustomFormRoleRelation",
                ruleParams: {
                    'TableName': item.TableName
                },
                //**//sourceUrl: "/data/Server/LoadFormView.json",
                sourceUrl: "/FormManager/LoadFormView",
                sourceParams: {
                    'formName': item.TableName
                },
                //**//saveUrl: '/data/Server/AddFormData.json',
                saveUrl: apiUrl + "/FormManager/AddFormData",
                saveParams: {
                    'tablename': item.TableName
                },
                initParams: {
                    'tablename': item.TableName
                },
                completeCallback: callback
            });
        },
        // 插件执行
        transfer: function () {
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
                onTab: function (swiper) {
                    var n = swiper1.clickedIndex;
                }
            });
            swiper1.slides.each(function (index, val) {
                var ele = $(this);
                ele.on("click", function () {
                    setCurrentSlide(ele, index);
                    swiper2.slideTo(index, 0, false);
                });
            });

            var swiper2 = new Swiper('.swiper2', {
                //freeModeSticky  设置为true 滑动会自动贴合  
                direction: 'horizontal', //Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)。
                loop: false,
                autoHeight: false, //自动高度。设置为true时，wrapper和container会随着当前slide的高度而发生变化。
                onSlideChangeEnd: function (swiper) { //回调函数，swiper从一个slide过渡到另一个slide结束时执行。
                    var n = swiper.activeIndex;
                    setCurrentSlide($(".swiper1 .swiper-slide").eq(n), n);
                    swiper1.slideTo(n, 0, false);
                }
            });
        },
        // button 数据调用
        buttonStart: function () {
            var _this = this;
            var formData = function () {
                var _FormThis = this;
                _this.server.ButtonsSelectUrl.get({
                    data: {},
                    success: function (obj) {
                        var defaults = {
                            "tag": "button",
                            "type": "button",
                            "singleSelect": true
                        };
                        var lable = ['工厂', '车间', '生产线', '设备', '工序', '产品', '班组'];
                        var data = [];
                        //转换数据
                        var index_obj = 0;
                        for (const key in obj) {
                            if (obj[key] && obj[key] != null && key != 'FormTemplete') {
                                var o = {
                                    'data': []
                                };
                                obj[key].forEach(function (item, index) {
                                    o.data.push({
                                        'name': item.Name,
                                        'id': item.Id
                                    });
                                });
                                data.push($.extend({}, defaults, {
                                    'sourceData': o,
                                    'name': key,
                                    'lable': lable[index_obj]
                                }));
                                index_obj++;
                            }
                        }
                        var objs = {};
                        data.forEach(function (item) {
                            item._selfFrom = $('#form');
                            objs[item.name] = new Buttons(item);
                            _this.BOXheight();
                        });
                        _FormThis.Buttons = objs;
                    }
                });
            };
            formData.prototype = {
                getValue: function () {
                    var obj = {};
                    for (const key in this.Buttons) {
                        var val = this.Buttons[key].getValue();
                        if (val && val.length != 0) {
                            obj[key] = val;
                        }
                    }
                    return obj;
                },
                setValue: function (values) {
                    for (const key in this.Buttons) {
                        var button = this.Buttons[key],
                            buttonOpts = button.opts;
                        values.forEach(function (item) {
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
            $(function () {
                window.MultiData = new formData();
            });
            var event = $('#btn');
            event.on('click', function () {
                _this.opts.MultiData = MultiData.getValue();
                _this.opts.navSource = [];
                $('#ul_a').click();
            });
            // _this.btnData(event)
        },
        // btn 获取数据
        btnData: function (eve) {
            $('.save').click(function () {
                $(this).data('customForm').save()
            });
        }

    };
    window.Nav = Nav;
})();
export {
    Nav
}