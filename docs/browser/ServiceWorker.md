# Service Worker

`Service Worker`是浏览器在后台独立于网页运行的、用JavaScript编写的脚本，可以拦截HTTP请求

## **原理**

```javascript
// 不起眼的一行if，除了防止报错之外，也无意间解释了PWA的P：
// 如果浏览器不支持Service Worker，那就当什么都没有发生过
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        // 所以Service Worker只是一个挂在navigator对象上的HTML5 API而已
        navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
            console.log('我注册成功了666');
        }, function (err) {
            console.log('我注册失败了');
        });
    });
}
```

```js
// service-worker.js
// 虽然可以在里边为所欲为地写任何js代码，或者也可以什么都不写，
// 都不妨碍这是一个Service Worker，但还是举一个微小的例子：
self.addEventListener('fetch', function (event) {
    if (/\.png$/.test(event.request.url)) {
        event.respondWith(fetch('/images/支付宝收款码.png'));
    }
});

```

1. 首次导航到网站时，会下载、解析并执行Service Worker文件，触发install事件，尝试安装Service Worker，如果install事件回调函数中的操作都执行成功，标志Service Worker安装成功，此时进入waiting状态
2. 当用户二次进入网站时，才会激活Service Worker，此时会触发activate事件，标志Service Worker正式启动，开始响应fetch、post、sync等事件。

***

## **Service Worker主要事件**

- install：Service Worker安装时触发，通常在这个时机缓存文件。

- activate：Service Worker激活时触发，通常在这个时机做一些重置的操作，例如处理旧版本Service Worker的缓存。

- fetch：浏览器发起HTTP请求时触发，通常在这个事件的回调函数中匹配缓存，是最常用的事件。

- push：顾名思义，和推送通知功能相关

- sync：顾名思义，和后台同步功能相关

***

## **Service Worker应用**

- 缓存静态资源

利用CacheStorage API来缓存js、css、字体、图片等静态文件。我们可以在Service Worker的install阶段，指定需要缓存的具体文件，在fetch事件的回调函数中，检查请求的url，如果匹配了已缓存的资源，则不再从服务端获取，以此达到提升网页性能的目的

- 离线体验

缓存页面实现离线查看，但访问的总是缓存过的页面，不能获取到新页面，可以再activate阶段重置缓存；或者离线时返回一个离线页面

