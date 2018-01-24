/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    var app = {
        global: {
            debug: 1,
            remoteBaseUri: '',
            debugBaseUri: ''
        },
        deepClone: function deepClone(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        Cookie: function Cookie(name, value, options) {
            if (typeof value != 'undefined') {
                // name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                // convert value to JSON string
                if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && JSON.stringify) {
                    value = JSON.stringify(value);
                }
                var expires = '';
                // Set expiry
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                // CAUTION: Needed to parenthesize options.path and options.domain
                // in the following expressions, otherwise they evaluate to undefined
                // in the packed version for some reason...
                var path = options.path ? '; path=' + options.path : '';
                var domain = options.domain ? '; domain=' + options.domain : '';
                var secure = options.secure ? '; secure' : '';
                // Set the cookie name=value;expires=;path=;domain=;secure-
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else {
                // only name given, get cookie
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == name + '=') {
                            // Get the cookie value
                            try {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            } catch (e) {
                                cookieValue = cookie.substring(name.length + 1);
                            }
                            break;
                        }
                    }
                }
                // Parse JSON from the cookie into an object
                if (jQuery.evalJSON && cookieValue && cookieValue.match(/^\s*\{/)) {
                    try {
                        cookieValue = jQuery.evalJSON(cookieValue);
                    } catch (e) {}
                }
                return cookieValue;
            }
        }
    };
    var srvFn = function srvFn(url) {
        //this.url = url.replace(/^['/']/, '');
        if (!app.global.debug) {
            this.url = app.global.remoteBaseUri + url;
        } else {
            this.url = app.global.debugBaseUri + url;
        }
    };
    function makeParam(postType, option) {
        var opts = app.deepClone(option);
        var optionDefault = {
            befoureFn: function befoureFn(xhr, data2) {
                var authorization = "Basic " + encodeURI(app.Cookie("Authorization"));
                xhr.setRequestHeader("Authorization", authorization);
                option.beforeSend ? option.beforeSend() : '';
            },
            completeFn: function completeFn() {
                option.complete ? option.complete() : '';
            },
            errorFn: function errorFn() {
                option.error ? option.error() : '';
            },
            successFn: function successFn(json) {
                if (opts.forceSuccess) {
                    //是否强制回调
                    option.success ? option.success(json) : '';
                } else {
                    if (json.Status) {
                        option.success ? option.success(json.Data) : '';
                    } else {
                        msgShowInfo(json.Message ? json.Message : getLan(json.ErrorCode));
                    }
                }
            }
        };
        opts.url = option.url ? option.url : this.url;
        opts.beforeSend = optionDefault.befoureFn;
        opts.type = postType;
        opts.complete = optionDefault.completeFn;
        opts.success = optionDefault.successFn;
        opts.error = optionDefault.errorFn;
        opts.dataType = option.dataType ? option.dataType : 'json';

        if (postType == "DELETE" || postType == 'PUT') {

            //临时解决
            opts.url += "?";
            opts.contentType = option.contentType ? option.contentType : 'application/json';
            for (var a in option.data) {
                opts.url += a + '=' + option.data[a] + "&";
            }
            opts.url = opts.url.substring(0, opts.url.length - 1);
            //opts.data = JSON.stringify(option.data);
        }
        return opts;
    }

    srvFn.prototype = {
        toString: function toString() {
            return this.url;
        },
        post: function post(option) {
            $.ajax(makeParam.call(this, 'POST', option));
        },
        get: function get(option) {
            $.ajax(makeParam.call(this, 'GET', option));
        },
        del: function del(option) {
            $.ajax(makeParam.call(this, 'DELETE', option));
        },
        put: function put(option) {
            $.ajax(makeParam.call(this, 'PUT', option));
        }
    };
    app.basepage = function () {
        var srv = {
            add: function add(uriHashSet) {
                var key;
                for (key in uriHashSet) {
                    if (uriHashSet[key]) {
                        this[key] = new srvFn(uriHashSet[key]);
                    }
                }
            }
        };
        app.server = srv;
        return app;
    };
    window.app = new app.basepage();
})();
exports.app = app;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
(function () {
    //绑定一个A标签
    var Popup = function Popup(options) {
        var defaults = {
            Form: {},
            _selfFrom: '', //A标签
            title: '你好标题', //标题
            content: '', //内容
            buttons: ['取  消', '确    认'], //
            callback: function callback() {}
        };
        this.opts = $.extend({}, defaults, options);
        this.opts.iid = 'pup_' + parseInt(Math.random() * (1000000000 - 1 + 1) + 1, 10);;
        this.init();
        return this;
    };
    Popup.prototype = {
        init: function init() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            _this.createComponent();
        },
        open: function open() {
            $('#' + this.opts.iid).popup('open');
        },
        close: function close() {
            $('#' + this.opts.iid).popup('close');
        },
        //创建Component表
        createComponent: function createComponent() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            opts._selfFrom.attr('href', "#" + opts.iid).attr('data-rel', 'popup').attr('data-position-to', 'window');
            form.popupBody = $('<div data-role="popup" id="' + opts.iid + '" data-overlay-theme="b"></div>');
            form.title = $('<div data-role="header"><h1>' + opts.title + '</h1></div>');
            form.close = $('<a  data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>');
            form.body = opts.content instanceof jQuery ? opts.content : opts.content;
            form.popupBody.append(form.title).append(form.close).append(form.body);

            var group = $(' <div data-role="footer"></div>');
            var h1 = $('<h1></h1>');

            opts.buttons.forEach(function (item, index) {
                var but = $('<span class="ui-table-columntoggle-btn ui-btn ui-btn-a ui-corner-all ui-shadow ui-mini">' + item + '</span>');
                but.data('index', index);
                but.click(function () {
                    opts.callback($(this).data('index'));
                });
                h1.append(but);
            });
            form.popupBody.append(group.append(h1));
            opts._selfFrom.after(form.popupBody);
            $('body').trigger('create');
        },
        getValue: function getValue() {
            return undefined;
        },
        setValue: function setValue(arr) {
            return undefined;
        }
    };
    window.Popup = Popup;
})();
exports.Popup = Popup;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _basepage = __webpack_require__(0);

var _index = __webpack_require__(3);

var _index2 = __webpack_require__(4);

var _index3 = __webpack_require__(5);

var _index4 = __webpack_require__(6);

var _index5 = __webpack_require__(7);

var _index6 = __webpack_require__(1);

(function () {
    var componentMapping = {
        text: _index.Text,
        number: _index2.TextNumber,
        data: _index3.TextData,
        button: _index4.Buttons
    };
    var _customFrom = function _customFrom(_self, options) {
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
            completeCallback: function completeCallback() {},
            components: {} //组件集合
        };
        this._self_ = _self, this.opts = $.extend({}, defaults, options), this.server = _basepage.app.server;
        if (this.opts.sourceData.length === 0 && !this.opts.sourceUrl) return;
        this.server.add({
            ruleUrl: this.opts.ruleUrl,
            sourceUrl: this.opts.sourceUrl,
            saveUrl: this.opts.saveUrl
        });
        this.init();
    };
    _customFrom.prototype = {
        init: function init() {
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
        setSourceData: function setSourceData(callback) {
            var _this = this,
                opts = this.opts;
            if (opts.sourceData.length === 0) {
                _this.server.sourceUrl.get({
                    data: opts.sourceParams,
                    success: function success(obj) {
                        opts.sourceData = obj;
                        callback();
                    }
                });
            } else {
                callback();
            }
        },
        setRuleData: function setRuleData(url) {
            var _this = this,
                opts = this.opts;
            if (opts.ruleData.length === 0) {
                _this.server.ruleUrl.get({
                    data: opts.ruleParams,
                    async: false,
                    success: function success(obj) {
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
        getValue: function getValue() {
            var _this = this,
                opts = this.opts;
            var retrunObj = {};
            for (var itemAttr in opts.components) {
                retrunObj[itemAttr.split('_')[1]] = opts.components[itemAttr].getValue();
            }
            return retrunObj;
        },
        ///[{'name':'UserName','value':'123'}]
        setValue: function setValue(values) {
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
        valid: function valid() {
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
        save: function save() {
            var _this = this,
                opts = this.opts;
            if (_this.valid()) {
                var params = $.extend({}, opts.saveParams, _this.getValue());
                _this.server.saveUrl.post({
                    data: params,
                    success: function success(obj) {
                        alert('提交成功');
                    }
                });
            } else {
                alert('验证失败咯');
            }
        }
    };
    $.fn.extend({
        customFrom: function customFrom(options) {
            if (typeof options === 'string') {
                var data = $(this).data('customFrom');
                data[options].apply(data, Array.prototype.slice.call(arguments, 1));
            } else {
                var modal = new _customFrom($(this), options);
                $(this).data('customFrom', modal);
                return modal;
            }
        }
    });
})();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
(function () {
    var Text = function Text(options) {
        var defaults = {
            Form: {},
            initCallback: function initCallback() {}, //加载前
            completeCallback: function completeCallback() {}, //加载完成后
            value: "" //双向数据绑定字段
        };
        this.opts = $.extend({}, defaults, options);
        this.init();
        return this;
    };
    Text.prototype = {
        init: function init() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            opts.initCallback(this.opts);
            _this.createComponent();
            _this.Events();
            //调用自定义事件
            if (opts.customEvent) {
                opts.customEvent.oninitialize ? opts.customEvent.oninitialize(_this.input, _this) : '';
            }
            opts.completeCallback(opts, _this);
        },
        Events: function Events() {
            var _this = this,
                opts = this.opts;
            Object.defineProperty(opts, 'des', {
                get: function get() {
                    //获取数据
                    return this.value;
                },
                set: function set(val) {
                    //设置值
                    _this.input.val(val);
                    this.value = val;
                }
            });
            _this.input.on('change', function () {
                opts.des = this.value;
            });
        },
        //创建Component表
        createComponent: function createComponent() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.content = $('<div class = "ui-field-contain"></div>');
            form.lable = $('<label for="fname">' + opts.lable + '</label>');
            form.content.append(form.lable);
            //必选lable上给星号
            if (opts.regexp && opts.regexp.require) form.lable.append($('<i style ="color: red"> * </i>'));
            _this.input = $(opts.input);
            _this.input.attr('placeholder', opts.placeholder);
            form.content.append(_this.input);
            opts._selfFrom.append(form.content);
            _this.input.textinput();
        },
        getValue: function getValue() {
            return this.opts.value;
        },
        setValue: function setValue(arr) {
            this.opts.des = arr;
        }
    };
    window.Text = Text;
})();
exports.Text = Text;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
(function () {
    var TextNumber = function TextNumber(options) {
        var defaults = {
            Form: {},
            initCallback: function initCallback() {}, //加载前
            completeCallback: function completeCallback() {}, //加载完成后
            value: "" //双向数据绑定字段
        };
        this.opts = $.extend({}, defaults, options);
        this.init();
        return this;
    };
    TextNumber.prototype = {
        init: function init() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            opts.initCallback(this.opts);
            _this.createComponent();
            _this.Events();
            _this.keyboard();
            opts.completeCallback();
        },
        Events: function Events() {
            var _this = this,
                opts = this.opts;
            Object.defineProperty(opts, 'des', {
                get: function get() {
                    //获取数据
                    return this.value;
                },
                set: function set(val) {
                    //设置值
                    _this.input.val(val);
                    this.value = val;
                }
            });
            _this.input[0].onchange = function () {
                opts.des = this.value;
            };
        },
        //创建Component表
        createComponent: function createComponent() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.content = $('<div class = "ui-field-contain"></div>');
            form.lable = $('<label for="fname">' + opts.lable + '</label>');
            form.content.append(form.lable);
            //必选lable上给星号
            if (opts.regexp && opts.regexp.require) form.lable.append($('<i style ="color: red"> * </i>'));
            _this.input = $(opts.input);
            _this.input.attr('placeholder', opts.placeholder);
            form.content.append(_this.input);
            _this.input.textinput();
            opts._selfFrom.append(form.content);
        },
        // 插件 初始化
        keyboard: function keyboard() {
            var _this = this;
            _this.input.focus(function () {
                new KeyBoard(this, {
                    zIndex: 7000,
                    width: 274,
                    height: 375,
                    fontSize: "1.375em",
                    length: 1000
                });
            });
        },
        getValue: function getValue() {
            return this.opts.value;
        },
        setValue: function setValue(val) {
            this.opts.des = val;
        }
    };
    window.TextNumber = TextNumber;
})();
exports.TextNumber = TextNumber;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
(function () {
    var TextData = function TextData(options) {
        var defaults = {
            Form: {},
            _selfFrom: '', //要添加到的位置
            initCallback: function initCallback() {}, //加载前
            completeCallback: function completeCallback() {}, //加载完成后
            value: "" //双向数据绑定字段

        };
        this.opts = $.extend({}, defaults, options);
        this.init();
        return this;
    };
    TextData.prototype = {
        init: function init() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            opts.initCallback(this.opts);
            _this.createComponent();
            _this.Events();
            _this.mobiscroll();
            opts.completeCallback();
        },
        Events: function Events() {
            var _this = this,
                opts = this.opts;
            Object.defineProperty(opts, 'des', {
                get: function get() {
                    //获取数据
                    return this.value;
                },
                set: function set(val) {
                    //设置值
                    _this.input.val(val);
                    this.value = val;
                }
            });
            _this.input[0].onchange = function () {
                opts.des = this.value;
            };
        },
        //创建Component表
        createComponent: function createComponent() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.content = $('<div class = "ui-field-contain"></div>');
            form.lable = $('<label for="fname">' + opts.lable + '</label>');
            form.content.append(form.lable);
            //必选lable上给星号
            if (opts.regexp && opts.regexp.require) form.lable.append($('<i style ="color: red"> * </i>'));
            _this.input = $(opts.input);
            _this.input.attr('placeholder', opts.placeholder);
            form.content.append(_this.input);
            _this.input.textinput();
            opts._selfFrom.append(form.content);
        },
        // 插件 初始化
        mobiscroll: function (_mobiscroll) {
            function mobiscroll() {
                return _mobiscroll.apply(this, arguments);
            }

            mobiscroll.toString = function () {
                return _mobiscroll.toString();
            };

            return mobiscroll;
        }(function () {
            var _this = this;
            var currYear = new Date().getFullYear();
            mobiscroll.date(_this.input, {
                lang: "zh",
                theme: 'android-holo-light',
                display: 'center',
                layout: 'fixed',
                startYear: currYear - 10,
                endYear: currYear + 10,
                dateFormat: "yy-mm-dd",
                onInit: function onInit(event, inst) {
                    var setBtn = inst.buttons.set;
                    var setCancel = inst.buttons.cancel;
                    inst.buttons.set = setCancel;
                    inst.buttons.cancel = setBtn;
                }
            });
        }),
        getValue: function getValue() {
            return this.opts.value;
        },
        setValue: function setValue(val) {
            this.opts.des = val;
        }
    };
    window.TextData = TextData;
})();
exports.TextData = TextData;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Buttons = undefined;

var _basepage = __webpack_require__(0);

(function () {
    var Buttons = function Buttons(options) {
        var defaults = {
            Form: {},
            buttons: {},
            key: "id", //唯一键
            keyName: 'name', //显示的名称
            singleSelect: true, //单选多选
            initCallback: function initCallback() {}, //加载前
            completeCallback: function completeCallback() {}, //加载完成后
            value: [] //双向数据绑定字段
        };
        this.opts = $.extend({}, defaults, options);
        this.server = _basepage.app.server;
        this.server.add({
            ButtonsSourceUrl: options.sourceUrl
        });
        this.init();
        return this;
    };
    Buttons.prototype = {
        init: function init() {
            var _this = this;
            _this.opts.initCallback(this.opts);
            _this.createComponent();
            _this.Events();
            _this.behavior();
        },
        // 双向数据绑定
        Events: function Events() {
            var _this = this,
                opts = this.opts,
                arrData = opts.sourceData.data;
            Object.defineProperty(opts, 'des', {
                get: function get() {
                    //获取数据
                    return this.value;
                },
                set: function set(arr) {
                    //设置值
                    for (var a in opts.buttons) {
                        opts.buttons[a].removeClass('ui-btn-active');
                    }
                    opts.sourceData.data.forEach(function (item) {
                        item.isTrue = false;
                    });
                    arr.forEach(function (it) {
                        opts.sourceData.data.forEach(function (item) {
                            if (item[opts.key] === it) {
                                item.isTrue = true;
                            }
                        });

                        opts.buttons[it].addClass('ui-btn-active');
                    });
                    this.value = arr;
                }
            });
        },
        getValue: function getValue() {
            if (this.opts.singleSelect) {
                return this.opts.value[0];
            } else {

                return this.opts.value;
            }
        },
        setValue: function setValue(arr) {
            this.opts.des = arr;
        },
        // 创建菜单
        createComponent: function createComponent() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            form.content = $('<div id="OperatorWorkShopContentId" class="overflow-auto clearfix">');
            form.lable = $(' <div class="grid-div-label">' + opts.lable + '</div>');
            form.content.append(form.lable);
            var Data = opts.sourceData.data ? opts.sourceData.data : null;
            if (Data) {
                Component(Data);
            } else {
                _this.server.ButtonsSourceUrl.get({
                    data: {},
                    async: false,
                    success: function success(data) {
                        Data == data.sourceData.data;
                        Component(Data);
                    }
                });
            }
            // 按钮部分的数据渲染
            function Component(data) {
                opts.buttons = [];
                var arr = data;
                form.Now = $('<div class="grid-div-content" data-childunitype="1" data-child="#select_line_Now" ref-open="false"></div>');
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var value = _step.value;

                        form.a = $('<a class="ui-btn ui-mini ui-corner-all ui-btn-inline" >' + value[opts.keyName] + '</a>');
                        form.a.data('model', value);
                        form.Now.append(form.a);
                        opts.buttons[value[opts.key]] = form.a;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                form.tool = $('<div class="grid-div-tool"></div>');
                form.arrow = $('<a href="#"  class="ui-btn  ui-btn-icon-notext ui-icon-carat-d ui-corner-all"></a>');
                form.tool.append(form.arrow);
                form.content.append(form.Now);
                form.hr = $('<hr class="hr-line">');
                form.content.append(form.tool);
                opts._selfFrom.append(form.content);
                opts._selfFrom.append(form.hr);
                setTimeout(function () {
                    opts.completeCallback(opts, _this);
                }, 5000);
            }
        },
        // 按钮的行为变化
        behavior: function behavior() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            // 实现按钮的展开或者关闭
            form.arrow.on('click', function () {
                _this.CollapseClick();
            });
            this.Multiple(opts.sourceData.data);
        },

        // 展开关闭操作
        CollapseClick: function CollapseClick() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            var div = $(form.arrow).parent().prev(".grid-div-content");
            var isOpen = div.attr("ref-open");
            if (isOpen == "false") {
                $(form.arrow).removeClass("ui-icon-carat-d").addClass("ui-icon-carat-u");
                div.attr("ref-open", "true").css("height", "auto");
            } else {
                div.attr("ref-open", "false");
                $(form.arrow).removeClass("ui-icon-carat-u").addClass("ui-icon-carat-d");
                div.css("overflow", "hidden").css("height", "48px");
            }
        },
        // 按钮单多选操作
        Multiple: function Multiple(data) {
            var _this = this,
                opts = this.opts,
                arr = data;
            opts.Form.Now.delegate('a', 'click', function (ev) {
                if (opts.singleSelect) {
                    arr.forEach(function (item) {
                        item.isTrue = false;
                    });
                }
                var model = $(this).data('model');
                var arrData = [];
                arr.forEach(function (item) {
                    if (model === item) {
                        item.isTrue = !item.isTrue;
                    }
                });
                arr.forEach(function (item) {
                    if (item.isTrue) {
                        arrData.push(item[opts.key]);
                    }
                });

                // 点击的时候如果有回调函数执行回调函数
                var callback = model.callback ? model.callback : null;
                if (callback && model.isTrue) {
                    callback();
                }
                opts.des = arrData;
            });
        }
    };
    window.Buttons = Buttons;
})();
exports.Buttons = Buttons;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CustomTable = undefined;

var _basepage = __webpack_require__(0);

var _index = __webpack_require__(1);

(function () {
    //数据格式为 {'total':1000,data:[{}]
    var CustomTable = function CustomTable(options) {

        var defaults = {
            initCallback: function initCallback() {}, //加载前
            completeCallback: function completeCallback() {}, //加载完成后
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
                    hander: function hander() {}
                },
                Del: {
                    state: true,
                    hander: function hander() {}
                }
            }
        };
        this.server = _basepage.app.server;

        this.opts = $.extend({}, defaults, options);
        this.server.add({
            CustomSourceUrl: this.opts.sourceUrl,
            delUrl: this.opts.delUrl,
            saveUrl: this.opts.saveUrl
        });
        this.opts.initCallback(this.opts);
        this.init();
        return this;
    };
    CustomTable.prototype = {
        init: function init() {
            var _this = this,
                opts = this.opts;
            _this.createDataSource(1);
        },
        Events: function Events() {
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
            opts._selfFrom.off('click', "tBody input:checkbox").on('click', "tBody input:checkbox", function () {
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
            form.tBody.on('click', 'a', function () {
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
                            form.DelPopup = new _index.Popup({
                                _selfFrom: ele_this,
                                title: '删除提示',
                                content: $('<div style="margin: 15px;width:200px;height:100px;text-align: center;line-height: 100px;">确认要删除吗？</div>'),
                                callback: function callback(index) {
                                    if (index === 1) {
                                        var params = $.extend({}, opts.delParams, {
                                            'delItem': model.Id
                                        });
                                        _this.server.delUrl.del({
                                            data: params,
                                            success: function success() {
                                                alert('删除成功');
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
        ConvertModelToArray: function ConvertModelToArray(model) {
            var array = [];
            for (var key in model) {
                array.push({
                    'name': key,
                    'value': model[key]
                });
            }
            return array;
        },
        createDataSource: function createDataSource(pageIndex) {
            var _this = this,
                opts = this.opts;

            if (!opts.sources) {
                var params = $.extend({}, {
                    pageIndex: pageIndex,
                    pageSize: opts.pageSize
                }, opts.sourceParams);
                _this.server.CustomSourceUrl.get({
                    data: params,
                    success: function success(obj) {
                        //head也需要处理
                        if (obj instanceof Array) {
                            if (obj.length > 0) {
                                for (var key in obj[0]) {
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
                        opts.sources.forEach(function (item) {
                            item.c = false;
                        });
                        //清除所有不包括自己的所有元素
                        //opts._selfFrom.siblings().remove();
                        _this.createComponent();
                        _this.createPaging(pageIndex, Math.ceil(opts.sourcesCount / opts.pageSize), opts.sourcesCount);
                    }
                });
            } else {
                _this.createComponent();
            }
        },
        //创建Component表
        createComponent: function createComponent() {
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
        createCustomForm: function createCustomForm() {
            var _this = this,
                opts = this.opts;
            opts.customFormObj = opts.Form.AddPopup.opts.Form.body.customFrom(opts.customFormSetting);
        },
        createTable: function createTable() {
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

                opts.headSource.forEach(function (item, index) {
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
                opts.sources.forEach(function (item) {
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
            opts._selfFrom.append(form.thead).append(form.tBody).trigger("create");
        },
        createPaging: function createPaging(pageNo, totalPage, totalSize) {
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
                        callback: function callback(num) {

                            opts.sources = undefined;
                            _this.createDataSource(num);
                        }
                    });
                }
            }
        },
        Add: function Add() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            var add = opts.Events.Add;
            if (add.state) {
                //渲染添加
                form.Add = $('<a style="float: right;" class="ui-table-columntoggle-btn ui-btn ui-btn-a ui-corner-all ui-shadow ui-mini">新 增</a>');
                //新增按钮
                form.Add.click(function () {
                    if (opts.sources.length > 0) {
                        var mo = opts.sources[0];
                        var cur = {};
                        for (var key in mo) {
                            cur[key] = "";
                        }
                        form.AddPopup.opts.Form.title.find('h1').text('新 增');
                        opts.customFormObj.setValue(_this.ConvertModelToArray(cur));
                    }
                    form.AddPopup.open();
                });
                opts._selfFrom.before(form.Add);
                form.AddPopup = new _index.Popup({
                    _selfFrom: form.Add,
                    title: '新增',
                    content: $('<div style="margin: 15px;"></div>'),
                    callback: function callback(index) {
                        if (index === 1) {

                            console.log(opts.customFormObj.save());
                        } else {
                            form.AddPopup.close();
                        }
                    }
                });
            }
        },
        Del: function Del() {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            var Del = opts.Events.Del;
            if (Del.state) {
                //渲染添加
                form.Del = $('<span style="float: right;" class="ui-table-columntoggle-btn ui-btn ui-btn-a ui-corner-all ui-shadow ui-mini">删 除</span>');
                form.Del.click(function () {
                    var check = opts.sources.filter(function (item) {
                        return item.c;
                    });
                    if (check.length > 0) {
                        var checkStr = [];
                        check.forEach(function (item) {
                            checkStr.push(item.Id);
                        });
                        var params = $.extend({}, opts.delParams, {
                            'Id': checkStr
                        });
                        _this.server.delUrl.del({
                            data: params,
                            success: function success() {
                                alert('删除成功');
                            }
                        });
                    } else {
                        alert('请选择删除的项');
                    }
                });
                opts._selfFrom.before(form.Del);
            }
        },
        getValue: function getValue() {
            return;
        },
        setValue: function setValue(arr) {
            return;
        }
    };
    window.CustomTable = CustomTable;
})();
exports.CustomTable = CustomTable;

/***/ })
/******/ ]);