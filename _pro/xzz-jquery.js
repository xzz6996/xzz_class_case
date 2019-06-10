//jQuery如何使用原型
var jQuery=function(selector){
    return new jQuery.fn.init(selector); // 第一步找到构造函数 new jQuery.fn.init()
}
//定义构造函数
var init=jQuery.fn.init=function(selector){
    var dom=Array.prototype.slice.call(document.querySelectorAll(selector));
    var i=0,len=dom?dom.length:0;
    for(var i=0;i<len;i++){
        this[i]=dom[i];
        this.length=len;
        this.selector=selector||'';
    }
}
//初始化jQuery.fn
jQuery.fn=jQuery.prototype={
    constructor:jQuery,
    css(){

    },
    html(){

    }
};
//定义原型
init.prototype=jQuery.fn;