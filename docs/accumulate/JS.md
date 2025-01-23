## **lodash**

- 遍历 array、object 和 string
- 对值进行操作和检测
- 创建符合功能的函数

***

## **reduce**

```javascript
array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
```

**function**为累计器函数，对数组的每个元素求值并累加到**total**上

- **total**为初始值或计算结束的返回值
- **initialValue**为传递给函数的初始值

***

## **JSON.stringify(value, replacer, space)将对象或数组转化为字符串**

- **value**为要转换的对象或数组
- **replacer**用于对成员进行处理
- **space**可以缩进换行等

***

## **事件循环机制**

同步任务先在主线程中执行，执行完毕后会到任务队列读取异步任务到主线程中执行。

异步任务进入Event Table并**注册回调函数**，当异步任务完成时，Event Table会将回调函数移入任务队列（Event Queue），**宏任务、微任务皆为异步任务**

宏任务 (macro)task 主要包含：script( 整体代码)、setTimeout、setInterval、I/O、UI 交互事件、setImmediate(Node.js 环境)

微任务 microtask主要包含：Promise、MutaionObserver、process.nextTick(Node.js 环境)

每一个任务的执行，无论是macro-task还是micro-task，都是借助函数调用栈来完成。

***

## **执行上下文**

***

## **函数调用栈**

***

## **Promise**引用类型

主要两大用途：通过状态的切换抽象地表示一个异步操作；生成解决值和拒绝理由

- new实例时要传入一个执行器函数
- 执行器函数作为期约的初始化程序是同步执行的，所以一般是将promise装在一个函数中，在需要时运行这个函数，执行器函数的参数为resolve（**Promise的状态为fullfiled的回调函数**）和reject（**Promise的状态为rejected的回调函数**）
- 通过then，在异步操作执行完后，用链式调用的方式执行回调函数
- then方法可以接收两个参数，第一个onResolved处理程序，第二个onRejected处理程序，返回一个新的期约实例（通过Promise.resolve()包装onResolved处理程序的返回值）
- catch用来指定reject的回调，也可以捕获执行resolve的回调时产生的异常
- all方法在所有异步操作执行完后才执行回调，接受一个promise对象数组
- race方法
- map方法

```js
if (!Promise.map) {
    Promise.map = function (vals, cb) {
        return Promise.all(
            vals.map(val => new Promise(resolve => {
                cb(val, resolve)
            }))
        )
    }
}
let p1 = Promise.resolve(21), 
    p2 = Promise.resolve(42), 
    p3 = Promise.reject('oops')
Promise.map([p1, p2, p3], function (pr, done) {
    Promise.resolve(pr).then(
        function (v) {
            done(v * 2)
        },
        done
    )
}).then(vals => {
    console.log(vals)
})
```



## **异步函数**

***

## **Google 布尔搜索**

- +匹配包含关键字
- And 完全匹配关键字
- Or 匹配任意一个关键字的词
- -排除关键字

**站内搜索**  site:{站点}

**标题匹配**  intitle:{标题名}

**精确查找**   “关键字”

**组合搜索**    +

**限定格式**   filetype:{format}

**时间段搜索**  年份..年份

**模糊匹配**    *

***

## 	**localStorage、sessionStorage、cookie、session**



|                | 存储大小 | 存储类型 | 存储位置 | 生存期                         | 支持跨域访问 |
| -------------- | -------- | -------- | -------- | ------------------------------ | ------------ |
| localStorage   | 5M       | string   | 客户端   | 永久存储                       |              |
| cookie         | 4K       | string   | 客户端   | 在设置的cookie过期时间之前     |              |
| session        | 无限制   | object   | 服务端   | 配置的过期事件                 |              |
| sessionStorage | 5M       | sting    | 客户端   | 会话结束，同源浏览器窗口关闭前 |              |

cookie机制：如果不在浏览器中设置过期事件，cookie被保存在内存中，生命周期随浏览器的关闭而结束，这种cookie简称为会话cookie。如果在浏览器中设置了cookie的过期事件，cookie会被保存在硬盘中，关闭浏览器后，cookie数据仍然存在，直到过期事件结束才消失。

***

## **cnosole.log( String 或 Object )**

**JSON.parse(JSON.stringify(obj))**

***

## **“+”   字符串转number**

***

## **JS代码简化**

```javascript
//数组 includes
//longhand
if (x === 'abc' || x === 'def' || x === 'ghi' || x ==='jkl') {
    //logic
}
//shorthand
if (['abc', 'def', 'ghi', 'jkl'].includes(x)) {
   //logic
}

检查是否是 null or undefiend 
// Longhand
if (test1 !== null || test1 !== undefined || test1 !== '') {
    let test2 = test1;
}
// Shorthand
let test2 = test1 || '';

?? 操作符 
如果左边值为 null 或 undefined，就返回右边的值。默认情况下，它将返回左边的值。

const test= null ?? 'default';
console.log(test);
// 输出结果: "default"
const test1 = 0 ?? 2;
console.log(test1);
// 输出结果: 0

 && 操作符
 
 for in 和 for of
 
 简化switch 
 
// Longhand
switch (data) {
  case 1:
    test1();
  break;
  case 2:
    test2();
  break;
  case 3:
    test();
  break;
  // ...
}
// Shorthand
var data = {
  1: test1,
  2: test2,
  3: test
};
data[something] && data[something]();

arrow func 隐式返回

+ == parseInt or parseFloat

Object.entries()   object = > object array


```

***

**匿名函数与词法作用域**（静态作用域）

**作用域**：程序中定义变量的区域，用于查找变量，即确定当前执行的代码对变量的访问权限

- 词法意味着只需要查看代码结构就可以确定变量作用域，而不是等到代码执行时才明白
- 在词法作用域中，**重要的是函数是在什么地方定义的**，而不是在上面地方使用的
- 箭头函数中若用了this则这个this指向包裹箭头函数的第一个普通函数的this

```javascript
function Foo (car) {
    this.bar = function () 
    {

        this.bar = () => 
        {
            console.log(this)
        }

        Foo.bar = () => 
        {
            console.log(this);
        }

    }

    this.car = car;
}

const m = new Foo(3);
m.bar();
m.bar();  //{"car":3}

Foo(45);   //不使用new直接把构造函数当普通函数调用将this指向global对象
console.log(this.car)   //45
Foo.bar();  //{"car":3}
```

**动态改变词法作用域**

- eval 接收一个字符串参数，并像代码一样执行
- with 利用传入的对象开辟一个新的作用域，并且将对象上的属性作为当前作用域内的变量

***

## **函数式编程**

- 只使用表达式，不使用语句
- 纯函数：对于相同的输入，总会得到相同的输出，不依赖于外部环境的状态
- 不改变变量
- 高阶函数：接受一个或多个函数输入，输出一个函数
- react 中的高阶组件：接受一个组件为参数并返回一个组件

***

## **XML & JSON**

XML（e**X**tensible **M**arkup **L**anguage）可扩展标记语言，很像HTML，标记语言

JSON存储交换文本信息

***

## **异步**

异步场景

- 定时器
- 网络请求
- 事件监听

异步方法：

- 回调函数
- Promise
- generator
- async/await

***

## **函数调用**

- 函数调用 （this指向window）
- 方法调用  （this指向调用它的对象）
- 构造器调用  （this指向实例对象）
- 间接调用（call，apply）

箭头函数中的this不能改变指向，始终指向定义处外部函数指向

***

## **惰性求值**

```javascript
const Lazy = iterator => {
    // 将iterator的next方法给next变量
    const next = iterator.next.bind(iterator)

    // map 输入一个函数，返回一个对象对象
    const map =  f => {

        const modifiedNext = () => {
            const item = next();
            console.log('map');
            const mappedValue = f(item.value);
            return {
                value: mappedValue,
                done: item.done
            }
        }

        const newIter = { ...iterator, next: modifiedNext };
        return Lazy(newIter)
    }

    const filter =  predicate => {
        
        //
        const modifiedNext = () => {
            while (true) {
                const item = next()
                console.log('filter');
                if (predicate(item.value)) {
                    return item
                }
            }
        }

        const newIter = { ...iterator, next: modifiedNext }
        return Lazy(newIter)
    }

    const takeWhile = predicate => {
        const result = []
        let value = next().value
        while (predicate(value)) {
            console.log('takewhile')
            result.push(value)
            value = next().value
        }
        return result
    }
 
    return {
        next,
        map,
        filter,
        takeWhile
    }
}

const numbers = function*() {
 let i = 1
 while (true) {
 yield i++
 }
}

let i = Lazy(numbers())
.map(x => x ** 2)
.filter(x => x > 0)
.takeWhile(x => x < 100)
console.log(i)
//  
//  .reduce((x, y) => x + y)
```

```javascript
const range = function* (from, to) {
    console.log('range')
  for(let i = from; i < to; i++) {
    console.log('range\t', i);
    yield i;
  }
}

const map = function* (flow, transform) {
  for(const data of flow) {
    console.log('map\t', data);
    yield(transform(data));
  }
}

const filter = function* (flow, condition) {
  for(const data of flow) {
    console.log('filter\t', data);
    if (condition(data)) {
      yield data;
    }
  }
}

const stop = function*(flow, condition) {
  for(const data of flow) {
    yield data;
    if (condition(data)) {
      break;
    }
  }
}

const take = function (flow, number) {
  let count = 0;
  const _filter = function (data) {
    count ++
    return count >= number;
  }
  return stop(flow, _filter);
}

class _Lazy{
  constructor() {
    this.iterator = null;
  }

  range(...args) {
    this.iterator = range(...args);
    return this;
  }

  map(...args) {
    this.iterator = map(this.iterator, ...args);
    return this;
  }

  filter(...args) {
    this.iterator = filter(this.iterator, ...args);
    return this;
  }

  take(...args) {
    this.iterator = take(this.iterator, ...args);
    return this;
  }

  [Symbol.iterator]() {
    return this.iterator;
  }

}

function lazy () {
  return new _Lazy();
}
const nums = lazy().range(0, 100).map(n => n * 10).filter(n => n % 3 === 0).take(2);
console.log(nums)
for(let n of nums) {
  console.log('num:\t', n, '\n');
}
```



***

## **冒泡与捕获**

为了解决页面中**事件流**问题（事件发生顺序）

[![LVZ3Xn.png](https://s1.ax1x.com/2022/04/11/LVZ3Xn.png)](https://imgtu.com/i/LVZ3Xn)

```javascript
 element.addEventListener(event, function, useCapture)
```

event：时间名

function：绑定函数

useCapture：默认为false（冒泡）；true（捕获）

**e.target 和 this**：

- this 指向绑定事件的对象
- e.target 触发事件的对象

**阻止默认行为：**

- event.preventDefault()
- e.returnValue; 是一个属性，适用于 IE 6 7 8
- return false
- vue中使用事件修饰符.prevent

**阻止冒泡：**

- event.stopPropagation()
-  event.target==event.currentTarget，让触发事件的元素等于绑定事件的元素
- return false
- vue中使用事件修饰符.stop

**事件委托**：

子节点上触发的事件，但绑定事件的对象为父节点，通过冒泡触发事件，通过event.target找到触发事件的具体节点

***

## **深浅拷贝**

将一个变量赋值给另一个变量时，当变量为原始值，直接赋值；当变量为引用值，将变量的引用赋给另一变量

**浅拷贝：**当对象的属性值均为原始值，可使用Object.assign或者展开运算符（...）

**深拷贝：**当对象的属性值还有对象，浅拷贝只能解决第一层的问题，使用深拷贝

```javascript
JSON.parse(JSON.stringify(object))
```

局限性：

- 会忽略 `undefined`
- 会忽略 `symbol`
- 不能序列化函数
- 不能解决循环引用的对象

***

## **async[ə'zɪŋk]/await**

- async函数返回一个resolved promise

- await之后跟表达式不同，处理方式不同

1、对于Promise对象，await会阻塞主函数的执行，等待 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果，然后继续执行主函数接下来的代码。

2、对于非Promise对象，await等待函数或者直接量的返回，而不是等待其执行结果

await会阻塞async函数中await之后的代码，保留堆栈中的东西（相当于不仅保存断点，同时也保留断点相关的上下文变量），让async函数立即返回pending promise，暂时返回执行代码的控制权给async函数之后的代码

**await是一个让出线程的标志**。紧跟在await后面的表达式会先执行一遍，将await后面的代码加入到**微任务**中，然后就会跳出整个async函数来执行后面的代码。

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  //微任务
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}

//  开始执行
console.log('script start')
setTimeout(() => {
  console.log('setTimeout') //宏任务
}, 0);
async1()
new Promise(resolve => {
    console.log('promise1')
    resolve()
  })
  //微任务
  .then(() => {
    console.log('promise2')
  })
console.log('script end')
```

输出

```javascript
> script start
> async1 start
> async2
> promise1
> script end
> async1 end
> promise2
> setTimeout
```

***

## **input文本框内的事件**

- **vue中无on**

1.onfocus 当input 获取到焦点时触发

2.onblur 当input失去焦点时触发，注意：这个事件触发的前提是已经获取了焦点再失去焦点的时候会触发相应的js

3.onchange 当input失去焦点并且它的value值发生变化时触发

4.onkeydown 在 input中有键按住的时候执行一些代码

5.onkeyup 在input中有键抬起的时候触发的事件，在此事件触发之前一定触发了onkeydown事件

6.onclick 主要是用于 input type=button，当被点击时触发此事件

7.onselect 当input里的内容文本被选中后执行一段，只要选择了就会触发，不是非得全部选中

***

## **WeakMap**

- 键必须为对象，值为任意值

- 只有通过键对象的引用才能取到值，如果使用字符串就无法区分对字符串变量是否可以回收掉

- 如果没这个键没有在其他地方被引用，这个键值对就会从弱映射中消失。

- object 键必须为字符串

- map 键可以是Number、Array、Function

***

## **for in & for of**

for in 遍历可枚举属性，包括原型链上的可枚举属性

for of 遍历可迭代对象

***

## **Object.is**

多值相等判定

```javascript
function recursivelyCheckEqual (x, ...rest) {
    retrun Object.is(x, rest[0]) && (rest.length < 2 || recursivelyCheckEqual(...rest));
}
```

***

## **包装类**

- 原始值（null、undefined、number、string、boolean）没有属性和方法

- 利用包装类变成对象Boolean、Number、String

  ```javascript
  let num=123;                           //不是对象
  let newNum=new Number(123);            //是对象
  ```

- 隐式包装类：隐式转换，新建一个对象，添加属性并赋值，最后删除这个对象

  ```javascript
  let num=4;
  num.len=3;
  console.log(num.len);   //undefined
  ```

***

## **Nodejs模拟OJ**

```javascript
const readline = require('readline');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function(data) {
    // 获取输入
    let inputs = data.trim().split(' ');

    // 处理
    let result = deal(inputs);

    // 输出结果
    console.log(`我是${result}`);
    rl.close();
});
rl.on('close',function(){
  process.exit(0);
});

/**
 * [deal description]
 * @param  {[type]} inputs [description]
 * @return {[type]}        [description]
 */
function deal(inputs) {
    var result = '';

    // dosomething

    return result + inputs;
}
```

***

## 什么时候不能使用箭头函数

- 对象方法中，不适用箭头函数
- 原型对象方法中，不适用箭头函数
- 构造函数不能使用箭头函数
- 动态上下文中的回调函数不适用箭头函数，比如点击事件
- vue生命周期和method中不适用箭头函数

vue本质是一个对象，react本身是一个ES6的class，所以可以。

***

## ES6 class

- 方法之间不用加**逗号**，不然会报错

## Function.apply.bind&Function.bind.apply

Function.apply.bind(fn, null) <=> fn.apply(null)

Function.bind.apply(fn, null) <=> fn.bind(null)

## Ajax

- AJAX（Asynchronous JavaScript and XML）
- XMLHttpRequest对象三个属性：onreadystatechange、readyState、status
- onreadystatechange存储函数（或函数名），每当 readyState 属性改变时，就会调用该函数
- readyState存储XMLHttpRequest 的状态
  - 0: 请求未初始化
  - 1: 服务器连接已建立
  - 2: 请求已接收
  - 3: 请求处理中
  - 4: 请求已完成，且响应已就绪
- 每当 readyState 改变时，就会触发 onreadystatechange 事件

```js
const request = function () {
    return new Promise((resolve, reject) => {
        let xmlhttp=new XMLHttpRequest()
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                resolve(xmlhttp.responseText)
            }
        }
        xmlhttp.open("GET","https://www.runoob.com/try/ajax/ajax_info.txt",true);
        xmlhttp.send()
    })
}

function loadXMLDoc() {
    request().then((data) => {
    	document.getElementById("myDiv").innerHTML=data
	}).catch(err => {
        console.log(err)
    })
}
```

## 支持Promise 的Generator Runner

- 实现Promise驱动的生成器
- 不需要为每一个生成器手动编写Promise链
- 自动异步执行穿给它的生成器，直到结束

```js
function run (gen) {
    let args = [].slice.call(arguments, 1), it
    
    // 在当前上下文中初始化生成器
    it = gen.apply(this, args)
    
    // 返回一个promise用于生成器完成
    return new Promise.resolve().then(function handleNext (value) {
        let next = it.next(value)
        // 
        return (function handleResult (next) {
            if (next.done) {
                return next.value
            } else {
                // 成功就恢复异步循环，把决议值发回生成器
                // 如果value是拒绝的promise，就把原因传回生成器进行出错处理，生成器中可以捕获异步的抛出的错误
                return Promise.resolve(next.value).then(handleNext, function handleErr (err) {
                    return Promise.resolve(it.throw(err)).then(handleResult)
                })
            }
        })(next)
    })
}
```

