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

## this.$route和this.$router

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

## 