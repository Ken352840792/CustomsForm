(function() {
    var app = {
        global: {
            debug: 1,
            remoteBaseUri: '',
            debugBaseUri: ''
        },
        deepClone: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        isObjectValueEqual: function(a, b) {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            return true;
        },
        Cookie: function(name, value, options) {
            if (typeof value != 'undefined') {
                // name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                // convert value to JSON string
                if (typeof value === 'object' && JSON.stringify) {
                    value = JSON.stringify(value);
                }
                var expires = '';
                // Set expiry
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                // CAUTION: Needed to parenthesize options.path and options.domain
                // in the following expressions, otherwise they evaluate to undefined
                // in the packed version for some reason...
                var path = options.path ? '; path=' + (options.path) : '';
                var domain = options.domain ? '; domain=' + (options.domain) : '';
                var secure = options.secure ? '; secure' : '';
                // Set the cookie name=value;expires=;path=;domain=;secure-
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else { // only name given, get cookie
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
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
    var srvFn = function(url) {
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
            befoureFn: function(xhr, data2) {
                var authorization = "Basic " + encodeURI(app.Cookie("Authorization"));
                xhr.setRequestHeader("Authorization", authorization);
                option.beforeSend ? option.beforeSend() : '';
            },
            completeFn: function() {
                option.complete ? option.complete() : '';
            },
            errorFn: function() {
                option.error ? option.error() : '';
            },
            successFn: function(json) {
                if (opts.forceSuccess) { //是否强制回调
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
        opts.type = !app.global.debug ? postType : 'get';
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
        toString: function() {
            return this.url;
        },
        post: function(option) {
            $.ajax(makeParam.call(this, 'POST', option));
        },
        get: function(option) {
            $.ajax(makeParam.call(this, 'GET', option));
        },
        del: function(option) {
            $.ajax(makeParam.call(this, 'DELETE', option));

        },
        put: function(option) {
            $.ajax(makeParam.call(this, 'PUT', option));
        }
    };
    app.basepage = function() {
        var srv = {
            add: function(uriHashSet) {
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
    }
    window.app = new app.basepage();
})();
export { app }