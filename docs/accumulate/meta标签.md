## meta

- 元
- meta tag，文档元数据元素之一，表示不能由其他元数据元素表示的信息（其他元数据元素包括base、head、link、style、title）

## 属性

- name
- http-equiv
- charset
- itemprop

## name

- name取值：author、description、keywords、viewport、robots、rerender

### author

```html
<meta name="author" content="jack">
```

### description

```html
<meta name="description" content="a shopping page">
```

### keywords

- 页面关键词，使用逗号分隔

```html
<meta name="keywords" content="shopping buy">
```

### viewport

- 设置视口初始大小，目前仅用于移动设备

```html
<meta name="viewport" content="width-device-width, initial-scale=1.0">
```

### robots

- 设置爬虫对当前页面的处理行为

- content为none：搜索引擎忽略此网页
- content为index：搜索引擎索引此网页
- content为follow：搜索引擎继续通过此网页的链接搜索其他网页
- content为all：搜索引擎索引此网页，并继续检索网页内的链接

```html
<meta name="robots" content="all">
```

### renderer

- 指定双核浏览器的渲染方式

```html
<meta name="renderer" content="webkit"> <!-- 默认webkit内核 -->
```

### referrer

- 监管哪些访问来源信息会在 `Referer`中发送
- content为no-referer：访问来源信息不随请求一起发送

```html
<meta name="renderer" content="no-referer">
```



## http-equiv

### X-UA-Compatible

- IE浏览器适配

### content-type

- 声明文档类型和字符集

```html
<meta http-equiv="content-type" content="text/html; charset=utf-8">
```

### x-dns-prefetch-control

- HTML页面的a标签会自动启用DNS预解析来提升网站性能，但在使用https协议的网站会失效，可以设置打开对a的预解析

```html
<meta http-equiv="x-dns-prefetch-control" content="on">
```

