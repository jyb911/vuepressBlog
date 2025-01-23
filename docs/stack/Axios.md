## 主要功能

- 在服务端使用node.js的http模块，浏览器端使用XMLHttpRequest
- 拦截请求
- 取消请求
- 转换请求

## API

- axios(config)
- config对象配置请求的方法，url和携带的数据

```js
// 发起一个post请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

- 也可以直接使用请求方式别名，请求方法和url放在config外面，请求方法有get、post、put、delete、request、head、patch、options

```js
axios.post(url[, data[, config]])
```

## Axios 实例

- 为什么需要创建axios实例
- 创建不同的实例进行不同的配置，从而去请求不同的接口，比如不同接口的超时时长不同，所以axios实例应当配置不同的timeout参数

```js
axios.create([config])
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
```

## 请求配置

## 响应结构

## 默认配置

## 拦截器interceptor

## 错误处理

## 取消请求

- fetch API的AbortController接口
- 使用AbortSignal对象完成和请求的通信
- AbortController.signal属性是一个AbortSignal对象
- AbortController.abort()方法通过signal与请求通信，中止一个未完成的请求

```js
let controller = new AbortController()
let signal = controller.signal
fetch(url, {signal}).then()
// 调用abort方法取消请求
controller.abort()

// axios中的使用很相似
axios.get(url, {signal}).then()
controller.abort()
```



## 请求体编码