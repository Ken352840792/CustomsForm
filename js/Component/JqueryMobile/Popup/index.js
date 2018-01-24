(function () {
    //绑定一个A标签
    let Popup = function (options) {
        let defaults = {
            Form: {},
            _selfFrom: '', //A标签
            title: '你好标题', //标题
            content: '', //内容
            buttons: ['取  消','确    认'], //
            callback: function () {},
        };
        this.opts = $.extend({}, defaults, options);
        this.opts.iid = 'pup_' + parseInt(Math.random() * (1000000000 - 1 + 1) + 1, 10);;
        this.init();
        return this;
    };
    Popup.prototype = {
        init: function () {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            _this.createComponent();
        },
        open:function(){
            $('#'+this.opts.iid).popup('open');
        },
        close:function(){
            $('#'+this.opts.iid).popup('close');
        },
        //创建Component表
        createComponent: function () {
            var _this = this,
                opts = this.opts,
                form = opts.Form;
            opts._selfFrom.attr('href', "#" + opts.iid)
                .attr('data-rel', 'popup')
                .attr('data-position-to', 'window');
            form.popupBody = $('<div data-role="popup" id="' + opts.iid + '" data-overlay-theme="b"></div>');
            form.title = $('<div data-role="header"><h1>' + opts.title + '</h1></div>');
            form.close = $('<a  data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>')
            form.body = opts.content instanceof jQuery ? opts.content : opts.content;
            form.popupBody.append(form.title).append(form.close).append(form.body);

