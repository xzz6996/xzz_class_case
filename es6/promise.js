var src="https://www.baidu.com/img/bd_logo1.png";
function onLoadImg(src,callback,fail){
    var img=document.createElement('img');
    img.onload=function(){
        callback(img);
    }
    img.onerror=function(){
        fail();
    }
    img.src=src;
}
onLoadImg(src,function(img){
    console.log(img.width);
},function(){
    console.log('33333');
})


function loadImg(src){
    return new Promise((res,req)=>{
        let img=document.createElement('img');
        img.onload=function(){
            res(img)
        }
        img.onerror=function(){
            req()
        }
        img.src=src;
    })
}
let result=loadImg(src);
result.then(res=>{
    console.log(res.width)
})