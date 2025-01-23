# 1类型

## 内置类型

- number
- string
- boolean
- null
- undefined
- object
- symbol

***

- typeof返回类型的字符串值
- 函数是可调用对象，它有一个内部属性[[Call]]，该属性使其可以被调用
- 函数可以拥有属性，函数对象的length属性是其声明的参数的个数

## 值和类型

- 变量没有类型，值才有，变量可以是任何类型
- 对于未声明的变量，typeof返回undefined
- 访问不存在的对象属性不会产生ReferenceError

# 2值

## 数组

- 使用delete运算符可以将单元从数组中删除，但数组的length属性不会变化
- 数组可以像对象一样包含字符串键值和属性，字符串键值不计算在数组长度内
- 如果字符串键值可以被强制类型转换为十进制数字，它就会被当作数字索引处理，会被计算在数组长度内
- 类数组：一组通过数字索引的值
- 将类数组转化为真正的数组：Array.prototype.slice.call、Array.from

## 字符串

- 字符串不可变是指字符串的成员函数不会改变其原始值，而是创建并返回一个新的字符串
- 字符串也有length属性、indexOf和concat方法
- 字符串可以借用数组的非变更方法

```js
Array.prptotype.join.call
Array.prototype.map.call
```

- 字符串无法借用数组的可变更成员函数reverse，因为字符串不可变

## 数字

- js使用的是双精度格式（64位二进制）
- 特别大和特别小的数字默认使用指数格式表示，toExponential()函数返回指数格式表示
- tofixed()方法指定小数部分显示位数
- toPrecision()方法指定有效数位的显示位数
- .运算符会被优先识别为数字字面量的一部分，然后才是对象属性访问运算符
- 从ES6开始，不再支持0363八进制格式
- 使用0x、0o、0xi表示二进制、八进制、十六进制

***

### 0.1+0.2 === 0.3

- 设置一个误差范围值（机器精度），Number.EPSILON(2^-52)

***

- 最大浮点数Number.MAX_VALUE
- 最小浮点数Number.MIN_VALUE
- 最大整数Number.MAX_SAFE_INTEGER
- 最小整数Number.MIN_SAFE_INTEGER
- 检测一个值是否是整数：Number.isInteger
- 检测一个值是否是安全的整数：Number.isSafeInteger
- 整数最大能够达到53位，有些数字操作（如数位操作）只适用于32位数字
- a | 0可以将变量a中的数值转换为32位有符号整数，因为数位运算符|只适用于32位整数

## 特殊数值

- null是一个特殊的关键字，不是标识符，不能当作变量来使用和赋值
- undefined是一个标识符，可以被当作变量来使用和赋值
- void不改变表达式的结果，只是让表达式不返回值
- NaN可以理解为无效数值，其类型仍是number
- 全局工具函数isNaN，检查参数是否是无效数字，是否是非数字类型，如字符串也会返回true
- ES6使用Number.isNaN
- NaN不能等于自身
- Infinity/Infinity结果为NaN
- 只有乘除法会产生负零，加减法不会得到负零
- 对负零进行字符串化会返回“0”
- 对“-0”从字符串转化为数字，得到-0
- -0和0相等，无法通过==和===判断
- Object.is判断两个值是否绝对相等，主要用来处理特殊的相等比较

# 3原生函数

## 常用原生函数

- String()
- Number()
- Boolean()
- Array()
- Object()
- Function()
- RegExp()
- Date()
- Error()
- Symbol()

***

- 所有typeof返回值为“object”的对象都包含一个无法直接访问的内部属性[[Class]]，一般通过Object.prototype.toString.call查看
- null和undefined美誉原生构造函数，但内部[[Class]]属性值仍为"[object Null]"和"[object Undefined]"
- valueOf()可以得到封装对象中的基本类型值
- 构造函数**Array不要求必须带new关键字**
- Array构造函数织带一个数字参数时，该参数会被作为数组的预设长度
- new Array(3)会创建空单元数组[empty × 3]，要想创建包含undefined的数组可以通过Array.apply(null, { length: 3 })
- 动态定义正则表达式new RegExp("pattern"，"flags")
- Date.now()和(new Date()).getTime()获得当前Unix时间戳
- 调用Date()时不带new关键字，会得到当前日期的字符串值
- 构造函数**Error不要求必须带new关键字**
- 错误对象通过只读属性.stack获得当前运行栈的上下文，包括函数调用栈信息和产生错误的代码行号，也可以调用toString()来获得经过格式化的便于阅读的错误信息
- 通常错误对象至少包含一个message属性
- **Symbol原生构造函数不能带new关键字**，否则会出错

## 原生原型

- 根据文档约定将String.prototype.xyz简写成String#xyz，**对其他原型也同样如此**
- Function.prototype是一个空函数，RegExp.prototype是一个空正则表达式，Array.prototype是一个空数组
- 可以将原型作为默认值，因为.prototype已经被创建并且仅创建一次

# 4强制类型转换

- 强制类型转换只会返回标量基本类型值，如数字、字符串和布尔值，不会返回对象和函数

## toString

- null => "null"
- undefined => "undefined"
- true => "true"
- 对于普通对象，除非自行定义，否则toString(Object#toString())返回内部属性[[Class]]的值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
