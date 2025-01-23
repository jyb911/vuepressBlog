## **new、call、apply实现**

**new**

- 创建一个新对象
- 将构造函数的作用域赋给新对象（因此this就指向了这个新对象）(所谓将构造函数的作用域赋给新对象，就是给这个新对象构造原型链，链接到构造函数的原型对象上，从而新对象就可以访问构造函数中的属性和方法。)
- 执行构造函数中的代码（为这个新对象添加属性）
- 返回新对象

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
       console.log(this.name)
    }
}

//Version 1

function myNew() {
//   shift方法返回函数参数的第一项，即构造函数
  var constr = Array.prototype.shift.call(arguments);
//   创建一个空对象,改变this指向
  var obj = new Object();
  object.__proto__ = constr.prptotype;
//   执行构造函数
  var result = constr.apply(obj, arguments);
  return result instanceof Object? result : obj;
}

//Version 2

function myNew() {
//   shift方法返回函数参数的第一项，即构造函数
  var constr = Array.prototype.shift.call(arguments);
//   创建一个空对象,改变this指向
  var obj = Object.create(constr.prototype);
//   执行构造函数
  var result = constr.apply(obj, arguments);
  return result instanceof Object? result : obj;
}

// var person = new Person('Nicholas', 29, 'Front-end developer'); 
var person = myNew(Person, 'Nicholas', 29, 'Front-end developer');

console.log(person.name) // Nicholas
person.sayName();        // Nicholas
console.log(person.__proto__ === Person.prototype);   // true
```

**apply**

```javascript
var person = {
  fullName: function(txt) {
     return txt + this.firstName + " " + this.lastName;
   }
 }
var person1 = {
   firstName:"John",
   lastName: "Doe"
} 

// person.fullName.call(person1, "Hello, ");
//给原型对象Function.prototype添加一个myOwnCall属性
Function.prototype.myOwnCall = function(context) {

//   this指向调用函数的对象
  const sym = Symbol();
  context.sym = this;

//   result = context.sym(Array.from(arguments).slice(1));
//   console.log(result);
  var args = [];

  for (let i in arguments) {
    if (i > 0) {
        args.push("arguments[" + i + "]");
    }
  }

// + 直接将数组与字符串连接
  var result = eval("context.sym([" + args + "])");

  console.log(result);

  delete context.sym;
}
person.fullName.myOwnCall(person1, "Hello, ", 'qwer');
```

**call**

```javascript
var person = {
  fullName: function(txt) {
     return txt + this.firstName + " " + this.lastName;
   }
 }
var person1 = {
   firstName:"John",
   lastName: "Doe"
} 

// person.fullName.call(person1, "Hello, ");
//给构造函数Function的原型对象Function.prototype添加一个myOwnCall属性
Function.prototype.myOwnApply = function(context) {

//   this指向调用函数的对象
  const sym = Symbol();
  context.sym = this;

//   result = context.sym(Array.from(arguments[1]));
//   console.log(result);
  var args = [];

  for (let i in arguments) {
    args.push("arguments[1][" + i + "]");
  }
  console.log("context.sym([" + args + "])")
// + 直接将数组与字符串连接
  var result = eval("context.sym([" + args + "])");

  console.log(result);

  delete context.sym;
}
person.fullName.myOwnApply(person1, ["Hello, ", 'qwer']);
```

***

## **debounce  &   throttle**

**setTimeout** 返回**timeoutId**定时器标识

```javascript
 function debounce(fn,delay) {
    var timeout = null; // 创建一个标记用来存放定时器的返回值
    return function () {
        // 每当用户输入的时候把前一个 setTimeout clear 掉
        clearTimeout(timeout); 
        // 然后又创建一个新的 setTimeout, 这样就能保证interval 间隔内如果时间持续触发，就不会执行 fn 函数
        timeout = setTimeout(() => {
            fn.apply(this, arguments);//this指向return的函数，arguments为fn函数的参数
            //或使用fn(...arguments)
        }, delay);
    };

```

```javascript
function throttle(fn, delay) {
    let timeout = null;
    return function() {
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                fn.apply(this, arguments)
            }, delay)
        }
    }
}
```

***

## **数组去重**

```javascript
const arr = [1, 2, 2, 'abc', 'abc', true, true, false, false, undefined, undefined, NaN, NaN]
```

- Set + Array.from （对undefined、NaN去重有效）

```javascript
const result = Array.from(new Set(arr))
console.log(result) // [ 1, 2, 'abc', true, false, undefined, NaN ]
```

- 循环遍历原地删除（涉及数据搬移）splice（对NaN无法去重）

```javascript
function removeDuplicate(arr) {
  let len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1)
        len-- // 减少循环次数提高性能
        j-- // 保证j的值自加后不变
      }
    }
  }
  return arr
}

const result = removeDuplicate(arr)
console.log(result) // [ 1, 2, 'abc', true, false, undefined, NaN, NaN ]

```

- 创建新数组 indexOf（对NaN无法去重）、includes（对NaN可以去重）

```javascript
function removeDuplicate(arr) {
  const newArr = []
  arr.forEach(item => {
    if (newArr.indexOf(item) === -1) {
      newArr.push(item)
    }
  })
  return newArr // 返回一个新数组
}

const result = removeDuplicate(arr)
console.log(result) // [ 1, 2, 'abc', true, false, undefined, NaN, NaN ]

```

```javascript
function removeDuplicate(arr) {
  const newArr = []
  arr.forEach(item => {
    if (!newArr.includes(item)) {
      newArr.push(item)
    }
  })
  return newArr
}

const result = removeDuplicate(arr)
console.log(result) // [ 1, 2, 'abc', true, false, undefined, NaN ]

```

- 快慢指针（用于有序数组）

  fast 先探路，找到和slow不等的就让slow过来

```javascript
function removeDuplicate (arr) {
    if (arr.length == 0) {
        return [];
    }
    let fast = 0, slow = 0;
    while (fast < arr.length) {
        if (arr[fast] != arr[slow]) {
            slow++;
            arr[slow] = arr[fast];
        } else {
            fast ++;
        }
    }
    return arr.slice(0, slow+1);
}
```



- filter + indexOf

```javascript
function removeDuplicate(arr) {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index
  })
}

const result = removeDuplicate(arr)
console.log(result) // [ 1, 2, 'abc', true, false, undefined ]

```

- map

```javascript
function removeDuplicate(arr) {
  const map = new Map()
  const newArr = []

  arr.forEach(item => {
    if (!map.has(item)) { // has()用于判断map是否包为item的属性值
      map.set(item, true) // 使用set()将item设置到map中，并设置其属性值为true
      newArr.push(item)
    }
  })

  return newArr
}

const result = removeDuplicate(arr)
console.log(result) // [ 1, 2, 'abc', true, false, undefined, NaN ]
```

- 对象（对象的属性名不可重复）

```javascript
function removeDuplicate(arr) {
  const newArr = []
  const obj = {}

  arr.forEach(item => {
    if (!obj[item]) {
      newArr.push(item)
      obj[item] = true
    }
  })

  return newArr
}

const result = removeDuplicate(arr)
console.log(result) // [ 1, 2, 'abc', true, false, undefined, NaN ]

```

***

## **promise实现一个retry函数**

方法接受两个入参： 
 promiseFunction：调用promiseFunction产生一个promise实例，实例有可能成功，有可能失败 
 timeLimit：timeslimit是最大可重试次数 
 promises实例状态扭转为成功之后，函数返回的promise实例扭转为成功，失败之后，会检查当前充实次数是否超过限制，如果没有超过的话则重试，超过的话，则将返回的promise实例扭转为失败

```javascript
function retry (promiseFunction, timesLimit) {
    return new Promise(function (resolve, reject) {
        const fn = function () {
            promiseFunction().then(resolve).catch((e) => {
                if (timesLimit-- > 0) {
                    console.log(`还有${timesLimit}次`);
                    setTimeout(fn, 1000);
                } else {
                    reject(e);
                }
            })
        }
        //返回内函数执行结果
        return fn();
    })
}

function getUser() {
    return new Promise((resolve, reject) => {
        const result = Math.floor(Math.random() * 10)
        return result < 3 ? resolve({
            id: result,
            username: 'ming'
        }) : reject(new Error(`The ${result} is greater than 3`));
    })
}


retry(getUser, 3).then(() => {
    console.log('success');
});
```

***

## **数组flat**

- .flat(Infinity)：使用Infinity作为深度，展开任意深度的嵌套数组
- 递归

```java
const flat = function (arr) {
      // 声明一个新数组
      let result = []
      
      arr.forEach(item => {
      // 判断数组元素是否仍是一个数组
        if (Array.isArray(item)) {
            // 递归flat
          result = result.concat(flat(item))
        } else {
          result.push(item)
        }
      })
      return result
}
```

- 使用reduce函数进行递归

```javascript
const flat =function (arr) {
    return arr.reduce((total, current, index, array) => {
        if (Array.isArray(current)) {
            return total.concat(flat(current));
        } else {
            return total.concat(current);
        }
    }, []); 
}
```

- toString强制类型转换

```javascript
const flat = function (arr) {
    return arr.toString().split(',').map(item => +item)
}
```

- JSON.stringify加正则

```javascript
const flat = function (arr) {
    let result = JSON.stringify(arr);
    result = result.replace(/(\[|\])/g, '');
    result = '[' + result + ']';
    return JSON.parse(result);
}
```

- 创建一个栈结构，遍历栈结构，如果是数组，使用扩展运算符展开再次push进栈中

```javascript
const flat = function (arr) {
    let res = [];
    let stack = [].concat(arr);
    while (stack.length > 0) {
        let item = stack.pop();
        if (Array.isArray(item)) {
            stack.push(...item);
        } else {
            item !== undefined && res.unshift(item);
        }
    }
    return res;
}
```



***

## **深拷贝和浅拷贝**

浅拷贝：

- 对象解构
- Object.assign

深拷贝：

- JSON.stringify 和 JSON.parse

  ```javascript
  var obj = {
          name: 'zhangsan',
          date: new Date(), // 被转义为字符
          regExp: new RegExp("\w+"), // 丢失
          fun: function () { return true;}, // 丢失
          err: new Error('error'), // 丢失
          symbol: Symbol(233), // 丢失
          undefined: undefined, // 丢失
          null: null,
          nan: NaN, // 被转义null
          infinity: Infinity // 无穷大被转义null
          // bigint: BigInt(1) // bigint 类型直接报错TypeError: Do not know how to serialize a BigInt
      };
  ```

- 递归

```javascript
// 定义一个函数判断是否为对象
const isObj = (val) => typeof val === 'object' && val !== null;

const deepClone = function (obj) {
    // 判断是数组还是对象
    let newObj = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach(key => {
        if (isObj(obj[key]) {
            newObj[key] = deepClone(obj[key]);
            } else {
                  newObj[key] = obj[key];
              }
    })
    return newObj;
}
```

***

## **实现继承**

**原型链继承**

- 构造函数、原型和实例之间的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个原型对象的指针

- 子类构造函数的原型是父类的实例

```javascript
function Parent () {
    this.name = 'aa';
}
Parent.prototype.getName = function () {
    console.log(this.name);
}

function Child () {}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

```

***

**构造函数继承**

每个实例拥有不同的引用对象且支持传参

```javascript
function Parent () {
    this.color = ['red', 'blue', 'green'];
}
function child () {
    // 每个子类实例都有一份父类属性的拷贝
    Parent.call(this);
}
```

- 只能继承父类的**实例**属性和方法，不能继承原型属性/方法

**组合继承**

```javascript
function Parent (name, age) {
    this.name = name;
    this.age = age;
}
Parent.prototype.sayHi = function () {
    console.log(`hello, ${this.name}`);
}

function Child (name, age, gender) {
    // 用构造函数实现对实例属性的继承
    Parent.call(this, name, age);
    this.gender = gender;
}
// 用原型链实现对原型属和方法的继承
Child.prototype = new Parent();
// 如果不将constrctor赋给Child，则为Parent
Child.prototype.constructor = Child;

```

**原型式继承**

```javascript
// 对传入的对象执行了一次浅复制，传入对象作为构造函数的原型，返回一个构造的实例
function object(obj){
  function F(){}
  F.prototype = obj;
  return new F();
}

```

**寄生式继承**

```javascript
function createAnother(original){
  var clone = object(original); // 通过调用 object() 函数创建一个新对象
  clone.sayHi = function(){  // 以某种方式来增强对象
    alert("hi");
  };
  return clone; // 返回这个对象
}
```

**寄生组合式继承**

```javascript
function Parent (name) {
    this.name = name;
}
Parent.prototype.say = () => {
    console.log('hi');
}

function Child (name, age) {
    // 构造函数实现对实例属性的继承且可以传递参数
    Parent.call(this, name);
    this.age = age;
}
// Objct.create 参数为新创建对象的原型对象，只继承了原型的方法和属性，并未继承构造函数的方法和属性
Child.prototype = Objct.create(Parent.prototype);
Child.prototype.constructor = Child;
```

**class 继承**

```javascript
class Parent {
    constructor (name) {
        this.name = name;
    }
}
class Child extends Parent {
    constructor (name, age) {
        super(name);
        this.age = age;
    }
}
```

***

## **手写Promise**

- 语法上，**Promise**是一个构造函数，返回一个带有状态的对象
- 功能上，**Promise**用于解决异步函数并根据结果做出不同的应对
- 规范上，**Promise**是一个拥有**then**方法的对象

**状态转换**：只能由**pending**向**fufillled**或**rejected**转变，且**只有在执行环境堆栈仅包含平台代码时转变一次，称为状态凝固， 并保存一个参数表明结果**

```javascript
const [REJECTED, FULFILLED, PENDING] = ['rejected', 'fulfilled', 'pending'];

class MyPromise {
    
    // 构造函数中分三部分：状态和终值的设置、resolve/reject函数、executor执行
    constructor (executor) {
        this.state = PENDING; // 初始为pending状态
        this.value = null; // 保存终值
        this.reason = null; // 保存拒绝原因

        this.onFulfilledCallbacks = []; // 成功回调队列
        this.onRejectedCallbacks = []; // 失败回调队列

        const resolve = value => {

            if (value instanceof MyPromise) {
                return value.then(resolve, reject);
            }

            // setTimeoUt 模拟主线程空闲时执行
            setTimeout(() => {
                if (this.state == PENDING) {
                    this.state = FULFILLED;
                    this.value = value;
                    // 这里用map保证回调队列顺序执行
                    this.onFulfilledCallbacks.map(cb => cb(value));
                }
            })
        }

        const reject = reason => {
            setTimeout(() => {
                if (this.state == PENDING) {
                    this.state = REJECTED;
                    this.reason = reason;
                    this.onRejectedCallbacks.map(cb => cb(reason));
                }
            })
        }

        // executor
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }

    }

    // then 方法
    then (onFulfilled, onRejected) {
        let _promise;

        // 确保 onFulfilled 和 onRejected 是函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        }

        if (this.state == FULFILLED) {
            return (_promise = new MyPromise ((resolve, reject) => {
                
                // 这里使用 queueMicrotask 是因为Promise.prototype.then属于微任务
                queueMicrotask(() => {
                    try {
                        let result = onFulfilled(this.value);
                        resolvePromise(_promise, result, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            }))
        }

        if (this.state == REJECTED) {
            return (_promise = new MyPromise ((resolve, reject) => {
                queueMicrotask(() => {
                    try {
                        let result = onRejected(this.reason);
                        resolvePromise(_promise, result, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            }))
        }

        if (this.state == PENDING) {
            return (_promise = new MyPromise ((resolve, reject) => {
                this.onFulfilledCallbacks.push(value => {
                    try {
                        let result = onFulfilled(value);
                        // resolvePromise 根据 result 决定 _promise 的状态
                        resolvePromise(_promise, result, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                    
                })

                this.onFulfilledCallbacks.push(reason => {
                    try {
                        let result = onRejected(reason);
                        resolvePromise(_promise, result, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                    
                })
            }))
        }

    }

    // resolvePromise 方法根据回调函数的返回值result决定then返回的promise对象_promise的最终状态
    resolvePromise (_promise, result, resolve, reject) {
        if (_promise === result) {
            reject(new TypeError('Circular Reference'));
        }
        
        // 判断回调函数结果是否是promise实例
        if (result instanceof MyPromise) {

            // 回调函数结果的状态为pending
            if (result.state === PENDING) {
                result.then(
                    y => {

                        // 这里为了防止resolve的终值还是promise，需要递归调用
                        resolvePromise(_promise, y, resolve, reject);
                    },
                    r => {
                        reject(r);
                    }
                )
            
            // 回调函数结果的状态凝固
            } else {
                result.then(resolve, reject);
            }
        
        // 回调函数结果是函数或对象，判断其有无 then 方法
        } else if (result && (['function', 'object'].includes(typeof result) === true)) {
            let called = false;
            try {
                let then = result.then;

                // 这里假设then方法存在
                if (typeof then === 'function') {
                    then.call(
                        result, 
                        y => {
                            if (called) return;
                            called = true;
                            resolvePromise(_promise, y, resolve, reject);
                        },
                        r => {
                            if (called) return;
                            called = true;
                            reject(r);
                        }
                    )

                // then方法不存在
                } else {
                    resolve(x);
                }
            } catch (e) {
                if (called) return;
                called = true;
                reject(e);
            }

        // 既不是promise实例也不是对象或函数则直接返回
        } else {
            resolve(result);
        }
    }
    
}

let p = new MyPromise((resolve, reject) => resolve(123));
setTimeout(console.log, 0, p);
```

***

