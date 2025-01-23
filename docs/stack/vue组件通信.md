## props/$emit

- 父组件通过`props`的方式向子组件传递数据，而通过`$emit` 子组件可以向父组件通信
- props是单向数据流，只能从父组件传到子组件，且不可以被修改

## $children/$parent

- $children为子组件数组，$parent为父组件
- 边界条件为根实例的$parent为new Vue()实例，这个实例的$parent为undefined；
- 最底层子组件的$children为空数组

## ref

通过ref引用子组件，并通过refs.ref访问子组件实例

```vue
// 父组件 app.vue

<template>
  <component-a ref="comA"></component-a>
</template>
<script>
  export default {
    mounted () {
      const comA = this.$refs.comA;
      console.log(comA.name);  // Vue.js
      comA.sayHello();  // hello
    }
  }
</script>
```

## v-model（本质上还是第一种）

- 父组件通过v-model给子组件传递值时，会自动传递一个value的props属性，在子组件中通过this.$emit(‘input’,val)自动修改v-model绑定的值

***

**以上为父子组件通信**

## provide/reject

- 父组件调用provide提供数据
- 子组件或非子组件调用inject注入提供的数据

## eventBus

- 先注册事件总线（vue实例）
- EventBus.$emit和EventBus.$on通过设定的事件发送和收数据

- 全局定义

```js
//方式一
Vue.prototype.$EventBus = new Vue();
//方式二
window.eventBus = new Vue();
```

- 触发事件

```javascript
//使用方式一定义时
this.$EventBus.$emit('eventName', param1,param2,...)
//使用方式二定义时
EventBus.$emit('eventName', param1,param2,...)
```

- 监听事件

```js
//使用方式一定义时
this.$EventBus.$on('eventName', (param1,param2,...)=>{
    //需要执行的代码
})
//使用方式二定义时
EventBus.$on('eventName', (param1,param2,...)=>{
    //需要执行的代码
})
```

- 移除事件

```js
//使用方式一定义时
this.$EventBus.$off('eventName');
//使用方式二定义时
EventBus.$off('eventName');
```

***



## Vuex

- 解决了**多个视图依赖于同一状态**和**多个视图的行为需要变更同一状态**的问题
- 将精力集中在数据更新而不是数据传递上去

## localStorage/sessionStorage

- window.localStorage.getItem/window.localStorage.setItem存取数据
- 数据和状态比较混乱，不易维护
- 可以结合vuex实现数据的持久保存，同时解决数据状态混乱问题

## $attrs/listeners（隔代通信）

- 默认情况下，父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)，将会“回退”且作为普通的HTML特性应用在子组件的根元素上，通俗地讲就是父组件中的属性传递到子组件中的props，再通过$attrs往下传递时只会传递除子组件props之外的数据，子组件通过v-on="$listeners"监听孙组件的事件，相当于作为父组件和孙组件之间的一个传话筒

## 兄弟组件通信

- 中间人模式：利用父组件作为中间人传递数据

## 注意

- props中父组件传来的属性不允许子组件随意修改，组件内部的状态（data中的变量）可以随意修改
