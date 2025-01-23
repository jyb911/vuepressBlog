# 1作用域是什么

- 我的理解是在程序执行执行过程中，可以访问到的变量或者函数所在的一个区域

## 编译原理

- 发生在代码执行之前

1. 词法分析：将字符串分解为词法单元
2. 语法分析：将词法单元数组转换为抽象语法树
3. 代码生成：将AST转换为可执行代码

## 作用域

- 负责收集并维护由所有声明的标识符组成的一系列**查询**（js引擎在执行代码的过程中会通过作用域来查询标识符的访问权限），并确定当前执行的代码对于这些标识符的访问权限

## LHS&RHS

- LHS：查找赋值操作的目标，为了给变量赋值
- RHS：查找赋值操作的源头，为了获取变量的值

## 作用域链

## 查询异常

非严格模式下，

- RHS找不到变量，抛出RefereceRerror
- LHS找不到变量，会在全局作用域中创建一个同名变量

严格模式下，均会抛出RefereceRerror

***

# 2词法作用域

- 作用域有两种主要的工作模型：词法作用域和动态作用域

## 词法阶段

- 词法作用域：定义在词法阶段的作用域，由变量和块作用域在代码中的位置决定
- 作用域查找会在找到第一个匹配的标识符时停止，同名标识符形成遮蔽效应

## 欺骗词法

- eval：执行js语句，如同它就写在这里一样
- with：将一个对象处理为新的词法作用域

# 3函数作用域和块作用域

## 函数作用域

- 函数作用域：属于这个函数的全部变量都可以在整个函数的范围内使用及复用

## 隐藏内部实现

- 利用函数作用域的特性隐藏私有的变量或函数
- 避免同名标识符之间的冲突

## 函数带来的一些问题

- 必须声明一个具名函数，污染外部作用域
- 必须通过函数名进行显式调用

### 匿名函数表达式

缺点：

- 栈追踪中不显示函数名，调试困难
- 调用自身时只能使用过期的arguments.callee
- 降低代码可读性

### 立即执行函数表达式

## 块作用域

- with
- try/catch
- let
- const

# 4提升

- 定义声明和赋值声明


- var变量定义声明提升到作用域的最顶端


- 函数声明会被提升，函数表达式不会被提升


- 重复声明中，函数声明会比变量先一步被提升

# 5作用域闭包

- 闭包：通常函数执行结束，函数作用域也会跟着消失，当函数可以记住并访问所在的词法作用域，就产生了闭包，即使函数是在当前词法作用域之外执行
- 闭包其实就是对函数所在词法作用域的引用
- 阻止垃圾回收
- 使用回调函数就是在使用闭包

```js
for (var i = 1; i <= 5; i++) {
    setTimeout(function timer () {
        console.log(i)
    }, 1000)
}

// 使用IIFE
for (var i = 1; i <= 5; i++) {
    (function (i) {
        setTimeout(function timer () {
        	console.log(i)
    	}, 1000)
    })(i)
}

// 使用let
for (let i = 1; i <= 5; i++) {
    setTimeout(function timer () {
        console.log(i)
    }, 1000)
}

// 使用bind 
for (var i = 1; i <= 5; i++) {
    setTimeout(console.log.bind(console.log, i), i * 1000)
}
```

立即调用函数会生成一个新的作用域

let可以用来劫持块作用域

## 模块

- 调用包装了函数定义的包装函数
- 将返回值作为该模块的API

```js
function CoolModule () {
    let something = "cool"
    let another = [1, 2, 3]
    
    function doSomething () {
        console.log(something)
    }
    
    function doAnother () {
        console.log(another.join("!"))
    }
    // 这里返回的对象含有对内部函数的引用
    return {
        doSomething,
        doAnother
    }  
}

let foo  = CoolModule()
// 这两个函数就具有了模块实例内部作用域的闭包
foo.doSomething()
foo.doAnother()
```

- 基于函数的模块不能被静态识别（编译器无法识别），运行时才会被当作API，而且运行时可以修改API
- 基于文件的ES6模块是静态的，API不会在运行时改变，编译器在编译时就可以对导入模块的API引用进行检查

## 动态作用域

- 动态作用域链基于调用栈
- 词法作用域链基于作用域嵌套

## this词法

```js
var obj = {
    id: 123,
    cool: function coolFn () {
        console.log(this.id)
    }
}
var id = 456
// 这里this指向window
setTimeout(obj.cool, 100)
obj.cool()   // 456

// 利用闭包保留词法作用域，回调函数仍然可以访问到self即指向obj
var obj = {
    id: 123,
    cool: function coolFn () {
        var self = this
        setTimeout(function timer () {
            console.log(self.id)
        }, 100)
    }
}
var id = 456
obj.cool() // 123

// 箭头函数中的this始终继承外层函数的this绑定
var obj = {
    id: 123,
    cool: function coolFn () {
        var self = this
        setTimeout(() => {
            console.log(this.id)
        }, 100)
    }
}
var id = 456
obj.cool()

// 利用bind将this绑定到
var obj = {
    id: 123,
    cool: function coolFn () {
        setTimeout(function timer () {
            console.log(this.id)
        }.bind(this), 100)
    }
}
var id = 456
obj.cool()
```

# 1关于this

- 既不指向函数自身，也不指向函数的词法作用域。
- 在函数被调用时发生的绑定，指向完全取决于函数在哪里被调用

# 2this全面解析

- this通常在函数中，指向函数的调用位置

## 调用位置

- 函数被调用的位置

## 绑定规则

### 默认绑定

- 独立函数调用：非严格模式下，this指向全局对象；严格模式下，this指向undefined

### 隐式绑定

- 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象

### 显式绑定

- call、apply指定函数的this绑定
- 硬绑定：bind

### new绑定

- 使用new来调用函数会构造一个新对象并把它绑定到构造函数调用中的this上（即构造函数中的this就指向这个新对象）

## 优先级

new绑定 > 显式绑定 > 隐式绑定 > 默认绑定

## bind柯里化

## 绑定例外

- 如果传入call、apply、bind 的绑定对象为null或undefined，则应用默认绑定规则
- 因为默认绑定会把this绑定到全局对象，为了避免这一情况可以传入一个空对象，通过Object.create(null)创建一个比{}更空的空对象，因为它**不会创建Object.prototype这个委托**
- 调用函数的间接引用会应用默认绑定规则

## 软绑定

## this词法

- 箭头函数根据外层（函数或全局）作用域来决定this
- 箭头函数的绑定无法被修改

# 3对象

- null之所以typeof为object是因为，不同对象在底层都表示为二进制，在js中二进制前三位为0的话就会判断为object，null的二进制表示全为0，所以也会返回object

- 简单基本类型：string、number、boolean、null、undefined、object
- 内置对象（对象子类型）：String、Number、Boolean、Function、Array、Object、Date、RegExp、Error
- 对基本类型为字符串的字面量进行获取长度、访问某个字符等操作时，需要将其先转换为String对象

## 属性访问和键访问

- .操作符语法为属性访问，要求属性名满足标识符的命名规范
- []操作符语法为键访问，可以接受任意UTF-8字符串作为属性名

***

- 对象属性名永远是字符串

## 深拷贝和浅拷贝

- JSON.parse和JSON.stringify
- Object.assign复制所有可枚举的自有键，对象属性的特性不可枚举所以不会被复制
- 即使configurable是false，**仍然可以把writable由true改为false**，但无法由false改为true

## 浅不变性

- writable：false和configurable：false创建一个不可修改、重定义或者删除的常量属性
- Object.preventExtensions()禁止对象添加属性并保留已有属性，已有属性可以修改
- Object.seal()：调用Object.preventExtensions()并把所有属性设为configurable：false，这种情况下仍可以修改属性的值
- Object.freeze()调用Object.seal()并把所有数据访问属性设为writable：false

## 存在性

- 判断对象是否存在某个属性
- hasOwnProperty：只会检查属性是否在对象中，hasOwnProperty是Object.prototype上的方法，但有的对象没有连接到Object.prototype（Object.create(null)），这时就要用Object.prototype.hasOwnProperty.call(someObject, "属性")
- in：检查属性是否在对象及其原型链中

## 枚举

- propertyIsEnumberable：检查给定属性名是否直接存在对象中（而不是在原型链上）并满足enumerable：true
- Object.keys()：返回一个数组，对象直接包含的所有可枚举属性
- Object.getOwnPropertyNames()：返回一个数组，对象直接包含所有属性，无论是否可枚举

## 遍历

- some()、every()中特殊的返回值会**提前终止遍历**
- 对象本身定义了迭代器才能使用for...of遍历值，for..of首先会向被访问对象请求一个迭代器对象，然后调用迭代器对象的next()方法遍历所有值
- 使用Symbol.iterator获取对象的@@iterator内部属性，属性值为一个返回迭代器对象的函数

```js
let myObject = {
    a: 2,
    b: 3
}

Object.defineProperty(myObject, Symbol.iterator, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function () {
        let id = 0
        let keyArr = Object.keys(this)
        return {
            next: () => {
                return {
                    value: this[keyArr[id++]],
                    done: (id > keyArr.length)
                }
            }
        }
    }
})

for (let value of myObject) {
    console.log(value) // 2   3
}
```

# 4混合对象“类”

- js不会像类那样自动创建对象的副本
- 在js中模拟类得不偿失
- 继承意味着复制操作，js默认不会复制对象属性，而是在两个对象之间创建一个关联，这样一个对象就可以通过关联访问另一个对象的属性和函数

# 5原型

## 属性设置和屏蔽

给一个对象设置属性：

- 属性存在于对象中：只修改已有属性值
- 属性不在对象中而存在原型链上层会出现三种情况：
  1. 属性writable为true，直接在对象中添加同名属性
  2. 属性writable为false，赋值操作被忽略
  3. 属性是一个setter，会调用这个setter，不会将属性添加到对象
- 属性不在对象中也不在原型链中，对象添加一个新属性

## “类”函数

- 函数的特殊特性：所有函数默认拥有一个名为prototype的公共且不可枚举的属性，指向另一个对象
- 构造函数并不是真正的构造函数，而是带new 的函数调用
- Foo.prototype有一个公有且不可枚举的属性.constructor，所以实例并美哟.constructor属性，所以会通过原型链找到.constructor

## 继承

```js
function Foo(name) {
    this.name = name
}

Foo.prototype.myName = function () {
    return this.name
}
// 创建一个新的Bar.prototype对象并把它关联到Foo.prototype
Bar.prototype = Oject.create(Foo.prototype)

function Bar (name, label) {
    Foo.call(this, name)
    this.label = label
}

Bar.prototype.myLabel = function () {
    return this.label
}

let a = new Bar("a", "obj a")
a.myName()  // "a"
a.myLabel() // "obj a"


```

把Bar.prototype关联到Foo.prototype的：

- Object.create创建一个新对象，并把它关联到指定对象

```js
if (!Object.create) {
    Object.create = function (o) {
        function F () {}
        F.prototype = o
        return new F()
    }
}
```



- Object.setPrototypeOf(Bar.prototype, Foo.prototype)

## 检查类关系

- instanceof，左操作数是一个普通对象，右操作数是一个函数，如果该对象的原型链中有函数的prototype属性指向的对象就返回true，所以这个方法只能处理对象和函数（带.prototype引用）之间的关系
- isPrototypeOf，左右操作数均为对象
- Object.getPrototypeOf
- _ _proto_ _，实际上并不存在于实例对象中，而是存在于内置的Object.prototype中，访问时，实际是调用了Object.getPrototypeOf

# 6行为委托

## 面向对象和对象关联

- [[prototype]]机制指对象中的一个内部链接引用另一个对象，换句话说，本质就是对象之间的关联关系

### 面向对象

```js
function Foo (who) {
    this.me = who
}
Foo.prototype.identify = function () {
    return this.me
}

function Bar (who) {
    Foo.call(this, who)
}
Bar.prototpe = Object.create(Foo.prototype)
Bar.prototype.speak = function () {
    alert(this.identify())
}

let b1 = new Bar("b1")
```

### 对象关联                                                                                    

```js
Foo = {
    init (who) {
        this.me = who
    },
    identify () {
        return this.me
    }
}

Bar = Object.create(Foo)
Bar.speak = function () {
    alert(this.identify())
}
let b1 = Object.create(Bar)
b1.init("b1")
```

