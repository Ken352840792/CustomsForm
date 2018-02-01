import {
    app
} from "../../../Comment/basepage";

(function() {
    let DimensionsDataSelect = function(options) {
        let defaults = {
            initCallback: function() {}, //加载前
            completeCallback: function() {}, //加载完成后
            sourceUrl: {}, //数据源URL
            sourceParams: {}, //数据源发送附带参数
            sourceData: [], //直接数据源
            singleSelect: true,
            sourceConvertCall: undefined, //自定义转换数据
            lable: ['工厂', '车间', '生产线', '设备', '工序', '产品', '班组'] //按照顺序加载
        };
        this.opts = $.extend({}, defaults, options);
        this.init();
        return this;
    };
    DimensionsDataSelect.prototype = {
        init: function() {
            var _this = this,
                opts = this.opts;
            opts.initCallback(this.opts);
            _this.initData();
        },
        convertData: function(obj) { //默认处理转换方法
            var _this = this,
                opts = this.opts;
            var data = [];
            //转换数据
            var index_obj = 0;
            for (var key in obj) {
                if (obj[key] && obj[key] != null && key != 'FormTemplete') {
                    var o = {
                        'data': []
                    };
                    obj[key].forEach(function(item, index) {
                        o.data.push({
                            'name': item.Name,
                            'id': item.Id
                        });
                    });
                    data.push($.extend({}, {
                        "tag": "button",
                        "type": "button",
                        "singleSelect": opts.singleSelect
                    }, {
                        'sourceData': o,
                        'name': key,
                        'lable': opts.lable[index_obj]
                    }));
                    index_obj++;
                }
            }
            return data;
        },
        initData: function() {
            var _this = this,
                opts = this.opts;
            if (!opts.sourceData || opts.sourceData.length === 0) {
                opts.sourceUrl.get({
                    data: opts.sourceParams,
                    success: function(obj) {
                        //转换数据
                        var data = opts.sourceConvertCall ? opts.sourceConvertCall(obj, _this) : _this.convertData(obj);
                        _this.createComponent(data);
                    }
                });
            } else {
                _this.createComponent(opts.sourceData);
            }
        },
        //创建Component表
        createComponent: function(data) {
            var _this = this;
            var objs = {};
            data.forEach(function(item) {
                item._selfFrom = _this.opts._selfFrom;
                objs[item.name] = new Buttons(item);
            });
            _this.ButtonsComponents = objs;
            _this.opts.completeCallback(); //最终执行完后回调执行方法
        },
        getValue: function() {
            var _this = this;
            var obj = {};
            for (const key in _this.ButtonsComponents) {
                var val = _this.ButtonsComponents[key].getValue();
                if (val && val.length != 0) {
                    obj[key] = val;
                }
            }
            return obj;
        },
        setValue: function(values) {
            var _this = this;
            for (const key in _this.ButtonsComponents) {
                var button = _this.ButtonsComponents[key],
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
    window.DimensionsDataSelect = DimensionsDataSelect;
})();
export {
    DimensionsDataSelect
}