(function () {
    $('#aa').load('/data/formtest.html', function () {
        //合并自定义事件及标准事件
        // for (const key in customevents) {
        //     if (events.hasOwnProperty(key)) {
        //         for (const k in customevents[key]) {
        //             events[key][k] = customevents[key][k];
        //         }
        //     }
        // }
        var array = [];
        for (const key in defaults) {
            var _defaults = defaults[key],
                name = _defaults.name,
                _attributes = attributes[name],
                _validateMsg = validateMsg[name],
                _validaterules = validaterules[name],
                _events = events[name],
                _customEvent=customevents[name];
            if (!_defaults) return;
            var type;
            if(_defaults.tag==='input'){
                type=_defaults.type?_defaults.type:'text';
            }else{
                type=_defaults.tag;
            }
            var input=$('#formtest [name='+name+"]")[0];
            var cur = {
                type: type,
                name: name,
                lable: _defaults.label,
                placeholder: _attributes ? _attributes.placeholder : '',
                input:input?input.outerHTML:"",
                regexp: {
                    require: _validaterules ? _validaterules.rules.required : false,
                    test: _validaterules ? _validaterules.regexp : '',
                    msg: _validateMsg ? _validateMsg.regexp : "",
                    customMethod: _validaterules ? _validaterules.definedMethod : function () {
                        return true
                    },
                    customMethodMsg: _validateMsg ? _validateMsg.definedMethod : ''
                },
                events:  _events,
                customEvent:_customEvent
            };
            array.push(cur);
        };
        $('#formtest').html('');
       window.ff = $('#form').customFrom({
        myRuleGuid:'1111',
        sourceData:array,
        ruleUrl:"../data/ruledata.json",
        sourceUrl:"../data/datasource.json",
        saveUrl:"../data/save.json"
    });
    });
})();