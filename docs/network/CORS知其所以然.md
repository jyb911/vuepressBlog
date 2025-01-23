## 同源策略

- 默认阻止跨域获取资源

## CORS

- CORS：Cross-Origin Resource Sharing （跨域资源共享），它由一系列传输的HTTP 头组成，这些 HTTP 头决定浏览器是否阻止前端 JavaScript 代码获取跨域请求的响应，所以通过配置CORS对应规则，跨域请求就可以正常进行。

### cors头

- Access-Control-Allow-Origin：指示请求的资源可以共享给哪些域
- Access-Control-Allow-Credentials：指示当请求凭证为true时是否响应该请求
- Access-Control-Allow-Headers：用在预检请求的响应中，指示实际请求可以使用哪些HTTP头
- Access-Control-Allow-Methods：用在预检请求的响应中，指示实际请求可以使用哪些请求方法
- Access-Control-Expose-Methods：指示哪些 HTTP 头的名称能在响应中列出
- Access-Control-Max-Age：预检请求结果能被缓存多久
- Access-Control-Request-Headers：用于发起一个预检请求，告知服务器正式请求会使用那些 HTTP 头
- Access-Control-Request-Methods：用于发起一个预检请求，告知服务器正式请求会使用那些 请求方法
- Origin：指示获取资源的请求是从什么域发起的

## 跨域请求流程

### 简单请求

- 请求方法是HEAD/GET/POST
- 请求体文件类型只能是form-urlencoded、form-data、text/plain

#### 请求过程

1. 浏览器发起请求，自动加上请求来源Origin给服务器检查
2. 服务器返回数据，并返回检查结果，配置CORS响应头
3. 浏览器检查CORS响应头，如果包含当前源就放行，反之拦截

### 复杂请求

#### 请求过程

1. 浏览器使用 OPTIONS 方法发起预检请求，预检请求报文中的 Access-Control-Request-Method首部字段告知服务器实际请求所使用的 HTTP 方法；Access-Control-Request-Headers 首部字段告知服务器实际请求所携带的自定义首部字段，并自动加上请求来源Origin
2. 服务器返回检查结果，配置Access-Control-Allow-Origin、Access-Control-Allow-Methods、Access-Control-Allow-Headers、Access-Control-Max-Age等http头部字段
3. 浏览器发起真正请求
4. 服务器返回数据

### 携带身份凭证的请求

- 预检请求不能包含凭证
- 预检请求的响应必须指定Access-Control-Allow-Credentials为true来表明实际请求可以携带凭证进行请求
- 在响应附带身份凭证的请求时：
  - 服务器不能将 `Access-Control-Allow-Origin` 的值设为通配符“`*`”，而应将其设置为特定的域，如：`Access-Control-Allow-Origin: https://example.com`。
  - 服务器不能将 `Access-Control-Allow-Headers` 的值设为通配符“`*`”，而应将其设置为首部名称的列表，如：`Access-Control-Allow-Headers: X-PINGOTHER, Content-Type`
  - 服务器不能将 `Access-Control-Allow-Methods` 的值设为通配符“`*`”，而应将其设置为特定请求方法名称的列表，如：`Access-Control-Allow-Methods: POST, GET`

## CSRF

- CSRF：Cross Site Request Forgery （跨站请求伪造）

[![vr6hND.jpg](https://s1.ax1x.com/2022/08/19/vr6hND.jpg)](https://imgse.com/i/vr6hND)

1. 用户登录受害网站，把获取的身份凭证保存在浏览器的cookie中
2. 用户用同一浏览器访问黑客网站，黑客网站向受害网站服务器发起一个恶意请求，浏览器自动从cookie中取出身份凭证，把它带上
3. 受害网站服务器发现身份凭证，恶意请求成功

***

> 以下出自美团技术团队博客

[前端安全系列（二）：如何防止CSRF攻击？]: https://tech.meituan.com/2018/10/11/fe-security-csrf.html

### 常见攻击类型

#### get类型

```html
<img src="http://bank.example/withdraw?amount=10000&for=hacker" > 
```

- 受害者访问含有这个img 的页面时，浏览器会自动向目标服务器发送http请求

#### post类型

```html
<form method="POST" action="https://mail.google.com/mail/h/ewt1jmuj4ddv/?v=prf" enctype="multipart/form-data"> 
    <input type="hidden" name="cf2_emc" value="true"/> 
    <input type="hidden" name="cf2_email" value="hacker@hakermail.com"/> 
    .....
    <input type="hidden" name="irf" value="on"/> 
    <input type="hidden" name="nvp_bu_cftb" value="Create Filter"/> 
</form> 
<script> 
    document.forms[0].submit();
</script>
```

- 这个页面只要打开就会自动向Gmail发送请求，并且携带浏览器内的用户登录凭证，Gmail后台验证通过

#### 链接类型

```html
  <a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
  重磅消息！！
  <a/>
```

- 用户点击就会自动发送请求

### 两种防护策略

针对CSRF的两个特点即，：

- 通常发生在第三方域名
- 攻击者只能冒用cookie等信息，无法获取

#### 阻止不明外域的访问

##### 同源检测

- HTTP头部 Origin和Referer
- Origin表示请求来源的域名
- Referer表示请求来源的页面地址
- 阻止外域发起请求

##### Samesite Cookie

- 为Set-Cookie响应头新增Samesite属性来表明这个Cookie是一个同站Cookie，同站Cookie不能作为第三方Cookie
- Samesite属性值：Strict和Lax分别代表严格和宽松模式
- 严格模式下，Cookie不会被包含在请求头中作为第三方Cookie
- 宽松模式下，假如这个请求是这种请求（改变了当前页面或者打开了新页面比如a链接）且同时是个GET请求，则这个Cookie可以作为第三方Cookie
- 不支持子域，当网站有多个子域名时，不能使用SamesiteCookie在主域名存储用户登录信息。每个子域名都需要用户重新登录一次

```
Set-Cookie: foo=1; Samesite=Strict
Set-Cookie: bar=2; Samesite=Lax
Set-Cookie: baz=3
```

#### 提交时需要附加本域才能获取的信息

##### CSRF Token

- 为用户请求携带一个攻击者无法获取到的Token
- 用户打开页面时，服务器给用户生成一个Token，一般Token包括随机字符和时间戳的组合，保存在服务器Session中，之后在每次页面加载时，对DOM中所有的a和form标签中的src都加入Token
- 用户在请求是会自动携带这个Token，服务器收到请求会判断Token的时效性并解密进行对比，攻击者无法模拟这个Token

###### 分布式校验

使用Session存储在CSRF Token会带来很大服务器压力，而分布式环境下，用户多次请求可能是不同的服务器，这就需要Session共享，将Session存储在Redis之类的公共存储空间

Encrypted Token Pattern：Token不是随机生成，而是使用UserID、时间戳和随机数通过加密生成，不需要存储在Session中用于校验

##### 双重Cookie验证

- 由于攻击者无法获取Cokie内容，可以让Ajax和表单请求携带一个Cookie的值



### 