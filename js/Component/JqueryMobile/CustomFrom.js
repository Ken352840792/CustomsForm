import {
    app
} from '../../Comment/basepage';
import {
    Text
} from './Text/index';
import {
    TextNumber
} from './Number/index';
import {
    TextData
} from './Date/index';
import {
    Buttons
} from './Button/index';
import {
    CustomTable
} from './CustomTable/index';
import {
    Popup
} from './Popup/index';
(function () {
    var componentMapping = {
        text: Text,
        number: TextNumber,
        data: TextData,
        button: Buttons
    };
    var customFrom = function (_self, options) {
        var defaults = {
            saveUrl: '',
            saveParams: {},
            ruleUrl: '',
            ruleParams: {},
            ruleData: [],
            myRuleData: [],
            myRuleGuid: '',
            sourceUrl: '',
            sourceParams: {},
            sourceData: [],
            componentsInitCount: 0,
            componentsFactCompleteCount: 0,
            completeCallback: function () {},
            components: {} //组件集合
        };
        this._self_ = _self,
            this.opts = $.extend({}, defaults, options),
            this.server = app.server;
        if (this.opts.sourceData.length === 0 && !this.opts.sourceUrl) return;
        this.server.add({
            ruleUrl: this.opts.ruleUrl,
            sourceUrl: this.opts.sourceUrl,
            saveUrl: this.opts.saveUrl
        });
        this.init();
    };
    customFrom.prototype = {
        init: function () {
            //创建循环创建组件
            var _this = this,
                opts = this.opts;
            //初始化数据源配置数据
            _this.setSourceData(function () {
                //初始化表单角色数据
                _this.setRuleData();
                opts.sourceData.forEach(function (item) {
                    if (opts.myRuleData.indexOf(item.name) !== -1 && componentMapping.hasOwnProperty(item.type)) {
                        opts.componentsInitCount += 1;
                    }
                });
                opts.sourceData.forEach(function (item) {
                    if (opts.myRuleData.indexOf(item.name) !== -1 && componentMapping.hasOwnProperty(item.type)) {
                        var componentName = item.type + '_' + item.name;
                        item._selfFrom = _this._self_;
                        item.completeCallback = function () {
                            opts.componentsFactCompleteCount += 1;
                            if (opts.componentsFactCompleteCount === opts.componentsInitCount) {
                                opts.completeCallback(opts);
                            }
                        };
                        opts.components[componentName] = new componentMapping[item.type](item);
                        //绑定事件
                        for (var e in item.events) {
                            if (e in opts.components[componentName]) {} else {
                                opts.components[componentName].input.on(e, typeof item.events[e] === "string" ? Function("return " + item.events[e])() : item.events[e]);
                            }
                        }

                    }
                });
            });
        },
        setSourceData: function (callback) {
            var _this = this,
                opts = this.opts;
            if (opts.sourceData.length === 0) {
                _this.server.sourceUrl.get({
                    data: opts.sourceParams,
                    success: function (obj) {
                        opts.sourceData = obj;
                        callback();
                    }
                });
            } else {
                callback();
            }
        },
        setRuleData: function (url) {
            var _this = this,
                opts = this.opts;
            if (opts.ruleData.length === 0) {
                _this.server.ruleUrl.get({
                    data: opts.ruleParams,
                    async: false,
                    success: function (obj) {
                        opts.ruleData = obj;
                    }
                });
            }
            opts.sourceData.forEach(function (item) {
                opts.ruleData.forEach(function (ruleItem) {
                    if (ruleItem.name === item.name && ruleItem.roleGuids.indexOf(opts.myRuleGuid) !== -1) {
                        opts.myRuleData.push(item.name);
                    }
                });

            });
        },
        getValue: function () {
            var _this = this,
                opts = this.opts;
            var retrunObj = {};
            for (var itemAttr in opts.components) {
                retrunObj[itemAttr.split('_')[1]] = opts.components[itemAttr].getValue();
            }
            return retrunObj;
        },
        ///[{'name':'UserName','value':'123'}]
        setValue: function (values) {
            var _this = this,
                opts = this.opts;
            for (var itemAttr in opts.components) {
                values.forEach(function (item) {
                    if (item.name === itemAttr.split('_')[1]) {
                        opts.components[itemAttr].setValue(item.value);
                    }
                });
            }
        },
        valid: function () {
            var _this = this,
                opts = this.opts,
                v = true;
            for (var itemAttr in opts.components) {
                if (v) {
                    opts.sourceData.forEach(function (item) {
                        if (v) {
                            if (item.name === itemAttr.split('_')[1]) {
                                //必须输入
                                if (item.regexp && item.regexp.require) {
                                    if (opts.components[itemAttr].getValue().trim() === "") {
                                        v = false;
                                        alert(item.placeholder ? item.placeholder : item.lable + "必须输入");
                                        return;
                                    }
                                }
                                //正则验证
                                if (item.regexp && item.regexp.test) {
                                    v = new RegExp(item.regexp.test).test(opts.components[itemAttr].getValue());
                                    if (!v) {
                                        alert(item.regexp && item.regexp.msg ? item.regexp.msg : "正则验证无提示信息");
                                        return;
                                    }
                                }
                                //自定义验证
                                if (item.regexp && item.regexp.customMethod) {
                                    var fun = typeof item.regexp.customMethod === "string" ? Function("return " + item.regexp.customMethod)() : item.regexp.customMethod;
                                    if (!fun(opts.components[itemAttr].getValue(), opts.components[itemAttr])) {
                                        v = false;
                                        alert(item.regexp && item.regexp.customMethodMsg ? item.regexp.customMethodMsg : "自定义验证无提示信息");
                                        return;
                                    };
                                }
                            }
                        }
                    });
                }
            }
            return v;
        },
        save: function () {
            var _this = this,
                opts = this.opts;
            if (_this.valid()) {
                var params = $.extend({}, opts.saveParams, _this.getValue());
                _this.server.saveUrl.post({
                    data: params,
                    success: function (obj) {
                        alert('提交成功');
                    }
                });
            } else {
                alert('验证失败咯');
            }
        }
    };
    $.fn.extend({
        customFrom: function (options) {
            if (typeof options === 'string') {
                var data = $(this).data('customFrom');
                data[options].apply(data, Array.prototype.slice.call(arguments, 1));
            } else {
                var modal = new customFrom($(this), options);
                $(this).data('customFrom', modal);
                return modal;
            }
        }
    });
})();