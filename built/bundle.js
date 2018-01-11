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

var _selfFrom = void 0;
exports._selfFrom = _selfFrom;

(function () {
    var componentMapping = {
        text: _index.Text
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
            //必须验证
            for (var itemAttr in opts.components) {
                if (v) {
                    opts.sourceData.forEach(function (item) {
                        if (v) {
                            if (item.name === itemAttr.split('_')[1]) {
                                if (item.regexp && item.regexp.require) {
                                    if (opts.components[itemAttr].getValue().trim() === "") {
                                        v = false;
                                        alert(item.placeholder ? item.placeholder : item.lable + "必须输入");
                                        return;
                                    }
                                }
                                if (item.regexp && item.regexp.test) {
                                    v = new RegExp(item.regexp.test).test(opts.components[itemAttr].getValue());
                                    if (!v) {
                                        alert(item.regexp && item.regexp.msg ? item.regexp.msg : "正则验证无提示信息");
                                        return;
                                    }
                                }
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
            // if (v) {
            //     //正则验证
            //     for (var itemAttr in opts.components) {
            //         if (v) {
            //             opts.sourceData.forEach(function (item) {
            //                 if (v) {
            //                     if (item.name === itemAttr.split('_')[1]) {
            //                         if (item.regexp && item.regexp.test) {
            //                             v = new RegExp(item.regexp.test).test(opts.components[itemAttr].getValue());
            //                             if(!v)
            //                             alert(item.regexp && item.regexp.msg ? item.regexp.msg : "正则验证无提示信息");
            //                         }
            //                     }
            //                 }
            //             });
            //         }
            //     }
            // }
            // if (v) {
            //     for (var itemAttr in opts.components) {
            //         if (v) {
            //             //自定义验证
            //             opts.sourceData.forEach(function (item) {
            //                 if (v) {
            //                     if (item.name === itemAttr.split('_')[1]) {
            //                         if (item.regexp && item.regexp.customMethod) {
            //                             var fun = typeof item.regexp.customMethod === "string" ? Function("return " + item.regexp.customMethod)() : item.regexp.customMethod;
            //                             if (!fun(opts.components[itemAttr].getValue(), opts.components[itemAttr])) {
            //                                 v = false;
            //                                 alert(item.regexp && item.regexp.customMethodMsg ? item.regexp.customMethodMsg : "自定义验证无提示信息");
            //                             };
            //                         }
            //                     }
            //                 }
            //             });
            //         };
            //     }
            // }
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
            _this.input.on('keyup', function () {
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
            if (opts.regexp && opts.regexp.require) form.content.append($('<i style ="color: red"> * </i>'));
            _this.input = $(opts.input);
            _this.input.attr('placeholder', opts.placeholder);
            form.content.append(_this.input);
            _CustomFrom._selfFrom.append(form.content);
        },
        getValue: function getValue() {
            return this.opts.value;
        },
        setValue: function setValue(val) {
            this.opts.des = val;
        },
        valid: function valid() {
            var opts = this.opts;
            if (opts.regexp && opts.regexp.test) {
                return new RegExp(opts.regexp.test).test(opts.value);
            } else {
                return true;
            }
        }
    };
    window.Text = Text;
})();
exports.Text = Text;

/***/ })
/******/ ]);