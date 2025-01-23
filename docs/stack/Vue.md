## **Vue双向绑定**

[![q8Afdx.png](https://s1.ax1x.com/2022/03/24/q8Afdx.png)](https://imgtu.com/i/q8Afdx)

指的是视图（view）与模型数据（viewmodel）双向绑定

对象有两种属性：数据属性和存取器属性（一组获取和设置值的函数get 或set）

- get对应的方法为getter，负责获取值，不带参数
- set对应的方法为setter，负责设置值，没有return

Object.defineProperty(obj, prop, descriptor)

- obj：必需。目标对象；
- prop：必需。需定义或修改的属性的名字；
- descriptor：必需。**目标属性所拥有的特性**；
- 返回obj

**Vue是采用数据劫持结合发布/订阅模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。**

每当属性的set方法触发，就循环更新Dep中的订阅者

Vue 在更新 DOM 时是**异步**执行的，只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。

Vue 不允许动态添加根级响应式 property

- observer用来实现对每个vue中的data中定义的属性循环用Object.defineProperty()实现数据劫持，以便利用其中的setter和getter，然后通知订阅者，订阅者会触发它的update方法，对视图进行更新
- compile主要做的事情是解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者
- watcher订阅者在自身实例化时往属性订阅数组(dep)里面添加自己，在收到数据变化通知后调用update()函数，并触发compile中绑定的回调

***

## **组件是可复用的 Vue 实例**

**为什么一个组件的 `data` 选项必须是一个函数**

- 组件在任何模块中都可以被引用，在使用的过程中，如果组件定义的变量是个对象，那么一个模块修改了该对象，其他模块也跟着修改了。如果使用函数，每次返回的是一个新的实例，每个模块引用的过程中都是针对本身的实例做修改，不会影响到其他模块的实例。
- 在vue中v-model，v-name，{undefined{}}等都可以对数据进行显示，也就是说假如一个属性都通过这三个指令了，那么每当这个属性改变的时候，相应的这个三个指令的html视图也必须改变，于是vue中就是每当有这样的可能用到双向绑定的指令，就在一个Dep中增加一个订阅者，其订阅者只是更新自己的指令对应的数据，也就是v-model='name'和{undefined{name}}有两个对应的订阅者，各自管理自己的地方。每当属性的set方法触发，就循环更新Dep中的订阅者。
- compile的目的就是将各种指令解析成真正的html
- 首先我们为每个vue属性用Object.defineProperty()实现数据劫持，为每个属性分配一个订阅者集合的管理数组dep；然后在编译的时候在该属性的数组dep中添加订阅者，v-model会添加一个订阅者，{undefined{}}也会，v-bind也会，只要用到该属性的指令理论上都会，接着为input会添加监听事件，修改值就会为该属性赋值，触发该属性的set方法，在set方法内通知订阅者数组dep，订阅者数组循环调用各订阅者的update方法更新视图。

***

自定义组件名 (字母全小写且必须包含一个连字符)

组件名的两种命名方式

全局注册与局部注册

**全局注册的行为必须在根 Vue 实例 (通过 `new Vue`) 创建之前发生**

动态组件 v-bind:is  不同组件之间进行动态切换，多个组件同一挂载点

HTML 元素对于哪些元素可以出现在其内部是有严格限制的，可以使用is属性来应对

***

## **虚拟DOM**

***

## **事件循环机制**

***

## **vue2生命周期**

[![qGChq0.png](https://s1.ax1x.com/2022/03/24/qGChq0.png)](https://imgtu.com/i/qGChq0)

- beforecreate：el 和 data 并未初始化，this指向创建的实例，不能访问到data、computed、watch、methods上的方法和数据
- created：实例创建完成，可访问data、computed、watch、methods上的方法和数据，**未挂载到DOM，不能访问到$el属性**，$ref属性内容为空数组
- beforeMount：完成了 el 和 data 初始化，完成虚拟DOM配置
- mounted ：完成挂载，ajax请求
- beforeUpdate：根据data变化去更新虚拟DOM
- updated：将虚拟DOM更新完成的HTML更新到页面中
- beforeDestroy：销毁之前调用， 清除定时器，解绑方法等
- destroyed：销毁之后调用，之后再执行app.message= ‘hello vue’，页面不会同步更新。

**Vue3生命周期**

beforeDestroy和destroyed替换为beforeUnmount和unmounted

***

## **diff算法**

**比较只会在同层级进行, 不会跨层级比较。**

`sameVnode`函数就是看这两个节点是否值得比较，两个vnode的key和sel（节点选择器）相同才值得去比较它们

[![qcoGOe.png](https://s1.ax1x.com/2022/03/30/qcoGOe.png)](https://imgtu.com/i/qcoGOe)

***

## **渐进式框架**

就是框架分层，最核心的是视图层渲染，然后往外是组件机制，在此基础上再加入路由机制，再加入状态管理，最外层是构建工具

***

## **vue中的$nextTick**

- 只执行一次

在**下次 DOM 更新循环结束之后**执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM

***

## **自定义事件**

**始终使用 kebab-case 的事件名**

***

## **异步组件**

只在需要的时候才从服务器加载一个模块

***

## 初始化

```js
// vue2
let app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})

// vue3
let app = Vue.createApp({
    data () {
        return {
            message: 'Hello Vue!'
        }
    },
    methods: {}
}).mount("#app");
```

***

## Object.defineProperty缺点

1.  无法监听ES6的Set、Map变化
2.  无法监听Class类型的数据
3.  vm实例属性的新加或者删除也无法监听

```js
Vue.set(obj, attribute, value)
```

1. 数组元素的增加和删除也无法监听

***

## vue模板语法

- 双大括号语法进行文本插值

- v-bind绑定元素属性

***

## vue指令

- v-bind 动态绑定属性
- v-if 动态创建/删除
- v-show 动态显示/隐藏
- v-on:click 绑定点击事件
- v-for 循环遍历
- v-model 双向绑定表单
- v-html 将html文本渲染成html

***

## vue class&style 绑定

给class bind一个对象或数组	

```html
<div :class="classObject"></div>
```

```js
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

***

## vue 条件渲染

v-if    v-else 惰性，初始值为false时不渲染，为true才渲染

v-show 不支持添加到<template>元素，也不支持 v-else，无论什么情况都需要初始渲染，切换css style

***

## vue列表渲染

- `v-for` 还支持一个可选的第二个参数，即当前项的索引。
- 遍历数组（item, index）；遍历对象（value, key, index）；遍历对象时使用的是Object.keys()，不保证遍历的顺序

- 也可以用 `of` 替代 `in` 作为分隔符

***

## vue计算属性

```html
<li v-for="n in evenNumbers">{{ n }}</li>
```

```js
data : {
    numbers: [1, 2, 3, 4 5]
},
computed: {
    evenNumbers: function () {
        return this.numbers.filter((item) => item % 2 == 0)
    }
}
```

计算属性在嵌套的v-for循环中不适用，使用一个方法

```html
<ul v-for="set in sets">
  <li v-for="n in even(set)">{{ n }}</li>
</ul>
```

```js
data: {
    sets: [[1, 2, 3], [4, 5, 6]]
},
methods: {
    even: funtion (numbers) {
        return this.numbers.filter((item) => item % 2 == 0)
    }
}
```

***

## vue todo-list

```html
<div id="todo-list-example">
  <form @submit.prevent="addNewTodo">
    <label for="new-todo">Add a todo</label>
    <input 
           v-model="newTodoText"
           placeholder="eg. feed the cat">
    <button>Add</button>
  </form>
  <span v-if="!todos.length">Nothing</span>
  <ul>
    <li 
         <!-- 这里is=组件名 -->
        is="todo-item"
        v-for="(todo, index) in todos"
        :key="todo.id"
        :param="todo.title"
        @remove="todos.splice(index, 1)"
        ></li>
  </ul>
</div>
```

```js
Vue.component('todo-item', {
  template:'<li>{{param}}<button @click="$emit(\'remove\')">remove</button></li>',
  props: ['param']
})

let app = new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'do the dishes'
      },
      {
        id: 2,
        title: 'take trash'
      },
      {
        id: 3,
        title: 'open door'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo () {
      this.todos.push({
        id: this.nextTodoId + 1,
        title: this.newTodoText
      })
      this.newTodoText = ""
    }
  }
})

```

***

## vue事件处理器

- v-on 监听的方法无参数，形参可通过event获取原生事件对象；
- 监听的方法有参数，可以将$event传入方法代表触发事件的元素对象
- 直接写触发代码

**事件修饰符**

- .stop  阻止冒泡


- .self  事件发生在元素本身才触发


- .once  只触发一次


- .prevent  阻止行为

**按键修饰符**

@keyup.enter

***

## vue 表单控件绑定

**文本**

```html
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

**多行文本**

```html
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

**单个复选框，绑定到布尔值，选中时ischecked为true**

```html
<input type="checkbox" id="checkbox" v-model="ischecked">
<label for="checkbox"></label>
```

**多个复选框，绑定到数组，选中时，将value的值添加到数组checkList**

```html
<input type="checkbox" id="jack" value="jack" v-model="checkList">
<label for="jack"></label>
<input type="checkbox" id="jack" value="john" v-model="checkList">
<label for="john"></label>
<input type="checkbox" id="jack" value="mike" v-model="checkList">
<label for="mike"></label>
```

**单选按钮，绑定到变量，选中时，将value的值赋给变量name**

```html
<input type="radio" id="jack" value="jack" v-model="name">
<label for="jack"></label>
<input type="radio" id="jack" value="john" v-model="name">
<label for="john"></label>
<input type="radio" id="jack" value="mike" v-model="name">
<label for="mike"></label>
```

**select单选，绑定到变量，选中时，将option值赋给变量selected**

```html
<select v-model="selected">
    <option disabled value="">请选择</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
```

**select多选，绑定到数组，选中时，将option值添加到数组selected**

```html
<select v-model="selected" multiple>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
```

**表单修饰符**

- .lazy：默认情况下，`v-model` 在每次 `input` 事件触发后将输入框的值与数据进行同步，添加 `lazy` 修饰符，从而转为在 `change` 事件_之后_进行同步
- .number ：自动转换数值类型
- .trim ：去除首尾空格

***

## 计算属性

- 提供的函数将用作 property `vm.computedFunc` 的 **getter** 函数
- 基于响应式依赖值的缓存，只在相关响应式依赖发生改变是才重新求值
- 不能处理异步
- 计算属性默认只有 getter，但也可以提供一个 setter

```js
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```

## 监听属性

## fetch

## axios

## vue过滤器

- 过滤器可以用在两个地方：**双花括号插值和 `v-bind` 表达式**

- 局部过滤器和全局过滤器

```js
// 写在vue初始化里
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
// 全局过滤器
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

***

## Vue注册组件

```html
<div id="app-7">
  <ol>
    <!--
      父组件通过props将数据传到子组件
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```

```js
// 全局组件：定义名为 todo-item 的新组件，要先注册才能使用
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>这是个待办项</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: '蔬菜' },
      { id: 1, text: '奶酪' },
      { id: 2, text: '随便其它什么人吃的东西' }
    ]
  }
})
```

***

## 监听子组件事件

-  `$emit`方法]并传入事件名称来触发一个事件

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += 0.1"
></blog-post>
```

```js
<button v-on:click="$emit('enlarge-text')">
  Enlarge text
</button>
```

- 使用 `$emit` 的第二个参数抛出一个值，父组件通过$event访问抛出的值

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Enlarge text
</button>
```

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

- 抛出的值作为事件触发执行的函数的第一个参数

```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

***

## props属性验证和默认属性

```js
props：{
    parameter1：{
        type: String,
        default: ''
    }
}
```

***

## 支持v-model的自定义输入组件

```html
 <custom-input v-model="text"></custom-input>
<!-- 等价于-->
 <custom-input :value="text" @input="text = $event"></custom-input>
```

```js
Vue.component('custom-input', {
   // 这里value为custom-input中bind绑定的value
  props: ['value'],
  template: `<div>
  <!-- 这里将传进来的value绑定到原生input中的value属性，并利用$emit将input输入框中的值，即$event.target.value利用触发的input事件传给custom-input-->
  <input :value="value" @input="$emit('input', $event.target.value)">
  </div>
  `
})
```

***

## 动态组件

```html
<component v-bind:is="currentTabComponent"></component>
```

## 插槽slot

- **提高组件的可复用性，组件只是提供一个大致的框架，具体的内容可以通过slot将定制内容插入**
- **内容分发：混合父组件的内容与子组件自己的模板** 
- **父组件模板的内容在父组件作用域内编译，子组件模板内容在子组件作用域内编译*，通过slot将子组件中内容放在父组件中，可以访问到父组件中的变量，但同时也会导致整体结构不清晰**

- **单个插槽**

```html
<alert-box>
  Something bad happened.
</alert-box>
```

```js
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```

- **具名插槽**

```html
<alert-box>
  <div slot="first">Something bad happened.</div>
</alert-box>
```

```js
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot name="first"></slot>
    </div>
  `
})
```

## 新版slot

为具名插槽和作用域插槽引入了一个新的统一的语法 (即 `v-slot` 指令)

***

## 过渡

- **transition**组件给任何单个元素或组件添加进入/离开过渡

```html
 <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
```

```css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
```

- **transition-group**组件给列表添加进入/离开过渡，以一个真实元素包裹多个列表项，默认为span标签，可以通过tag属性更换为其他元素，要提供key值

***

## 自定义指令

- **对底层DOM操作进行封装**

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
// 注册局部自定义指令
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

### **钩子函数**

**inserted**：被绑定元素插入父节点时调用

**bind**：只调用一次，指令第一次绑定到元素时调用，用于初始化

**update**：所在组件的 VNode 更新时调用	

### 钩子函数参数

****

## vue渲染函数

```js
new Vue({
  router,
  store,
  // render函数的作用就是将App根vue组件渲染成DOM节点。
  render: h => h(App)
}).$mount('#app')
```

- h函数是hyperscript 的缩写，它的作用就是生成一个Vnode节点

- 其中h()接受三个参数，返回vNode节点

```js
// @returns {VNode}
h(
  // {String | Object | Function} tag
  // 一个 HTML 标签名、一个组件、一个异步组件、或
  // 一个函数式组件。
  //
  // 必需的。
  'div',

  // {Object} props
  // 与 attribute、prop 和事件相对应的对象。
  // 我们会在模板中使用。
  //
  // 可选的。
  {},

  // {String | Array | Object} children
  // 子 VNodes, 使用 `h()` 构建,
  // 或使用字符串获取 "文本 Vnode" 或者
  // 有插槽的对象。
  //
  // 可选的。
  [
    'Some text comes first.',
    h('h1', 'A headline'),
    h(MyComponent, {
      someProp: 'foobar'
    })
  ]
)
```

## this.$route和this.$router

### params和query区别

- query可以使用name或者path方式跳转，params只能用name来跳转
- query在url中显示参数，params不显示

```js
  this.$router.push({
        path: 'newApply',
        query: {
          type: item.key,
          typeDesc: item.value
        }
      })
      
   this.$router.push({
        name: 'newApply',
        params: {
          type: item.key,
          typeDesc: item.value
        }
      })
```

### this.$route 当前路由对象

在使用了 vue-router 的应用中，路由对象会被注入每个组件中，赋值为$route ，并且当路由切换时，路由对象会被更新。this.$route 表示当前路由对象，每一个路由都会有一个 $route对象，是一个局部的对象， $route，它是一条路由（可理解为当前页面的路由信息）。路由对象有以下属性：

#### 1.$route.path 

字符串，等于当前路由对象的路径，会被解析为绝对路径，如 "/home/news" 。

#### 2.$route.params 

对象，包含路由中的动态片段和全匹配片段的键值对。

#### 3.$route.query 

对象，包含路由中查询参数的键值对。例如，对于 /home/news/detail/01?favorite=yes ，会得到$route.query.favorite == ‘yes‘ 。

#### 4.$route.router 

路由规则所属的路由器（以及其所属的组件）。

#### 5.$route.matched 

数组，包含当前匹配的路径中所包含的所有片段所对应的配置参数对象。

#### 6.$route.name 

当前路径的名字，如果没有使用具名路径，则名字为空。

### this.$router 全局的路由器对象

this.$router 包含了很多属性和方法，任何页面都可以调。$router，是一组路由。$router可以理解为一个容器，或者说一种机制，它管理了一组 $route。简单来说， $route只是进行了URL和函数的映射，而在当接收到一个URL之后，去路由映射表中查找相应的函数，这个过程是由router来处理的。

#### props 属性

1、to

表示目标路由的链接。当被点击后，内部会立刻把to的值传到router-push()。

```vue
<router-link :to="‘home‘">/Home</router-link>
<router-link :to="{ path: ‘home' }">/Home</router-link>
```

//命名路由

```vue
<router-link :to="{ name: ‘user‘, params: {userId: 123} }">/user/123</router-link>
```

//带查询参数，下面的结果为/register?id=abc-->

```vue
<router-link :to="{ path: ‘register‘, query: {id: ‘abc‘}}">Register</router-link>
```

2、replace

设置replace属性当点击时，会调用roter.replace()而不是router.push()，导航后不会留下history记录，不能回退到上一个页面

```vue
<router-link :to="{path: '/abc‘}" replace>ABC</router-link>
```

3、append

设置append属性后，则在当前路径前添加基路径，例如，我们从/a导航到一个相对路径b，如果没有配置append，则路径为/b，如果配了，则为/a/b

```vue
<router-link :to="{path: '/abc‘}" append>ABC</router-link>
```

4、tag

想要router-link渲染成某种标签，例如span。于是我们使用tag prop 类指定何种标签，同样它还是会监听点击，触发导航。

```vue
<router-link to="/foo" tag="span">ABC</router-link>
```

#### 方法

1、push() 方法：

想要导航到不同的 URL，则使用 router.push 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。

```js
// 字符串
this.$router.push('home')
// 对象
this.$router.push({path:'home'})

// 命名的路由
this.$router.push({name:'user', params:{userId: '123'}})
//带查询参数，变成 /register?plan=private
this.$router.push({path:'register', query:{plan:private}})
```

注意：如果提供了 path，params 会被忽略，上述例子中的 query 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 name 或手写完整的带有参数的 path：

```js
let userId = '123';
this.$router.push({path:`/user/${userId}`});  
//->/user/123
this.$router.push({name:'user', params:{userId}});  
//->/user/123
//这里的 params 不生效
this.$router.push({path:'/user', params:{userId}}); 
//->/user
```

2、back()方法，后退一步

```js
this.$router.back();
```

3、forward()方法，前进一步

```js
this.$router.forward();
```

4、go()方法 可前进可后退

```js
// 后退一步
this.$router.go(-1)
// 前进两步，但当步数大于历史记录数，就会无效，是无效，而不是取一个最大值
this.$router.go(2)
//刷新页面
this.$router.go(0)
```

***

## vue-router

**router-view**：路由容器，name属性为为一个页面中不同的router-view渲染不同的组件

```js
this.$router.push({
    name: 'componentname',  // 组件名
    params: {
        id
    }
})
```

**router-link**：路由跳转

## 嵌套路由

```js
children: [
      {
        path: '/about/children',
        component: ChildrenUser
      }
    ],
```

## 编程式导航和声明式导航

- 声明式导航：如a链接，router-link，声明式地写出跳转的页面

- 编程式导航：通过location.href、this.$router.push进行页面跳转

## 动态路由

1. 在 '/router/index.js' 中配置动态路由
2. 通过this.route.params.id获取到跳转的页面id

```js
routes = [
    {
        path: 'detail/:id',
        component: ...
    }
]
```

```js
this.router.push(`/detail/${id}`)
```

***

1. 利用router-link跳转同时通过query传递参数
2. 通过this.route.query.id获取跳转页面id

```js
<router-link :to="{ path: '/movieDetail', query: { id: id } }">
```

***

## 命名路由

路由的name属性，通过name属性进行跳转

```js
this.$router.push({
    name: 'routername',
    params: {
        id
    }
})
```

## 全局路由拦截

路由跳转之前进行拦截

beforeEach

## 路由懒加载

路由被访问时才加载对应组件

```js
// 将
// import UserDetails from './views/UserDetails'
// 替换成
const UserDetails = () => import('./views/UserDetails')
```

## swiper初始化过早

1. 给swiper绑定一个动态值，这个值变化时会触发diff更新节点

```html
<swiper :key="datalist.length">
</swiper>
```

2. swiper中有一个observer属性，在observe:true时，当我们修改swiper的子元素时，会自动初始化swiper，并该指令一般情况下搭配 observeParents:true,一起使用 即当Swiper的父元素变化时，会更新swiper。

```js
new Swiper(".mySwiper_1", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    observer: true,//解决swiper初始化时dom元素还没有加载完成造成的不能轮播
    observeParents: true,//解决swiper初始化时dom元素还没有加载完成造成的不能轮播
    initialSlide :4,
    coverflowEffect: {
        rotate: 40,
        stretch: 0,
        depth: 50,
        modifier: 1,
        slideShadows: true,
    },
});
```

***

## 引入外部css

1. 在index.html中利用link标签引入
2. 利用模块化方式import引入

## router-view

App.vue使用router-view进行路由管理

router-view部分会被routes中的路由下的组件替换

```html
<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>
```

## 请求数据

1. 解决跨域问题
2. 请求**Request URL**返回"{\"status\":-1,\"msg\":\"api not available\"}"，可能网站除了跨域限制，还会进行header或cookie校验，导致无法请求到数据
3. 可以在发送请求时添加header字段

## 吸顶效果

```scss
div {
    position: sticky;
    top: 0px;
}
```

## 轮播冲突

给不同的轮播加不同的类名即可

## iconfont阿里矢量图标库

## betterScroll

## elementUI

## vant

## 数据懒加载

- 分多次请求多条数据
- 当列表即将滚动到底部时，触发事件并加载更多的列表项

## loading加载

## axios拦截器

### 持久化
