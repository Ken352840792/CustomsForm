import {
    app
} from "../../../Comment/basepage";
import {
    Popup
} from "../Popup/index";

(function() {
    //数据格式为 {'total':1000,data:[{}]
    let CustomTable = function(options) {

        let defaults = {
            initCallback: function() {}, //加载前
            completeCallback: function() {}, //加载完成后
            sources: undefined, //数据源,
            sourceUrl: '', //数据源URL
            sourcesCount: 0, //分页总条数
            pageSize: 5, //页显示数量
            headSource: [], //表头的列名 按照顺序填充数据
            headHandle: {}, //投处理数据{'username':'用户名'}
            Form: {}, //页面元素
            _selfFrom: '', //要添加到的位置
            customFormSource: [], //CustomForm数据源
            Paging: true, //是否分页

            delUrl: '', //删除的URL
            delParams: {}, //删除的url附带参数
            saveParams: {}, //保存的URL附带参数
            sourceParams: {}, //获取数据源的附带参数
            saveUrl: '', //保存数据
            customFormSetting: {},
            Events: {
                Add: {
                    state: true,
                    hander: function() {}
                },
                Del: {
                    state: true,
                    hander: function() {}
                },
            }
        };
        this.server = app.server;

        this.opts = $.extend({}, defaults, options);
        this.server.add({
            CustomSourceUrl: this.opts.sourceUrl,
            delUrl: this.opts.delUrl,
            saveUrl: this.opts.saveUrl,
        });
        this.opts.initCallback(this.opts);
        this.init();
        return this;
    };
    CustomTable.prototype = {
        init: function() {
            var _this = this,
                opts = this.opts;
            _this.createDataSource(1);
        },
        Events: function() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.allCheck.click(function() {
                var is = $(this).is(':checked');
                opts.sources.forEach(function(item) {
                    item.c = is;
                });
                form.tBody.find("tr").each(function() {
                    var model = $(this).data('model');
                    model.c = is;
                    $(this).data('model', model);
                    $(this).find('input:checkbox:first').prop('checked', is);
                });
            });
            opts._selfFrom.off('click', "tBody input:checkbox").on('click', "tBody input:checkbox", function() {
                var tr = $(this).parents('tr:first');
                var model = tr.data('model');
                var index = opts.sources.indexOf(model);
                model.c = !model.c;
                tr.data('model', model);
                opts.sources[index] = model;
                //是否勾上全选
                var checkCount = 0;
                opts.sources.forEach(function(item) {
                    if (item.c) {
                        checkCount++;
                    }
                });
                if (checkCount === opts.sources.length) {
                    form.allCheck.prop('checked', true);
                } else {
                    form.allCheck.prop('checked', false);
                }
            });
            form.tBody.on('click', 'a', function() {
                var ele_this = $(this);
                var model = $(this).parents('tr:first').data('model');
                switch ($(this).attr('op')) {
                    case 'edit':
                        form.AddPopup.opts.Form.title.find('h1').text('编 辑');
                        opts.customFormObj.setValue(_this.ConvertModelToArray(model));
                        form.AddPopup.open();
                        break;
                    case 'del':
                        if (!form.DelPopup) {
                            form.DelPopup = new Popup({
                                _selfFrom: ele_this,
                                title: '删除提示',
                                content: $('<div style="margin: 15px;width:200px;height:100px;text-align: center;line-height: 100px;">确认要删除吗？</div>'),
                                callback: function(index) {
                                    if (index === 1) {
                                        var params = $.extend({}, opts.delParams, {
                                            'delItem': model.Id
                                        });
                                        _this.server.delUrl.del({
                                            data: params,
                                            success: function() {
                                                msgShowInfo('删除成功');
                                            }
                                        });

                                    } else {
                                        form.DelPopup.close();
                                    }
                                }
                            });
                        }
                        form.DelPopup.open();
                        break;
                }

            });
        },
        ConvertModelToArray: function(model) {
            var array = [];
            for (const key in model) {
                array.push({
                    'name': key,
                    'value': model[key]
                });
            }
            return array;
        },
        createDataSource: function(pageIndex) {
            var _this = this,
                opts = this.opts;

            if (!opts.sources) {
                var params = $.extend({}, {
                    pageIndex: pageIndex,
                    pageSize: opts.pageSize
                }, opts.sourceParams);
                _this.server.CustomSourceUrl.get({
                    data: params,
                    success: function(obj) {
                        //head也需要处理 
                        if (obj instanceof Array) {
                            if (obj.length > 0) {
                                for (const key in obj[0]) {
                                    opts.headSource.push(key);
                                }
                                opts.sources = obj;
                            }
                        } else {
                            opts.sources = obj.data;
                            //解析header 获取lable
                            opts.headSource = obj.header;
                            opts.sourcesCount = obj.totalCount;
                        }
                        opts.sources.forEach(function(item) {
                            item.c = false;
                        });
                        //清除所有不包括自己的所有元素
                        //opts._selfFrom.siblings().remove();
                        _this.createComponent();
                        _this.createPaging(pageIndex, Math.ceil(opts.sourcesCount / opts.pageSize), opts.sourcesCount);
                    }
                })
            } else {
                _this.createComponent();
            }
        },
        //创建Component表
        createComponent: function() {
            var _this = this,
                opts = this.opts;
            _this.createTable();
            if (!opts.PagingInit) {
                _this.Del();
                _this.Add();

                var event = opts.Events;
                if (event.Add.state || event.Edit.state) {
                    //加载Form
                    _this.createCustomForm();
                }
            }
            _this.Events();
            opts.completeCallback(opts, _this);
        },
        createCustomForm: function() {
            var _this = this,
                opts = this.opts;
            opts.customFormObj = opts.Form.AddPopup.opts.Form.body.customFrom(opts.customFormSetting);
        },
        createTable: function() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.thead = $('<thead></thead>');
            //加载全选按钮
            form.allCheck = $('<input type="checkbox" >');
            var th = $('<th></th>').append(form.allCheck);
            //加载头
            form.thead.append(th);
            if (opts.headSource && opts.headSource.length > 0) {
                //新增一个编辑按钮
                opts.headSource.forEach(function(item, index) {
                    if (item !== 'c') {
                        var str = opts.headHandle[item] ? opts.headHandle[item] : item;
                        form.thead.append('<th data-priority="' + index + '">' + str + '</th>');
                    }
                });
                form.thead.append('<th>编 辑</th>');
            }
            //加载数据
            if (opts.sources && opts.sources.length > 0) {
                form.tBody = $('<tbody></tbody>');
                opts.sources.forEach(function(item) {
                    var tr = $('<tr></tr>');
                    tr.append('<td><input type="checkbox" ></td>');
                    for (var key in item) {
                        if (key === 'c' || opts.headSource.indexOf(key) === -1) continue;
                        tr.append('<td>' + item[key] + '</td>');
                    }
                    tr.append('<td><div class="tableOp"><a class="ui-btn ui-icon-edit ui-btn-icon-notext " op="edit"  ></a><a class="ui-btn ui-icon-delete ui-btn-icon-notext" op="del" ></a></div></td>');
                    tr.data('model', item);
                    form.tBody.append(tr); 
                });
            }
            opts._selfFrom.html('');
            opts._selfFrom.append(form.thead).append(form.tBody);
        },
        createPaging: function(pageNo, totalPage, totalSize) {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            //判断是否已经创建过分页组件,如果创建过，则不需要加载原有的事件及方法
            if (!opts.PagingInit) {
                opts.PagingInit = true;
                form.paging = $(' <div  class="page_div"></div>');
                if (opts.Paging) {
                    opts._selfFrom.after(form.paging);
                    form.paging.paging({
                        pageNo: pageNo,
                        totalPage: totalPage,
                        totalSize: totalSize,
                        callback: function(num) {
                            opts.sources = undefined;
                            _this.createDataSource(num);
                        }
                    })
                }
            }

        },
        Add: function() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            var add = opts.Events.Add;
            if (add.state) {
                //渲染添加
                form.Add = $('<a style="float: right;" class="ui-table-columntoggle-btn ui-btn ui-btn-a ui-corner-all ui-shadow ui-mini">新 增</a>');
                //新增按钮
                form.Add.click(function() {
                    if (opts.sources.length > 0) {
                        var mo = opts.sources[0];
                        var cur = {};
                        for (const key in mo) {
                            cur[key] = "";
                        }
                        form.AddPopup.opts.Form.title.find('h1').text('新 增');
                        opts.customFormObj.setValue(_this.ConvertModelToArray(cur));
                    }
                    form.AddPopup.open();
                });
                opts._selfFrom.before(form.Add);
                form.AddPopup = new Popup({
                    _selfFrom: form.Add,
                    title: '新增',
                    content: $('<div style="margin: 15px;"></div>'),
                    callback: function(index) {
                        if (index === 1) {

                            console.log(opts.customFormObj.save());
                        } else {
                            form.AddPopup.close();
                        }
                    }
                });

            }
        },
        Del: function() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            var Del = opts.Events.Del;
            if (Del.state) {
                //渲染添加
                form.Del = $('<span style="float: right;" class="ui-table-columntoggle-btn ui-btn ui-btn-a ui-corner-all ui-shadow ui-mini">删 除</span>');
                form.Del.click(function() {
                    var check = opts.sources.filter(function(item) {
                        return item.c;
                    });
                    if (check.length > 0) {
                        var checkStr = [];
                        check.forEach(function(item) {
                            checkStr.push(item.Id);
                        });
                        var params = $.extend({}, opts.delParams, {
                            'Id': checkStr
                        });
                        _this.server.delUrl.del({
                            data: params,
                            success: function() {
                                msgShowInfo('删除成功');
                            }
                        });
                    } else {
                        msgShowInfo('请选择删除的项');
                    }
                });
                opts._selfFrom.before(form.Del);
            }
        },
        getValue: function() {
            return;
        },
        setValue: function(arr) {
            return;
        }
    };
    window.CustomTable = CustomTable;
})();
export {
    CustomTable
}