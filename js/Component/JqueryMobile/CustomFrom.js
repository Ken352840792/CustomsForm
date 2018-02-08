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
    DateSelect
} from './Date/index';
import {
    Buttons
} from './Button/index';
// import {
//     imageUpload
// } from './imageUpload/index';
import {
    CustomTable
} from './CustomTable/index';
import {
    Popup
} from './Popup/index';
import {
    Nav
} from './Navigation/index';
import {
    DimensionsDataSelect
} from './DimensionsDataSelect/index';
import {
    DataNav
} from './DataNav/index';
(function() {
    var componentMapping = {
        text: Text,
        number: TextNumber,
        datetime: DateSelect,
        dropdown: Buttons
        //images: inputUpload
    };
    var customFrom = function(_self, options) {
        var defaults = {
            saveUrl: {},
            saveParams: {},
            edit: false,
            Id: '', //开启编辑后会使用ID
            ruleUrl: {},
            ruleParams: {},
            ruleData: [],
            myRuleData: [],
            myRuleGuid: '',
            sourceUrl: {},
            sourceParams: {},
            sourceData: [],
            componentsInitCount: 0,
            componentsFactCompleteCount: 0,
            completeCallback: function() {},
            components: {} //组件集合
        };
        this._self_ = _self,
            this.opts = $.extend({}, defaults, options),
            this.init();
    };
    customFrom.prototype = {
        init: function() {
            //创建循环创建组件
            var _this = this,
                opts = this.opts;
            //初始化数据源配置数据
            _this.setSourceData(function() {
                //初始化表单角色数据
                _this.setRuleData();
                opts.sourceData.forEach(function(item) {
                    if (opts.myRuleData.indexOf(item.name) !== -1 && componentMapping.hasOwnProperty(item.type)) {
                        opts.componentsInitCount += 1;
                    }
                });
                opts.sourceData.forEach(function(item) {
                    if (opts.myRuleData.indexOf(item.name) !== -1 && componentMapping.hasOwnProperty(item.type)) {
                        var componentName = item.type + '_' + item.name;
                        item._selfFrom = _this._self_;
                        item.completeCallback = function() {
                            opts.componentsFactCompleteCount += 1;
                            if (opts.componentsFactCompleteCount === opts.componentsInitCount) {
                                //自定义事件
                                if (typeof FromInit !== 'undefined') {
                                    FromInit();
                                }
                                opts.completeCallback(opts, _this);
                            }
                        };
                        opts.components[componentName] = new componentMapping[item.type](item);
                        //绑定事件
                        for (var e in item.events) {
                            if (e in opts.components[componentName]) {} else {
                                opts.components[componentName].input.on(e, typeof item.events[e] === "string" ? Function("return " + item.events[e])() : item.events[e]);
                            }
                        }
                    } else {
                        //针对没有定义的控件
                        _this._self_.append(item.input);
                    }
                });

            });
        },
        setSourceData: function(callback) {
            var _this = this,
                opts = this.opts;
            if (opts.sourceData.length === 0) {
                opts.sourceUrl.get({
                    data: opts.sourceParams,
                    success: function(obj) {
                        //返回的是HTML
                        var html = $('<div style="display:none;"><div>');
                        $('body').append(html);
                        html.html(obj);
                        opts.sourceData = _this.convertData(html);
                        html.remove();
                        callback();
                    }
                });
            } else {
                callback();
            }
        },
        convertData: function(html) {
            var _this = this;
            var array = [];
            var formName = _this.opts.sourceParams.formName;
            var defaultsData = formSetting[formName].defaults;
            var attributes = formSetting[formName].attributes;
            var validateMsg = formSetting[formName].validateMsg;
            var events = formSetting[formName].events;
            var customevents = formSetting[formName].customevents;
            var validaterules = formSetting[formName].validaterules;
            //标准控件
            for (const key in defaultsData) {
                var _defaults = defaultsData[key],
                    name = _defaults.name,
                    _attributes = attributes[name],
                    _validateMsg = validateMsg[name],
                    _validaterules = validaterules[name],
                    _events = events[name],
                    _customEvent = customevents[name];
                if (!_defaults) return;
                var type = _defaults['widget-type'] === "input" ? 'text' : _defaults['widget-type'];

                var input = html.find('[name=' + name + "]")[0];
                var cur = {
                    type: type,
                    name: name,
                    lable: _defaults.label,
                    placeholder: _attributes ? _attributes.placeholder : '',
                    singleSelect:_attributes?_attributes.multiple===undefined?true:!_attributes.multiple:true,
                    input: input ? input.outerHTML : "",
                    regexp: {
                        require: _validaterules ? _validaterules.rules.required : false,
                        test: _validaterules ? _validaterules.regexp : '',
                        msg: _validateMsg ? _validateMsg.regexp : "",
                        customMethod: _validaterules ? _validaterules.definedMethod : function() {
                            return true
                        },
                        customMethodMsg: _validateMsg ? _validateMsg.definedMethod : ''
                    },
                    sourceData: _defaults.sourceData,
                    sourceUrl: _defaults.sourceUrl,
                    events: _events,
                    customEvent: _customEvent
                };
                array.push(cur);
            };
            //非标准控件
            html.find('form').children().not('div').each(function(i, item) {
                var is = true;
                for (const key in defaultsData) {
                    if (defaultsData[key].name === $(item).attr('name')) {
                        is = false;
                    }
                }
                if (is) {
                    var cur = {
                        type: 'customType',
                        name: $(item).attr('name'),
                        input: $(item)
                    };
                    array.push(cur);
                }
            });
            return array;
        },
        setRuleData: function(url) {
            var _this = this,
                opts = this.opts;
            if (opts.ruleData.length === 0) {
                opts.ruleUrl.get({
                    data: opts.ruleParams,
                    async: false,
                    success: function(obj) {
                        opts.ruleData = obj;
                    }
                });
            }
            opts.sourceData.forEach(function(item) {
                opts.ruleData.forEach(function(ruleItem) {
                    var is = false;
                    opts.myRuleGuid.forEach(function(myguid) {
                        if (ruleItem.roleGuids.indexOf(myguid) !== -1) {
                            is = true;
                        }
                    });
                    if (ruleItem.name === item.name && is) {
                        opts.myRuleData.push(item.name);
                    }
                });

            });
        },
        getValue: function() {
            var _this = this,
                opts = this.opts;
            var retrunObj = {};
            for (var itemAttr in opts.components) {
                retrunObj[itemAttr.split('_')[1]] = opts.components[itemAttr].getValue();
            }
            return retrunObj;
        },
        ///[{'name':'UserName','value':'123'}]
        setValue: function(values) {
            var _this = this,
                opts = this.opts;
            for (var itemAttr in opts.components) {
                values.forEach(function(item) {
                    if (item.name === itemAttr.split('_')[1]) {
                        opts.components[itemAttr].setValue(item.value);
                    }
                });
            }
        },
        valid: function() {
            var _this = this,
                opts = this.opts,
                v = true;
            for (var itemAttr in opts.components) {
                if (v) {
                    opts.sourceData.forEach(function(item) {
                        if (v) {
                            if (item.name === itemAttr.split('_')[1]) {
                                //必须输入
                                if (item.regexp && item.regexp.require) {
                                    if (opts.components[itemAttr].getValue().trim() === "") {
                                        v = false;
                                        msgShowInfo(item.placeholder ? item.placeholder : item.lable + "必须输入");
                                        return;
                                    }
                                }
                                //正则验证
                                if (item.regexp && item.regexp.test) {
                                    v = new RegExp(item.regexp.test).test(opts.components[itemAttr].getValue());
                                    if (!v) {
                                        msgShowInfo(item.regexp && item.regexp.msg ? item.regexp.msg : "正则验证无提示信息");
                                        return;
                                    }
                                }
                                //自定义验证
                                if (item.regexp && item.regexp.customMethod) {
                                    var fun = typeof item.regexp.customMethod === "string" ? Function("return " + item.regexp.customMethod)() : item.regexp.customMethod;
                                    if (!fun(opts.components[itemAttr].getValue(), opts.components[itemAttr])) {
                                        v = false;
                                        msgShowInfo(item.regexp && item.regexp.customMethodMsg ? item.regexp.customMethodMsg : "自定义验证无提示信息");
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
        save: function() {
            var _this = this,
                opts = this.opts;
            var is = false;
            if (_this.valid()) {
                var params = $.extend({}, opts.saveParams, _this.getValue());
                if (opts.edit) {
                    $.extend(params, {
                        Id: opts.Id
                    });
                }
                opts.saveUrl.post({
                    data: params,
                    async: false,
                    success: function(obj) {
                        msgShowInfo('提交成功');
                        is = true;
                    }
                });
            }
            return is;
        }
    };
    $.fn.extend({
        customFrom: function(options) {
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