$(function() {

    app.server.add(app.global.debug ? {
        DimensionsDataSelectUrl: '/data/Server/Select.json',

        CustomFormRuleUrl: '/data/Server/GetCustomFormRoleRelation.json',
        CustomFormSourceUrl: '/data/Server/LoadFormView.json',
        CustomFormSaveUrl: '/data/Server/AddFormData.json',
        CustomFormInitData: '/data/Server/GetFormDataList.json',

        CustomTableSourceUrl: '/data/Server/GetFormDataList.json',
        CustomTableDelUrl: '/data/del.json',
        DimensionsDataButtonUrl: '/data/Server/GetFormListById.json'

    } : {
        DimensionsDataSelectUrl: apiUrl + '/FormList/Select',

        CustomFormRuleUrl: apiUrl + "/FormManager/GetCustomFormRoleRelation",
        CustomFormSourceUrl: "/FormManager/LoadFormView",
        CustomFormSaveUrl: apiUrl + "/FormManager/AddFormData",
        CustomFormInitData: apiUrl + '/FormManager/GetFormDataList',

        CustomTableSourceUrl: apiUrl + '/FormManager/GetFormDataList',
        CustomTableDelUrl: apiUrl + '/FormManager/DelFormData',
        DimensionsDataButtonUrl: apiUrl + '/FormList/GetFormListById/1',

    });
    var Business = {
        // 数据暂存
        data: {
            isTrue: true,
            form: {}
        },
        init: function() {
            var _this = this;
            data = _this.data;
            this.tableSwitch();
            this.buttonForm();
            this.boxHeight();
            this.buttonLogic();
        },
        // table 切换
        tableSwitch: function(element) {
            var _this = this,
                data = _this.data;
            $('#ul_label').on('click', 'li', function() {
                var index = $(this).index();

                $("#ul_box > div").eq(index).addClass("ul_selected").siblings().removeClass("ul_selected");
                if (index === 1 && data.isTrue) {
                    _this.customizeFrom();
                    data.isTrue = false;
                }
            });
        },
        // 设置高度
        boxHeight: function(element) {
            var height = $(window).height() - ($('.ui-content').innerHeight() - $('.ui-content').height()) - 87
            $('#form').height(height);
            $('.container').height(height);
        },
        // 自定义表单数据渲染
        customizeFrom: function() {
            var __this = this;

            var urls = app.server;
            window.page = new DataNav({
                _selfFrom: $('#customizeFrom'),
                sourceUrl: app.server.DimensionsDataSelectUrl,
                sourceParams: __this.data.form,
                completeCallback: function(opts, _this) {
                    var tabComponents = opts.tabComponents;
                    tabComponents.forEach(function(item) {
                        var data = item.data;
                        var defaultParams = {
                            'TableName': data.TableName
                        };
                        var customsSetting = {
                            myRuleGuid: app.Cookie('RoleIds') ? app.Cookie(
                                'RoleIds').split(
                                ',') : [
                                'cb33b16e-b088-4124-92d8-918fdd2a5922'
                            ],
                            ruleUrl: urls.CustomFormRuleUrl,
                            ruleParams: defaultParams,
                            sourceUrl: urls.CustomFormSourceUrl,
                            sourceParams: {
                                'formName': data.TableName
                            },
                            saveUrl: urls.CustomFormSaveUrl,
                            saveParams: defaultParams,
                            completeCallback: function(_FormOpts, _FormThis) { //每个组件加载完后
                                //填充数据
                                app.server.CustomFormInitData.get({
                                    data: {
                                        tablename: data.TableName,
                                        pagesize: 1,
                                        pageindex: 1,
                                        order: 'createTime desc'
                                    },
                                    success: function(obj) {
                                        var data = obj.data[0];
                                        var cusArr = [];
                                        if (!data) {
                                            return;
                                        }
                                        for (var key in data) {
                                            var customData = {};
                                            customData.name = key;
                                            customData.value = data[key];
                                            cusArr.push(customData);
                                        }
                                        _FormThis.setValue(cusArr);
                                    }
                                });
                            }
                        };
                        switch (data.type) {
                            case 0: //自定义单词录入
                                item.tab = item.div.customFrom(customsSetting);
                                var saveButton = $('<a class="ui-btn ui-mini ui-corner-all ui-btn-inline ui-btn-color" id="btn">确定</a>');
                                saveButton.data('model', item)
                                saveButton.click(function() {
                                    $(this).data('model').tab.save();
                                });
                                item.div.append(saveButton);
                                break;
                            case 1: //自定义多次录入
                                var table = $(
                                    '<table data-role="table" class="ui-responsive" ></table>'
                                );
                                item.div.append(table);
                                item.tab = new CustomTable({
                                    _selfFrom: table,
                                    sourceUrl: urls.CustomTableSourceUrl,
                                    sourceParams: {
                                        tablename: data.TableName,
                                        pagesize: 5,
                                        pageindex: 1,
                                        order: 'createTime desc'
                                    },
                                    delUrl: urls.CustomTableDelUrl,
                                    delParams: defaultParams,
                                    customFormSetting: customsSetting
                                })
                                break;
                        }
                    });
                    //第一个选中
                    tabComponents[0].lab.addClass('selected');
                    //加一个button
                    __this.boxHeight();
                    _this.autoHeight();
                }
            });
        },
        //button 按钮渲染
        buttonForm: function() {
            var _this = this,
                data = _this.data;
            data.DDS = new DimensionsDataSelect({
                _selfFrom: $('#form'),
                sourceUrl: app.server.DimensionsDataButtonUrl
            });
        },
        //按钮点击逻辑业务实现
        buttonLogic: function() {
            var _this = this,
                data = _this.data;
            $('#btn').click(function() {
                var newdata = data.DDS.getValue();
                if (!app.isObjectValueEqual(newdata, data.form)) {
                    data.form = newdata;
                    data.isTrue = true;
                }
                $('#ul_a').click();
            });
        }

    }

    Business.init()
})