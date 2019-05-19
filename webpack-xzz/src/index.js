import {aa} from './util/util2';
import a from './util/util1';
import './style.css';
import Icon from './1.jpg';

import Print from './print'
var element=document.createElement('div');
var btn = document.createElement('button');
btn.innerHTML = 'Click me and check the console!';
btn.onclick = Print;
element.appendChild(btn);


console.log('util1',a)
 aa();
let div=document.createElement('div');
div.innerHTML='3333';
document.body.appendChild(div);
let img=document.createElement('img');
img.src=Icon;
document.body.appendChild(element);


[1,2,3].map(item=>{
    console.log(item)
})

