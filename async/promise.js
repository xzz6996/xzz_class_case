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
    Promise.prototype.then=function(onFufilled,onRejected){
        onFufilled=typeof onFufilled==='function'?onFufilled:function(value) {return value};
        onRejected=typeof onRejected==='function'?onRejected:function(err) {throw err}
        let promise2,_that=this;
        if(_that.state===RESOLVED){
            promise2=new Promise((resolve,reject)=>{
                try{
                  let x=onFufilled(_that.value);
                  resolvePromise(promise2,x,resolve,reject);   
                }catch(e){
                    reject(e)
                }  
            })
        }
        if(_that.state===REJECTED){
            promise2=new Promise((resolve,reject)=>{
                try{
                 let x=onRejected(_that.reason);   
                 resolvePromise(promise2,x,resolve,reject);   
                }catch(e){
                    reject(e)
                }  
            })
        }
        if(_that.state===PENDING){
            promise2=new Promise((resolve,reject)=>{
                _that.onFufilledCallBack.push(function(){
                    try{
                        let x=onFufilled(_that.value);   
                        resolvePromise(promise2,x,resolve,reject);   
                    }catch(e){
                        reject(e)
                    }
                })
                _that.onRejectedCallBack.push(function(){
                    try{
                        let x=onRejected(_that.reason);   
                        resolvePromise(promise2,x,resolve,reject);   
                    }catch(e){
                        reject(e)
                    }
                })
            })
        }
    }
}

function resolvePromise(promise2,x,resolve,reject){
    // 接受四个参数: 新的Promise、返回值，成功和失败的回调
    if(x===promise2){
        return reject(new TypeError('循环引用'));
    }
    let called = false; 
    if(x!==null&&(typeof x==='object'||typeof x==='function')){
        try{ // 是否是thenable对象（具有then方法的对象/函数）
            let then=x.then;
            if(then instanceof 'function'){ 
                then.call(x,y=>{ //用call方法修改指针为x，否则this指向window
                    //如果x是一个Promise对象，y参数表示x执行后的resolve值
                    if(called){return}
                    called=true;
                    resolvePromise(promise2,y,resolve,reject); // y可能还是一个promise，在去解析直到返回的是一个普通值
                },reason=>{
                    if (called) return
                    called = true
                    reject(reason)
                })
            }else{ //说明是一个普通的 对象/函数
                resolve(x) 
            }
        }catch(e){
            if (called) return
            called = true
            reject(e)
        }
    }else{
        resolve(x)
    }
}
/*
    第三版 结束
*/




/*
 整合版开始
*/
{
    const PENDING="pending",RESOLVED="resolved",REJECTED="rejected";
/*
我们知道，在new一个Promise的时候，Promise函数必须接受一个函数当作参数，我们暂且把这个参数函数叫做执行器，这个执行器提供2个参数(resolve，reject)，且Promise内部有状态机制(pending,resolved,rejectd)，Promise原型上有then方法。
在PromiseA+中，它是这样规定的
    1Promise对象的初始状态是pending，在被resolve或reject的时候，状态变成resolved或rejected。
    2resolve接受成功的值，rejecte接受失败或错误的值
    3Promise对象必须有一个then方法，有且接受2个参数函数(onFufilled,onRejected)
ES6
    1then必须返回一个新的Promise对象
    2为了保证then中回调的顺序，onFufilled或onRejected必须异步调用
*/
function Promise(executor){
    //良好的变成习惯 先对参数做一个容错处理
    if(typeof executor !=='function'&&executor){
        throw new Error('Promise is not a function')
    }
    let _that = this;
    _that.state=PENDING;//当前Promise的状态
    _that.ResolvedCallBacks=[];
    _that.RejectedCallBacks=[];
    _that.value=undefined;//Promise成功执行时要传递给回调的参数，默认为undefined
    _that.reason=undefined;//Promise失败执行时要传递给回调的参数，默认为undefined
    function resolve(value){ 
        if(_that.state===PENDING){
            _that.state=RESOLVED;//当调用resolve时，将Primose的状态改为resolved
            _that.value=value;//保存成功调用时传递进来的参数
            _that.ResolvedCallBacks.forEach(fn=>{
                fn();//当成功的函数被调用的时候，之前缓存的回调函数会被一一执行。
            })
        }
    }
    function reject(reason){
        if(_that.state===PENDING){
            _that.state=REJECTED;//当调用reject时，将Primose的状态改为rejected
            _that.reason=reason;//保存失败调用时传递进来的参数
            _that.RejectedCallBacks.forEach(fn=>{
                fn();//当失败的函数被回调的时候，之前缓存的函数会被一一执行。
            })
        }
    }
    try{
        executor(resolve,reject);
    }catch(e){
        reject(e)
    }
}

//then 方法有2个参数函数，分别表示当前Promise对象执行成功时候的回调onFufilled和执行失败是的回调onRejected
Promise.prototype.then=function(onFufilled,onRejected){
    onFufilled=typeof onFufilled ==='function'?onFufilled:function(value){return value};
    onRejected=typeof onRejected ==='function'?onRejected:function(reason){return onRejected}
    let _that=this,promise2;
    //每一次then时，如果是等待状态，就把回调函数push到数组里，什么时候改变状态了在执行
    if(_that.state===PENDING){
        promise2=new Promise((resolve,reject)=>{
            _that.ResolvedCallBacks.push(function(){
                try{
                  let x=onFufilled(_that.value);
                  resolvePromise(promise2,x,resolve,reject);
                }catch(e){
                  reject(e);
                }
            })
            _that.RejectedCallBacks.push(function(){
                try{
                    let x=onRejected(_that.reason)
                    resolvePromise(promise2,x,resolve,reject);   
                  }catch(e){
                    reject(e);
                  }
            })
        }) 
    }
    if(_that.state===RESOLVED){
        promise2=new Promise((resolve,reject)=>{
            try{
                let x=onFufilled(_that.value); 
                //x代表上一次then函数或Promise函数执行结果的返回值
                //这个x会被新的Promise对象 resolve，作为下一次then函数调用时的参数
                resolvePromise(promise2,x,resolve,reject);
            }catch(e){
                reject(e)
            }
        })
        onFufilled(_that.value);
    }
    if(_that.state===REJECTED){
        promise2=new Promise((resolve,reject)=>{
            try{
                let x=onRejected(_that.reason);
                resolvePromise(promise2,x,resolve,reject);
            }catch(e){
                reject(e)
            }
        })
        onRejected(_that.reason);
    }
}

/*
明确了x的值以后，接下来对onFulfilled和onRejected函数可能出现的情况做一个列举
1 上一次then返回的是一个普通的值，比如字符串数组对象啥的，直接resolve(x)
2 如果是promise，那我们想办法判断到底返回的是什么
3 上一次then返回的是自己本身这个Promise
4 可能是一个随便的值，比如 {then:"dddd"}
*/
function resolvePromise(promise2,x,resolve,reject){
    //接受4个参数，promise2，x，resolve,reject
    if(promise2===x){
        return reject(new TypeError('循环引用了'));
    }

    //x是否是一个promise
    let called=false; //x是否被调用过成功或失败
    if(x!==null&&(typeof x==='function'||typeof x==='object')){
        //可能是thenable，看它是否有then方法
        try{
            let then=x.then;
            if(typeof then ==='function'){
                then.call(x,function(value){  //用call方法修改then的this指针，否则指向window
                    if(called){return}
                    called=true;
                    resolvePromise(promise2,value,resolve,reject);
                    //y可能还是一个promise，再去让它去解析直至是一个普通值
                },function(reason){ //失败时执行的函数
                    if(called){return}
                    called=true;
                    reject(reason);
                })
            }else{  //说明x是一个普通值
                resolve(x);
            }    
        }catch(e){
            if(called){return}
            called=true;
            reject(e)
        }
    }else{ //说明x是一个普通值
        resolve(x);
    }
}
Promise.prototype.catch=function(onRejected){
    return this.then(null,onRejected)
}
}
/*
 整合版结束
*/