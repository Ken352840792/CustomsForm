import {
    app
} from "../../../Comment/basepage";
(function () {
    //数据格式为 {'total':1000,data:[{}]

    let CustomTable = function (options) {
        let defaults = {
            sources: undefined, //数据源,
            sourceUrl: '', //数据源URL
            headSource: [], //表头的列名 按照顺序填充数据
            Form: {}, //页面元素
            _selfFrom: '', //要添加到的位置
            Events: {
                Add: {
                    state: true,
                    hander: function () {}
                },
                Edit: {
                    state: true,
                    hander: function () {}
                },
                Del: {
                    state: true,
                    hander: function () {}
                },
            }
        };
        this.server = app.server;
        this.server.add({
            CustomSourceUrl: options.sourceUrl
        })
        this.opts = $.extend({}, defaults, options);
        this.init();
        return this;
    };
    CustomTable.prototype = {
        init: function () {
            var _this = this,
                opts = this.opts;

            _this.createDataSource();
        },
        Events: function () {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.allCheck.click(function () {
                var is = $(this).is(':checked');
                opts.sources.forEach(function (item) {
                    item.c = is;
                });
                form.tBody.find("tr").each(function () {
                    var model = $(this).data('model');
                    model.c = is;
                    $(this).data('model', model);
                    $(this).find('input:checkbox:first').prop('checked', is);
                });
            });
            form.tBody.on('click', "input:checkbox", function () {
                var tr = $(this).parents('tr:first');
                var model = tr.data('model');
                var index = opts.sources.indexOf(model);
                model.c = !model.c;
                tr.data('model', model);
                opts.sources[index] = model;
                //是否勾上全选
                var checkCount = 0;
                opts.sources.forEach(function (item) {
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

        },
        createDataSource: function () {
            var _this = this,
                opts = this.opts;
            if (!opts.sources) {
                _this.server.CustomSourceUrl.get({
                    data: {},
                    success: function (obj) {
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
                            opts.headSource = obj.header;
                        }
                        opts.sources.forEach(function (item) {
                            item.c = false;
                        });
                        _this.createComponent();
                    }
                })
            } else {
                _this.createComponent();
            }
        },
        //创建Component表
        createComponent: function () {
            var _this = this,
                opts = this.opts;
            _this.createTable();
            _this.Events();
        },
        createTable: function () {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.Table = $('<table  data-role="table" class="ui-responsive" ></table>');
            form.thead = $('<thead></thead>');
            //加载全选按钮
            form.allCheck = $('<input type="checkbox" >');
            var th = $('<th></th>').append(form.allCheck);
            //加载头
            form.thead.append(th);
            if (opts.headSource && opts.headSource.length > 0) {
                opts.headSource.forEach(function (item, index) {
                    if (item !== 'c') {
                        form.thead.append('<th data-priority="' + index + '">' + item + '</th>');
                    }
                });
            }
            //加载数据
            if (opts.sources && opts.sources.length > 0) {
                form.tBody = $('<tbody></tbody>');
                opts.sources.forEach(function (item) {
                    var tr = $('<tr></tr>');
                    tr.append('<td><input type="checkbox" ></td>');
                    for (var key in item) {
                        if (key === 'c') continue;
                        tr.append('<td>' + item[key] + '</td>');
                    }
                    tr.data('model', item);
                    form.tBody.append(tr);
                });
            }
            form.Table.append(form.thead).append(form.tBody)
            opts._selfFrom.html('');
            opts._selfFrom.append(form.Table);
            $('body').trigger('create');
        },
        Add: function () {
            //添加操作
            var _this = this,
                opts = this.opts;
            add = opts.Events.Add;
            if (add.state) {

            }
        },
        Edit: function () {
            //编辑操作
            var _this = this,
                opts = this.opts;
            add = opts.Events.Add;
            if (add.state) {

            }
        },
        Del: function () {
            //删除操作
            var _this = this,
                opts = this.opts;
            add = opts.Events.Add;
            if (add.state) {

            }
        },
        getValue: function () {
            return;
        },
        setValue: function (arr) {
            return;
        }
    };
    window.CustomTable = CustomTable;
})();
export {
    CustomTable
}