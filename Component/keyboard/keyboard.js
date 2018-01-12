;
(function(exports) {
    var KeyBoard = function(input, options) {
        var body = document.getElementsByTagName('body')[0];
        var DIV_ID = options && options.divId || '__w_l_h_v_c_z_e_r_o_divid';

        if (document.getElementById(DIV_ID)) {
            body.removeChild(document.getElementById(DIV_ID));
        }

        this.input = input;
        this.backValue = input.value;

        this.background = document.createElement('div');
        this.el = document.createElement('div');
        this.background.appendChild(this.el);
        var self = this;
        var length = options && options.length || 32;
        var zIndex = options && options.zIndex || 1000;
        var width = options && options.width || '100%';
        var height = options && options.height || '193px';
        var fontSize = options && options.fontSize || '15px';
        var backgroundColor = options && options.backgroundColor || '#f7f7f7';
        var TABLE_ID = options && options.table_id || 'table_0909099';
        var mobile = typeof orientation !== 'undefined';

        //  this.el.id = DIV_ID;
        this.el.style.position = 'absolute';
        this.el.style.left = "50%";
        this.el.style.top = "50%";
        this.el.style.bottom = 0;
        this.el.style.zIndex = zIndex + 1;
        this.el.style.width = width + 'px';
        this.el.style.height = height + 'px';
        this.el.style.backgroundColor = backgroundColor;
        this.el.style.padding = "5px";
        this.el.style.borderRadius = "1em";
        this.el.style.transform = "translate(-50%, -50%)";
        //样式
        var cssStr = '<style type="text/css">';
        cssStr += '#' + TABLE_ID + '{text-align:center;width:100%;}';
        cssStr += '#' + TABLE_ID + ' td{width:33%;border:none;border-right:0;border-top:0;cursor:pointer;height: 3em;font-size:1.375em}';
        cssStr += '#' + TABLE_ID + ' td:active,#' + DIV_ID + ' div.btn:active{background: rgba(78,204,196,.3);}';
        cssStr += '#' + DIV_ID + ' div.btn{color:#4eccc4;font-size: 0.7em;font-size: 1em;display:inline-block;float: right;padding: 0.5em 1em;}';
        cssStr += '#' + TABLE_ID + '_label{padding: 0.2em 0.5em;font-size: 1.8em;}';
        if (!mobile) {
            cssStr += '#' + TABLE_ID + ' td:hover' + '#' + TABLE_ID + ' div:hover{background-color:#1FB9FF;color:#FFF;}';
        }
        cssStr += '</style>';

        //背景
        //  var backStr = '<div style="width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);z-index: ' + zIndex + 'box-sizing: border-box;position: absolute;top: 0;left: 0;></div>';
        this.background.id = DIV_ID;
        this.background.style.width = "100%";
        this.background.style.height = "100%";
        this.background.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        this.background.style.zIndex = zIndex;
        this.background.style.boxSizing = "border-box";
        this.background.style.position = "absolute";
        this.background.style.top = 0;
        this.background.style.left = 0;


        //label
        var labelStr = '<div id="' + TABLE_ID + '_label">0</div>';


        //table
        var tableStr = '<table id="' + TABLE_ID + '" border="0" cellspacing="0" cellpadding="0">';
        tableStr += '<tr><td>1</td><td>2</td><td>3</td></tr>';
        tableStr += '<tr><td>4</td><td>5</td><td>6</td></tr>';
        tableStr += '<tr><td>7</td><td>8</td><td>9</td></tr>';
        tableStr += '<tr><td>.</td><td>0</td>';
        tableStr += '<td>←</td></tr>';
        tableStr += '</table>';

        tableStr += '<div style="padding:1.3em 0.2em;"><div class="btn">确定</div>';
        tableStr += '<div class="btn">取消</div></div>';

        //  this.el.innerHTML = cssStr + btnStr + tableStr;
        this.el.innerHTML = cssStr + labelStr + tableStr;

        function addEvent(e) {
            var ev = e || window.event;
            var clickEl = ev.element || ev.target;
            var value = clickEl.textContent || clickEl.innerText;
            value = value.trim();
            if (clickEl.tagName.toLocaleLowerCase() === 'td' && value !== "←") {
                if (self.input) {
                    var oldValue = self.input.value
                    if (oldValue.length >= length) { //长度限制  
                        return;
                    }
                    var newValue = 0;
                    if (value === ".") {
                        if (!/\./.test(oldValue)) {
                            newValue = oldValue + value.toString();
                        } else { //重复输入点
                            newValue = oldValue;
                        }
                    } else {
                        newValue = oldValue + value.toString();
                        if (oldValue == "0") { //开头0只允许输入0.
                            newValue = Number(newValue);
                        }
                        newValue = (isNaN(Number(newValue)) ? 0 : newValue);

                    }
                    self.input.value = newValue;
                    if (self.input.fireEvent) {
                        self.input.fireEvent('onchange');
                    } else {
                        self.input.onchange();
                    }
                }
            } else if (clickEl.tagName.toLocaleLowerCase() === 'div' && value === "确定") {
                if (self.input) {
                    self.input.value = Number(self.input.value);
                }
                setTimeout(function() {
                    body.removeChild(self.background);
                }, 350);

            } else if (clickEl.tagName.toLocaleLowerCase() === 'div' && value === "取消") {
                if (self.input) {
                    self.input.value = self.backValue;
                }
                setTimeout(function() {
                    body.removeChild(self.background);
                }, 350);
            } else if (clickEl.tagName.toLocaleLowerCase() === 'td' && value === "←") {
                var num = self.input.value;
                if (num) {
                    var newNum = num.substr(0, num.length - 1);
                    if (newNum) {
                        self.input.value = newNum;
                    } else {
                        self.input.value = 0;
                    }
                }
            }
            if (self.label) {
                self.label.innerHTML = self.input.value;
            }
        }

        if (mobile) {
            this.el.ontouchstart = addEvent;
        } else {
            this.el.onclick = addEvent;
        }
        body.appendChild(this.background);
        this.label = document.getElementById(TABLE_ID + "_label");
        if (self.label) {
            self.label.innerHTML = input.value;
        }
    }

    exports.KeyBoard = KeyBoard;

})(window);