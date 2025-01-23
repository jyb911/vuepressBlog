## http请求

- http请求包括：请求行、请求头部、空行、请求体

```http
GET /home.html HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/testpage.html
Connection: keep-alive
Upgrade-Insecure-Requests: 1
If-Modified-Since: Mon, 18 Jul 2016 02:36:04 GMT
If-None-Match: "c561c68d0ba92bbeb8b0fff2a9199f722e3a621a"
Cache-Control: max-age=0
```

- http响应包括：响应行、响应头部、空行、响应体

```http
HTTP/1.1 200 OK
Server: nginx/1.14.0
Date: Tue, 09 Aug 2022 08:13:37 GMT
Content-Type: text/html
Transfer-Encoding: chunked
set-cookie: PHPSESSID=4822585534a528cc79632525787e7c10; path=/; max-age=604800; expires=Tue, 16 Aug 2022 08:13:37 GMT; domain=.segmentfault.com
x-frame-options: SAMEORIGIN
x-xss-protection: 1; mode=block
x-content-type-options: nosniff
x-download-options: noopen
x-readtime: 73
X-Hit: web-misc
Content-Encoding: gzip
```

![qkEzHx.png](https://s1.ax1x.com/2022/03/18/qkEzHx.png)

## http头部

- **通用首部字段**

| 首部字段          | 说明                                             |
| ----------------- | ------------------------------------------------ |
| **Cache-Control** | 控制缓存行为                                     |
| Connection        | 逐跳首部、连接管理keep-alive                     |
| Date              | 创建报文时间                                     |
| **Pragma**        | 只用于客户端请求所有的中间服务器不返回缓存的资源 |
| Transfer-Encoding | 报文主体的编码方式                               |
| Upgrade           | 升级为其他协议                                   |
| Via               | 代理服务器信息                                   |
| Warning           | 错误通知                                         |

- **请求首部**

| 首部字段              | 说明                       |
| --------------------- | -------------------------- |
| Accept                | 用户代理可以处理的媒体类型 |
| Accept-Charset        | 优先的字符集               |
| Accept-Encoding       | 优先的内容编码             |
| Authorization         | Web认证信息                |
| Except                | 期待服务器的特定行为       |
| **If-None-Match**     | 比较实体标记（ETag）       |
| **if-Modified-Since** | 比较资源的更新时间         |
| Range                 | 实体的字节范围请求         |
| Refer                 | 实体的字节范围请求         |
| TE                    | 传输编码的优先级           |
| User-Agent            | HTTP客户端程序的信息       |

- **响应头部**

| **首部字段**       | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| Accept-Ranges      | 是否接受字节范围请求                                         |
| Age                | 推算资源创建经过的时间                                       |
| **ETag**           | 资源的匹配信息                                               |
| Location           | 令客户端重定向至指定URI                                      |
| Proxy-Authenticate | 代理服务器对客户端的认证信息                                 |
| WWW-Authenticate   | 服务器对客户端的认证信息                                     |
| Server             | HTTP**服务器的安装信息**。客服端在与哪种类型的服务器进行交互 |
| Vary               | 代理服务器的管理信息                                         |

- 实体首部字段

| **首部字段**      | 说明                   |
| ----------------- | ---------------------- |
| Allow             | 资源可支持的HTTP方法   |
| Content-Encoding  | 实体主体适用的编码方式 |
| Content-Language  | 实体主体的自然语言     |
| Content-Length    | 实体主体的大小         |
| Content-Location  | 替代对应资源的URI      |
| Content-MD5       | 实体主体的报文摘要     |
| Content-Range     | 实体主体的位置范围     |
| **Content-Type**  | 实体主体的媒体类型     |
| **EXpires**       | 实体主体过期的日期时间 |
| **Last-Modified** | 资源的最后修改日期时间 |

**通用头域**

**Cache-Control: 缓存头域 => 常见值为no-cache(不允许缓存), no-store(无论请求还是响应均不允许缓存), max-age(规定可以客户端可以接受多长生命期的数据)**
**Keep-Alive: 使得服务端和客户端的链接长时间有效**
**Date: 信息发送的时间**
**Host: 请求资源的主机IP和端口号**
**Range: 请求资源的某一部分**
**User-Agent: 发出请求的用户的信息(鉴权)**

***

## http状态码

![qkASMR.png](https://s1.ax1x.com/2022/03/18/qkASMR.png)

![qkAidK.png](https://s1.ax1x.com/2022/03/18/qkAidK.png)

***

## HTTP/1.0，1.1，2.0，3.0

**HTTP/1.0**

默认使用**短连接**，每次请求都需要建立一个TCP连接。它可以设置Connection: keep-alive 这个字段，强制开启长连接。

**HTTP/1.1**

- 引入了**长连接**，即TCP连接默认不关闭，可以被多个请求复用。

- **缓存处理**，引入了更多的缓存处理策略
- 带宽优化，头域引入了range，允许请求部分资源
- Host头域，传递主机名

**HTTP/2.0**

- 二进制协议，1.1版本的头信息是文本（ASCII编码），数据体可以是文本或者二进制；2.0中，头信息和数据体都是二进制。
- 完全多路复用，在一个连接里，客户端和浏览器都可以同时发送多个请求或回应，而且不用按照顺序一一对应。
- 头部压缩，HTTP协议不带有状态，每次请求都必须附上所有信息。Http/2.0引入了头信息压缩机制，使用gzip或compress压缩后再发送。
- 服务端推送，允许服务器未经请求，主动向客户端发送资源。

**HTTP/3.0**

- 传输层使用UDP

## HTTP与HTTPS

http明文传播的三个风险：

1. 窃听风险
2. 篡改风险
3. 冒充风险

- https协议需要CA申请证书

- http协议运行在TCP协议之上,传输的内容都是明文传送,安全性较差,而https则是运行在SSL（secure socket layer）/TLS（transport layer security）层之上, 而SSL/TLS层是运行在TCP层之上,https传输的内容都是经过加密的,安全性较高

- http与https使用不同的连接方式.其中http默认用的是80端口,而https默认用的是443端口

### HTTPS流程

[![qkJW2n.md.png](https://s1.ax1x.com/2022/03/18/qkJW2n.md.png)](https://imgtu.com/i/qkJW2n)

1. 客户端向服务器发送随机数A，协议版本和加密方法
2. 服务端确认协议版本和加密方法，发送随机数B和数字证书
3. 客户端验证证书，使用服务端公钥加密随机数C，并发送握手结束通知（前面所有内容的hash值供服务端校验），编码改变通知
4. 服务端用私钥解密获得随机数C，并发送握手结束通知（前面所有内容的hash值供客户端校验），编码改变通知
5. 之后双方利用ABC生成对称密钥用于加解密

### 数字签名和数字证书

[![qktfBV.md.png](https://s1.ax1x.com/2022/03/18/qktfBV.md.png)](https://imgtu.com/i/qktfBV)

- 本来可以用自己的私钥也可以签名，对方用公钥解开来验证身份，但公钥在交换的过程中可能被替换，所以就需要CA颁发证书来保证公钥没有被替换，而CA的公钥也是由上级CA保证的，这种关系一直到根证书，根证书没有上级CA，自签名保证准确性，通过操作系统分发，出厂时内置在操作系统中