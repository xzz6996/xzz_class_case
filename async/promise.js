let PENDING="pending",  //进行中
    RESOLVED="fulfilled",//已成功
    REJECTED="rejected"; //已失败
/*
    第一版 Promise构造函数的结构
    PromiseA+ 
    1 Promise对象的初始状态为pending,它只能变成 fulfilled/rejected
    2 resolve接受成功的值,reject接受失败的值
    3 Promise必须有一个then方法,且只接受2个函数参数 onFufilled onRejected
*/
{
    function Promise(executor){
        let _that=this;
        _that.state=PENDING;
        _that.value=null;
        _that.reason=null;
        function resolve(value){
            if(_that.state===PENDING){
                _that.state=RESOLVED;
                _that.value=value;
            }
        }
        function reject(value){
            if(_that.state===PENDING){
                _that.state=REJECTED;
                _that.value=value;
            }
        }
        executor(resolve,reject)
    }
    Promise.prototype.then=function(onFufilled,onRejected){
        let _that=this;
        if(_that.state===RESOLVED){
            onFufilled(_that.value)
        }
        if(_that.state===REJECTED){
            onRejected(_that.reason)
        }
    }
    let promise1=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('resolve')
        },2000)
    })
    promise1.then(function(data){
        console.log('onFufilled',data)
    },function(err){
        console.log('onRejected',err)
    })
}
/*
    第一版 结束 
    看起来不错,但是函数是立即执行的,不符合异步
*/

/*
    第二版 实现异步+错误处理
*/
{
    function Promise(executor){
        let _that=this;
        _that.state=PENDING;
        _that.value=null;
        _that.reason=null;
        _that.onFufilledCallBack=[];
        _that.onRejectedCallBack=[];
        function resolve(value){
            if(_that.state===PENDING){
                _that.state=RESOLVED;
                _that.value=value;
                _that.onFufilledCallBack.forEach(fn=>{
                    fn();
                })
            }
        }
        function reject(value){
            if(_that.state===PENDING){
                _that.state=REJECTED;
                _that.value=value;
                _that.onRejectedCallBack.forEach(fn=>{
                    fn();
                })
            }
        }
        try{
            executor(resolve,reject)
        }catch(e){
            reject(e)
        }
    }
    Promise.prototype.then=function(onFufilled,onRejected){
        let _that=this;
        if(_that.state===PENDING){
            _that.onFufilledCallBack.push(function(){
                onFufilled(_that.value);
            })
            _that.onRejectedCallBack.push(function(){
                onRejected(_that.reason)
            })
        }
    }
}
/*
    第二版 结束
*/

/*
    第三版 then链式调用
    ES6
        1then方法中必须返回一个新的Promise实例
        2为了保证then的顺序调用,onFufilled或onRejected必须异步调用
*/
{
    
}
