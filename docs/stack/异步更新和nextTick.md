## **vue中的$nextTick**

- 只执行一次

在**下次 DOM 更新循环结束之后**执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM

***

## 异步更新

- 首先，oberver通过Object.defineProperty对data中的属性进行数据劫持，通过getter和setter可以监测数据变化

- 每一个data属性会创建一个dep数组，用来收集所有使用到这个属性的watcher

- compile函数初始化视图，给含有变量的模板指令对应的节点绑定更新函数，watcher实例初始化时向dep数组添加自己

- 当数据发生改变，observer通知dep，dep.notify通知和这个数据有关的watcher，然后dep遍历所有相关watcher执行update方法更新

- 而这里watcher的更新是异步的，因为update函数里又调用了queueWatcher，负责将需要更新的watcher加入到队列里，然后把具体的更新方法flushSchedulerQueue传给nextTick进行调用

```js
// 当一个 Data 更新时，会依次执行以下代码 
// 1. 触发 Data.set 
// 2. 调用 dep.notify 
// 3. Dep 会遍历所有相关的 Watcher 执行 update 方法 
class Watcher { 
  // 4. 执行更新操作 
  update() { 
    queueWatcher(this); 
  } 
} 
 
const queue = []; 
 
function queueWatcher(watcher: Watcher) { 
  // 5. 将当前 Watcher 添加到异步队列 
  queue.push(watcher); 
  // 6. 执行异步队列，并传入回调 
  nextTick(flushSchedulerQueue); 
} 
 
// 更新视图的具体方法 
function flushSchedulerQueue() { 
  let watcher, id; 
  // 排序，先渲染父节点，再渲染子节点 
  // 这样可以避免不必要的子节点渲染，如：父节点中 v-if 为 false 的子节点，就不用渲染了 
  queue.sort((a, b) => a.id - b.id); 
  // 遍历所有 Watcher 进行批量更新。 
  for (index = 0; index < queue.length; index++) { 
    watcher = queue[index]; 
    // 更新 DOM 
    watcher.run(); 
  } 
} 

// nextTick函数
const callbacks = []; 
let timerFunc; 
 
function nextTick(cb?: Function, ctx?: Object) { 
  let _resolve; 
  // 1.将传入的 flushSchedulerQueue 方法添加到回调数组 
  callbacks.push(() => { 
    cb.call(ctx); 
  }); 
  // 2.执行异步任务 
  // 此方法会根据浏览器兼容性，选用不同的异步策略 
  timerFunc(); 
} 


```

而nextTick函数则将传入的flushSchedulerQueue添加到callbacks数组中，然后执行timeFunc函数，timeFunc函数是根据浏览器的兼容性创建的一个异步方法，它执行完成后，会调用flushSchedulerQueue进行具体的更新

```js
let timerFunc; 
// 判断是否兼容 Promise 
if (typeof Promise !== "undefined") { 
  timerFunc = () => { 
    Promise.resolve().then(flushCallbacks); 
  }; 
  // 判断是否兼容 MutationObserver 
  // https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver 
} else if (typeof MutationObserver !== "undefined") { 
  let counter = 1; 
  const observer = new MutationObserver(flushCallbacks); 
  const textNode = document.createTextNode(String(counter)); 
  observer.observe(textNode, { 
    characterData: true, 
  }); 
  timerFunc = () => { 
    counter = (counter + 1) % 2; 
    textNode.data = String(counter); 
  }; 
  // 判断是否兼容 setImmediate 
  // 该方法存在一些 IE 浏览器中 
} else if (typeof setImmediate !== "undefined") { 
  // 这是一个宏任务，但相比 setTimeout 要更好 
  timerFunc = () => { 
    setImmediate(flushCallbacks); 
  }; 
} else { 
  // 如果以上方法都不知道，使用 setTimeout 0 
  timerFunc = () => { 
    setTimeout(flushCallbacks, 0); 
  }; 
} 
 
// 异步执行完后，执行所有的回调方法，也就是执行 flushSchedulerQueue 
function flushCallbacks() { 
  for (let i = 0; i < copies.length; i++) { 
    callbacks[i](); 
  } 
} 

```

[![vZwGtJ.png](https://s1.ax1x.com/2022/08/03/vZwGtJ.png)](https://imgtu.com/i/vZwGtJ)

- 判断 has 标识（在queueWatcher内），避免在一个 Queue 中添加相同的 Watcher。
- 判断 waiting 标识（在queueWatcher内），让所有的 Watcher 都在一个 tick 内进行更新。
- 判断 flushing 标识（在flushSchedulerQueue内），处理 Watcher 渲染时，可能产生的新 Watcher。

**上面的代码不全，以下为较完整的版本**

```js
 // queueWatcher函数
export function queueWatcher (watcher: Watcher) {
    // 拿到 watcher 的唯一标识
    const id = watcher.id
    // 无论有多少数据更新，相同的 watcher 只被压入一次
    // 我理解这就是为什么在一次操作中，多次更改了变量的值，但是只进行了一次页面更新的原因，
    // 同一变量 依赖它的 watcher 是一定的，所以已经存在了就不再放进watcher 队列中了，也不会走后面的逻辑
    if (has[id] == null) {
        // 缓存当前的watcher的标识,用于判断是否重复
        has[id] = true
        // 如果当前不是刷新状态,直接入队
        if (!flushing) {
            queue.push(watcher)
        } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        // 此处能走到这儿，说明 flushSchedulerQueue 函数被执行了 watcher队列已经正在开始被更新了, 
        // 并且 在执行某个watcher.run方法的时候又触发的数据响应式更新，重新触发了 queueWatcher
        // 因为在执行的时候回有一个给 watcher 排序的操作，所以，当 watcher 正在更新时已经是排好顺序了的，此时需要插入到特定		的位置，保持 watcher 队列依然是保持顺序的
            let i = queue.length - 1
            while (i > index && queue[i].id > watcher.id) {
                i--
            }
            queue.splice(i + 1, 0, watcher)
        }
        // queue the flush
        // waiting 表示当前的 flushSchedulerQueue 还没有被执行，因为还没有重置状态， waiting 仍然 为 true
        // 所以 waiting 的意义就是 表明是否执行了flushSchedulerQueue,
        if (!waiting) {
            waiting = true
        // 直接同步刷新队列
            if (process.env.NODE_ENV !== 'production' && !config.async) {
        // 同步执行
                flushSchedulerQueue()
                return
            }
        // 把更新队列函数放到异步队列中
            nextTick(flushSchedulerQueue)
        }
    }
}
```

```js
// flushSchedulerQueue函数
function flushSchedulerQueue () {
    // 当方法被执行时，设置为正在刷新状态，以示可以继续执行 nextTick 方法
    flushing = true
    // 把队列中的 watcher 排个序，
    /**
    * 排序的作用：（此句照搬照抄而来）
    * 1. 保证父组件的watcher比子组件的watcher先更新，因为父组件总是先被创建，子组件后被创建
    * 2. 组件用户的watcher在其渲染watcher之前执行。
    * 3. 如果一个组件在其父组件执行期间被销毁了，会跳过该子组件。
    */
    queue.sort((a, b) => a.id - b.id)
    // 中间略去若干代码
    ...
    // 遍历  queue 中存的 所有的 watcher，执行 run 方法更新
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index]
        watcher.run()
    }
    // 因为 queue 是在一个闭包中，所以当遍历执行完毕了，就把 队列清空
    queue.length = 0;
    // has 是判断 当前 watcher 是否重复，作为是否把 watcher 放进 queue 的依据
    // 此时已经执行完了 queue 中的所有 watcher了，之前已经执行过的watcher 如果发生了变更，可以重新加入了
    has = {}
    // waiting 是判断是否 执行 nextTick 的标识，当前的刷新队列已经执行完毕了，说以，可以设置为 false 了，执行下一轮的的添加异步事件队列的方法
    // flushing 是判断是否当前异步事件正在执行的标志，当前更新完毕，作为判断 watcher 入队的形式
    waiting = flushing = false
}
```

