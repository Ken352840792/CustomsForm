import {
    app
} from '../../Comment/basepage';
import {
    aa
} from './Text/aa';
let _selfFrom;
export {
    _selfFrom
}
(function(){
    var componentMapping = {
        Text: aa
    };
    var customFrom = function (_self, options) {
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
        _selfFrom = _self,
            this._self_ = _self,
            this.opts = $.extend({}, defaults, options),
            this.server = app.server;
        this.server.add({
            ruleUrl: this.opts.ruleUrl,
            sourceUrl: this.opts.sourceUrl,
            saveUrl:this.opts.saveUrl
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
                    if (opts.myRuleData.indexOf(item.name) !== -1) {
                        var componentName=item.type + '_' + item.name;
                        opts.components[componentName] = new componentMapping[item.type](item);
                        //绑定事件
                        for(var e in item.events){
                            if(e in opts.components[componentName]){
                                opts.components[componentName][e]=new Function("return "+item.events[e])();
                            }else{
                                $('#dom_core_'+item.name).on(e,Function("return "+item.events[e])());
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
                    data: {},
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
                    data: {},
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
                values.forEach(function(item){
                    if(item.name===itemAttr.split('_')[1]){
                        opts.components[itemAttr].setValue(item.value);
                    }
                });
            }
        },
        valid: function () {
            var _this = this,
            opts = this.opts,v=true;
            for (var itemAttr in opts.components) {
               if(!opts.components[itemAttr].valid()){
                    v=false;
               }
            }
            return v;
        },
        save: function () {
            var _this = this,
            opts = this.opts;
            if(_this.valid()){
                _this.server.saveUrl.post({
                    data: _this.getValue(),
                    success: function (obj) {
                        alert('提交成功');
                    }
                });
            }else{
                alert('验证失败咯');
            }
        }
    };
    $.fn.extend({
        customFrom: function (options) {
            app.basepage.server();
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
