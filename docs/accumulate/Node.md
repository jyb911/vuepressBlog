## Node
一个基于 Google V8 引擎的事件驱动 I/O 服务端 JavaScript 环境

## 观察者模式

- Node.js 单线程类似进入一个while(true)的事件循环，直到没有事件观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数.

- 异步任务进入Event Table并**注册回调函数（作为事件观察者）**，当异步任务完成时触发一个事件（ events.EventEmitter 的实例），Event Table会将回调函数移入任务队列（Event Queue）（通知观察者），**宏任务、微任务皆为异步任务**
- 执行异步操作的函数将回调函数作为最后一个参数， 回调函数接收错误对象作为第一个参数
- events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。

## EventEmitter

- on(event, listener)：为指定事件注册监听器
- emit(event, listener)：按监听器的注册顺序执行执行每个监听器
- once(event, listener)：为指定事件注册一个单次监听器
- addListener(event, listener)：为指定事件添加一个监听器到监听器数组的尾部
- removeListener(event, listener)：移除指定事件的**某个**监听器
- removeAllListeners([event])：移除所有事件的所有监听器， 如果指定事件，则移除指定事件的所有监听器
- listeners(event)：返回指定事件的监听器数组

## errror事件

- 当 error 被触发时，EventEmitter 规定如果没有响 应的监听器，Node.js 会把它当作异常，退出程序并输出错误信息。

  我们一般要为会触发 error 事件的对象设置监听器，避免遇到错误后整个程序崩溃。

## 模块系统

```js
// 暴露接口
exports.world = function() {
  console.log('Hello World');
}
```

```js
// require 用于从外部获取一个模块的接口，即所获取模块的 exports 对象
var hello = require('./hello');
hello.world();
```

***

```js
function hello () {
  console.log('Hello World');
}
module.exports = hello
```

```js
const hello = require('./hello');
hello();
```

