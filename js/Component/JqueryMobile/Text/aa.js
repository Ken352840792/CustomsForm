import { _selfFrom } from "../CustomFrom";
(function(){
    let aa= function(options){
        console.log(options);
        this.opts=options;
         this.init();
         return this;
    };
    aa.prototype={
        init:function(){
            _selfFrom.append(this.opts.input);
        },
        getValue:function(){
           //_selfFrom.append("<div>123</div>");
            // app.server.add({curl:"c"});
            // console.log("我是哈哈哈哈新1你好  name");
            // app.server.add({
            //     uuuu:"uuuu"
            // });
            console.log('测试方法');
            return '我是返回值！';
        },
        setValue:function(val){
            console.log("我是设置的:"+val);
        },
       
        valid:function(){
            return true;
        }
    };
    window.aa=aa;
})();
export {aa}