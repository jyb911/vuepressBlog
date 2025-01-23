###### **GET和POST区别**

[![qkSI74.png](https://s1.ax1x.com/2022/03/18/qkSI74.png)](https://imgtu.com/i/qkSI74)

GET产生一个TCP数据包；POST产生两个TCP数据包。

- 对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200（返回数据）；


- 对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok（返回数据）。

post长度可以通过服务器进行限制

- 当携带参数的时候，我们都知道`GET`请求是放在`url`中，`POST`则放在`body`中，但这只是约定，并不属于`HTTP`规范，相反的，我们可以在`POST`请求中`url`中写入参数，或者`GET`请求中的`body`携带参数
- get性能更好