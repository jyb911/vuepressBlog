## vuex

- 核心是共享状态的管理：多个action改变同一状态，多个视图依赖同一状态

![](https://v3.vuex.vuejs.org/vuex.png)

- 默认在内存中集中存储管理所有组件的状态，刷新页面丢失状态
- state：驱动应用的数据源
- view：将state映射到视图
- actions：响应view上用户输入导致的变化
- mutation：通过commit action到mutation来触发state变更

## 派生状态

### getter

- 接受 state 作为其第一个参数
- 返回值会根据它的依赖被缓存起来，依赖值改变时重新计算
- getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})

//  getter返回一个函数，允许给getter传参
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```



## 异步action

- 提交mutation
- 包含异步操作
- 接受一个和store具有相同属性和方法的context对象
- 通过store.dispatch方法触发

### mapAtions

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

- store.dispatch可以处理Promise，且仍返回Promise

## 同步mutation

- Vue.use：通过全局方法 Vue.use() 使用插件，Vue.use 会自动阻止多次注册相同插件，它需要在你调用 new Vue() 启动应用之前完成，Vue.use() 方法至少传入一个参数，该参数类型必须是 Object 或 Function，如果是 Object 那么这个 Object 需要定义一个 install 方法，如果是 Function 那么这个函数就被当做 install 方法。在 Vue.use() 执行时 install 会默认执行，当 install 执行时第一个参数就是 Vue，其他参数是 Vue.use() 执行时传入的其他参数。就是说使用它之后调用的是该组件的install 方法。

```js
//使用vuex
Vue.use(Vuex)

// 创建store，初始化state对象和mutation对象
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

// 通过 store.state 来获取状态对象，以及通过 store.commit 方法触发状态变更
store.commit('increment')

// 为了在Vue组件中访问this.$store，可以从Vue根组件向所有子组件以store选项的方式注入store
new Vue({
    el: "#app",
    store
})
```

### 提交载荷

- 可以向mutation传入额外的参数

### 利用常量代替事件类型

- 把事件名常量放在一个单独的文件

### mapMutations

- 将组件中methods映射为$store.commit调用

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```



## State

- 单一状态树：一个store对象包含所有应用层级状态，即应用只包含一个store实例

### 在Vue中获取状态

- 计算属性中返回某状态

```vue
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### mapState辅助函数

-  一个组件需要获取多个状态

```js
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}

// 当映射的计算属性的名称与 state 的子节点名称相同时，可以传一个字符数组
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```

## Module

- store对象模块化

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

### 模块的局部**状态**

- 模块内部的mutation和getter接收的第一个参数是模块的局部状态对象
- 模块内部的action，局部状态为context.state，根节点状态为context.rootState

```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

- 对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：

```js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### 命名空间

- 默认情况下，模块内部的mutation、getter、action是注册在全局命名空间的，则会使得多个模块可以对同一mutation或action作出响应（**一个事件触发多个模块的改变，但state还是对应的模块的局部状态**）
- 可以通过添加namespaced：true来使模块的命名空间独立，它的所有 getter、action 及 mutation 中的函数都会自动根据模块注册的路径调整命名

```js
const store = new Vuex.Store({
  modules: {
    // 模块名
    account: {
      namespaced: true,
      // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性       不会对其产生影响
      state: () => ({ ... }), 
      getters: {
        isAdmin () { ... } 
      // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } 
      // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } 
      // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```


