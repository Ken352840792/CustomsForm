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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._selfFrom = undefined;

var _basepage = __webpack_require__(1);

var _index = __webpack_require__(2);

var _index2 = __webpack_require__(3);

var _index3 = __webpack_require__(4);

var _index4 = __webpack_require__(5);

var _selfFrom = void 0;
exports._selfFrom = _selfFrom;

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
            ruleUrl: '',
            ruleData: [],
            myRuleData: [],
            myRuleGuid: '',
            sourceUrl: '',
            sourceData: [],
            components: {} //组件集合
        };
        exports._selfFrom = _selfFrom = _self, this._self_ = _self, this.opts = $.extend({}, defaults, options), this.server = _basepage.app.server;
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
                        var componentName = item.type + '_' + item.name;
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
                    data: {},
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
                    data: {},
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
                _this.server.saveUrl.post({
                    data: _this.getValue(),
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
            _basepage.app.basepage.server();
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
/* 1 */
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
    app.basepage = {
        server: function server(uriList) {
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
            srv.add(uriList);
            app.server = srv;
            return srv;
        }
    };
    window.app = app;
})();
exports.app = app;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Text = undefined;

var _CustomFrom = __webpack_require__(0);

(function () {
    var Text = function Text(options) {
        var defaults = {
            Form: {},
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
            _this.createComponent();
            _this.Events();
            //调用自定义事件
            if (opts.customEvent) {
                opts.customEvent.oninitialize ? opts.customEvent.oninitialize(_this.input, _this) : '';
            }
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
            _CustomFrom._selfFrom.append(form.content);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextNumber = undefined;

var _CustomFrom = __webpack_require__(0);

(function () {
    var TextNumber = function TextNumber(options) {
        var defaults = {
            Form: {},
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
            _this.createComponent();
            _this.Events();
            _this.keyboard();
            //调用自定义事件
            if (opts.customEvent) {
                opts.customEvent.oninitialize ? opts.customEvent.oninitialize(_this.input, _this) : '';
            }
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
            _CustomFrom._selfFrom.append(form.content);
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextData = undefined;

var _CustomFrom = __webpack_require__(0);

(function () {
    var TextData = function TextData(options) {
        var defaults = {
            Form: {},
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
            _this.createComponent();
            _this.Events();
            _this.mobiscroll();
            //调用自定义事件
            if (opts.customEvent) {
                opts.customEvent.oninitialize ? opts.customEvent.oninitialize(_this.input, _this) : '';
            }
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
            _CustomFrom._selfFrom.append(form.content);
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Buttons = undefined;

var _CustomFrom = __webpack_require__(0);

var _basepage = __webpack_require__(1);

(function () {
    var Buttons = function Buttons(options) {
        var defaults = {
            Form: {},
            buttons: {},
            key: "id", //唯一键
            keyName: 'name', //显示的名称
            singleSelect: true, //单选多选
            value: [] //双向数据绑定字段
        };
        this.opts = $.extend({}, defaults, options);
        this.init();
        this.server = _basepage.app.server;
        this.server.add({
            ruleUrl: options.sourceUrl
        });
        return this;
    };
    Buttons.prototype = {
        init: function init() {
            var _this = this;
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
                _this.server.ruleUrl.get({
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
                _CustomFrom._selfFrom.append(form.content);
                _CustomFrom._selfFrom.append(form.hr);
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

/***/ })
/******/ ]);