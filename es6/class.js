function Math1(x,y){
    this.x=x;
    this.y=y;
}
Math1.prototype.add=function(){
    return this.x+this.y;
}
let xx=new Math1(4,6);
console.log(xx.add()); //10


class Math2{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    add(){
        return this.x+this.y;
    }
}
let yy=new Math2(6,6);
console.log(yy.add());//12

//语法糖  写法不同,但是本质相同

console.log(typeof Math1) // 'function'
console.log(typeof Math2) // 'function'

console.log(Math1.prototype.constructor===Math1); //true
console.log(xx.__proto__===Math1.prototype);       //true
console.log(Math2.prototype.constructor===Math2); //true
console.log(yy.__proto__===Math2.prototype);       //true



function Animal(){
    this.eat=function(x){
        console.log(x+"eat")
    }
}
function Dog(){
    this.jiao=function(){
        console.log('dog jiao')
    }
}
Dog.prototype=new Animal();
let hashiqi=new Dog();
hashiqi.eat('hashiqi')


class Animal1{
    constructor(x){
        this.x=x;
    }
    eat(){
        console.log(this.x+"eat")
    }
}
class Dog1 extends Animal1{
    constructor(x){
        super(x)
        this.x=x;
    }
    jiao(){
        console.log('jiao')
    }
}
let hashiqi222=new Dog1('hashiqi222');
hashiqi222.eat()