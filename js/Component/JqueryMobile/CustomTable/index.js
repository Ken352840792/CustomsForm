import {
    app
} from "../../../Comment/basepage";
(function () {
    //数据格式为 {'total':1000,data:[{}]

    let CustomTable = function (options) {
        let defaults = {
            sources: undefined, //数据源,
            sourceUrl: '', //数据源URL
            headSource:[],//表头的列名 按照顺序填充数据
            Form: {}, //页面元素
            _selfFrom: '', //要添加到的位置
            Events: {
                Add: function () {},
                Edit: function () {},
                Del: function () {}
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
            _this.createComponent();
            _this.Events();
            //调用自定义事件
            if (opts.customEvent) {
                opts.customEvent.oninitialize ? opts.customEvent.oninitialize(_this.input, _this) : '';
            }
        },
        Events: function () {

        },
        createDataSource:function(){
            var _this = this,
            opts = this.opts;
            if (!opts.sources) {
                _this.server.CustomSourceUrl.get({
                    data: {}, 
                    success: function (data) {
                       
                    }
                })
            } 
        },
        //创建Component表
        createComponent: function () {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            if (Data) {
                Component(Data)
            } else {
                _this.server.ButtonsSourceUrl.get({
                    data: {},
                    async: false,
                    success: function (data) {
                        Data == data.sourceData.data;
                        Component(Data)
                    }
                })
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
    Text
}