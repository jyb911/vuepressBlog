![q8Afdx.png](https://s1.ax1x.com/2022/03/24/q8Afdx.png)

指的是视图（view）与模型数据（viewmodel）双向绑定

**Vue是采用数据劫持结合发布/订阅模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。**

每当属性的set方法触发，就循环更新Dep中的订阅者

Vue 在更新 DOM 时是**异步**执行的，只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。

Vue 不允许动态添加根级响应式 property

- observer用来实现对每个vue中的data中定义的属性循环用Object.defineProperty()实现数据劫持，以便利用其中的setter和getter，然后通知订阅者，订阅者会触发它的update方法，对视图进行更新
- compile主要做的事情是解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将含有变量的模板指令对应的节点绑定update更新函数，确定谁是订阅者（就是含有变量的模板指令对应的节点）
- watcher订阅者在自身实例化时往属性订阅数组(dep)里面添加自己，在收到数据变化通知后调用update()函数，并触发compile中绑定的回调

## **原理**

- Vue 2.利用Object.defineProperty()，并将内部解耦为Observer，Dep，并使用Watcher相连
- Vue 3.x 改用Proxy实现

对象属性有两种特性：数据属性和存取器属性（一组获取和设置值的函数get 或set）

- get对应的方法为getter，负责获取值，不带参数
- set对应的方法为setter，负责设置值，没有return

**Object.defineProperty(obj, prop, descriptor)**

- obj：必需。目标对象；
- prop：必需。需定义或修改的属性的名字；
- descriptor：必需。**目标属性所拥有的特性**；
- 返回obj

## **Object.defineProperty主要问题**：

1. 数组的变异方法（改变原数组）无法触发set
2. 必须遍历对象的每个属性
3. 必须深层遍历嵌套的对象
3. 无法监听es6的Set、Map变化
5. 无法监听Class类型数据
6. 属性的添加或删除无法监听

- 针对第一个问题，vue采用重写方法来实现数组的劫持。

  ```javascript
  const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']；
  const Augmentations = [];
  arrayMethods.forEach((method) => {
      //原生Array 的原型方法
      let original = Array.prototype[method];
      //将封装好的方法定义在Augmentations的属性上
      Aygmentations[method] = function () {
          return original.apply(this, arguments);
      }
  });
  let list = [1, 2, 3];
  // 将要监听的数组的原型指针指向保存封装方法的数组对象
  list.__prpto__ = Augmentations;
  ```

- 使用Object.defineProperty多数要配合Object.keys()进行遍历，于是多了一层嵌套

  ```javascript
  Object.keys(obj).forEach(key => {
      Object.defineProperty(obj, key, {
          //
      });
  });
  ```

- 必须深层遍历嵌套的对象

  当一个对象为深层嵌套的时候，必须进行逐层遍历，直到把对象的每个属性都调用Object.defineProperty为止

## **Proxy**

Reflect.get() 获取对象某个属性的值

Reflect.set() 将值分配给属性的函数，返回一个布尔值，如果set成功，返回true

- 支持对数组方法进行重载

  ```JavaScript
  let arr = [1, 2, 3];
  let proxy = new Proxy(arr, {
      get (target, key, receiver) {
          console.log('get', key);
          return Reflect.get(target, key, receiver);
      },
      set (target, key, value, receiver) {
          console.log('set', key, value)
          return Reflect.set(target, key, value, receiver);
      }
  });
  proxy.push(4);
  //get, push 先找proxy.push方法
  //get, length 获取当前的length
  //set, 3, 4
  //set, length, 4
  ```

  

- 针对整个对象，而不是对象的某个属性，不需要对key进行遍历

- 嵌套支持：get里面递归调用Proxy并返回

  ```javascript
  let arr = [1, 2, 3, [1]];
  let handler = {
      get (target, key, receiver) {
          console.log('get', key);
          if (typeof target[key] === 'object' && target[key]) {
              return new Proxy(target[key],handler);
          }
          return Reflect.get(target, key, receiver);
      },
      set (target, key, value, receiver) {
          console.log('set', key, value);
          return Reflect.set(target, key, value, receiver);
      }
  }
  let proxy = new Proxy(arr, handler);
  proxy[3].push(4);
  // get,3
  // get,push
  // get,length
  // set,1,4
  // set,length,2
  ```

***