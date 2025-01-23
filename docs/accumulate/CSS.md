## 块、行内和行内块

**块级元素特点：**

1. 独自占用一行
2. 可以设定宽度和高度
3. 默认宽度是父元素的宽度，默认的高度是内容高度。**而内容高度主要是被内容原本的高度或行高撑起来的**

常见的块级元素有哪些？div   p   h1~h6  ul  ol  li  dl  dt  dd

**行内元素的特点：**

1. 不独占一行，并列显示
2. 不可以设定宽度或者高度
3. 默认宽度和高度是内容宽度和高度

常见的行内元素有哪些？   a  span   em  I   del  br  label

**行内块元素的特点：**

1. 可以设定宽度和高度
2. 可以和其它行内元素或者行内块元素并列显示（共处一行）行内块元素之间出现空白间隙是因为，元素被当成行内元素排版的时候，元素之间的空白符（空格、回车换行等）都会被浏览器处理，根据white-space的处理方式（默认是normal，合并多余空白），原来HTML代码中的回车换行被转成一个空白符，所以元素之间就出现了空隙。

常见的行内块元素有哪些？  Input   img  td

***

## **水平垂直居中**

`position` 子元素宽高已知 绝对定位+margin反向偏移

```css
    position: absolute;
    left: 50%;  /*相对于父元素*/
    top: 50%;
    margin: -100px 0 0 -50px; /*相对于子元素的宽高*/
```

position` 子元素宽高未知，绝对定位+transform: translate(-50%, -50%);

```css
    position: absolute;
    left: 50%;   /*相对于父元素*/
    top: 50%;
    transform: translate(-50%, -50%);  /*相对于子元素的宽高*/
```

`flex` 

```css
  display: flex;
  justify-content: center; /*使子项目水平居中*/
  align-items: center; /*使子项目垂直居中*/
```

div使用绝对布局，设置margin:auto;并设置top、left、right、bottom的值相等即可

- `margin: auto` 解决了 让一个 **正常布局流**中固定宽度的 **块** 元素 **水平** 居中* 的问题

```css
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
```

使用相对定位，先margin：0 auto实现水平居中再利用transform：translateY实现垂直居中

```css
  position: relative;
  top:50%;
  transform:translateY(-50%);
  margin: auto;
```

使用行内块元素text-align：center实现水平居中，vertical-align：middle实现垂直居中，行内块元素注意处理空白间隙

```css
    position: relative;
    top:50%;
    margin: 0 auto;
    transform: translateY(-50%);


.warp:after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
    margin-left: -0.25em;
    /* To offset spacing. May vary by font */
}

```

***

## **flex布局**

弹性盒子由弹性容器和弹性子元素组成，弹性子元素在一行内显示，弹性容器一行只有一个

display: flex; 

flex-direction: row/column;设置子元素按行或列排列

justify-content: center/flex-start/flex-end/space-between/space-around/space-evenly;

- center：flex 子元素在 flex 容器中居中排列
- flex-start：从 flex 容器的起始位置开始排列元素
- flex-end： 从 flex 容器的终止位置开始排列元素
- space-between：项目间保留一定间距地沿主轴居中排列，边缘元素贴近容器边沿
- space-around：头尾两个项目不会紧贴容器边缘，所有项目之间的空间均匀排布
- space-evenly：头尾两个项目不会紧贴容器边缘，所有项目之间的空间均匀排布

`align-items` 属性用来定义 flex 子元素沿交叉轴的对齐方式

- `flex-start`：从 flex 容器的起始位置开始对齐项目
- `flex-end`：从 flex 容器的终止位置开始对齐项目
- `center`：把项目居中放置
- `stretch`：拉伸项目，填满 flex 容器
- `baseline`：沿基线对齐

`flex-wrap` 属性使项目换行展示

子元素属性：

​	flex-shrink元素压缩，默认值为1，即等比例压缩，值为0时不压缩

​	flex-grow元素扩张，默认值为0，不扩张，值为1时扩张

​	`flex-basis` 属性定义了在使用 CSS 的 `flex-shrink` 或 `flex-grow` 属性对元素进行调整前，元素的初始大小。

​	盒子只设置高度没有宽度，它就显示不出来；只设置宽度，没有高度，它会默认保持父盒子的高度

​	`flex-grow`、`flex-shrink` 和 `flex-basis` 属性可以在 `flex` 中一并设置，即flex：flex-grow flex-shrink flex-basis；

​	order确定子元素的顺序

​	align-self调整子元素自身的对齐方式，覆盖父元素align-items属性值

***

## **绝对定位、相对定位**

相对定位是“相对于”元素在文档中的初始位置，

**绝对定位是“相对于”最近的已定位祖先元素，如果不存在已定位的祖先元素，那么“相对于”最初的包含块。**

绝对定位的框与文档流无关，可以覆盖页面上的其它元素

Z-index 仅能在定位元素上奏效

***

## **元素百分比**

- margin相对于父容器宽度
- width是相对于直接父元素的width
- height是相对于直接父元素的height
- padding是相对于直接父元素的width

***

## **BFC(Block Formatting Contexts)**块级格式化上下文

**一个BFC区域包含创建该上下文元素的所有子元素，但是不包括创建了新的BFC的子元素的内部元素，BFC是一块独立的渲染区域，可以将BFC看成是元素的一种属性，拥有了这种属性的元素就会使他的子元素与世隔绝，不会影响到外部其他元素**

### BFC特性

- 不与float元素重合

### 怎样创建BFC

- overflow：hidden
- position：absolute或fixed
- float不为none
- display为inline-block或inline-table或flex

***

## 标准盒模型和怪异盒模型

标准盒模型：**一个块的总宽度= width + margin(左右) + padding(左右) + border(左右)**

```css
box-sizing: content-box;
```

怪异盒模型：**一个块的总宽度= width + margin(左右)（即width已经包含了padding和border值）**

```css
box-sizing: border-box;
```

***

## 布局

### 单列布局

#### 一栏布局

- header,content和footer等宽
- 如设置width：1000px，当屏幕宽度小于1000px，会出现滚动条

```css
div {
    max-width: 1000px;
    margin: auto;
}
```

#### 通栏布局

- header与footer等宽,content略窄

### 双栏布局

- 自适应布局：一列由内容撑开，另一列撑满剩余宽度

#### float + overflow: hidden

- overflow: hidden用于构造BFC，不会重叠浮动元素；zoom: 1触发haslayout属性

```css
.left {
  float: left;
  margin-right: 100px;
}
.right {
  overflow: hidden;
  zoom: 1;
}
```

#### flex布局

- flex：1，flex-grow: 1，占据剩余空间

```css
.parent {
  display: flex;
}  
.right {
  margin-left: 20px; 
  flex: 1; 
}
```

#### grid布局

- grid-template-columns：auto 1fr（fr表示等分网格容器中的可用空间）auto表示列的大小由容器的大小和列中网格元素内容的大小决定

```css
.parent {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 200px;
}
```



### 三栏布局

#### 圣杯布局

- 给最外层大容器设置padding-left和padding-right，为两边栏留下空间
- 三栏顺序为中左右，均为浮动
- 先将中间栏宽度设为100%
- 再利用margin-left和相对定位将两边栏定位到两边

```html
  <article class="container">
    <div class="center">
      <h2>圣杯布局</h2>
    </div>
    <div class="left"></div>
    <div class="right"></div>
  </article>

```

```css
  .container {
    /*为两边栏腾出空间*/
    padding-left: 220px;
    /*这里padding-right无效，会报invalid property value*/
    padding-right: 220px;
  }
  .left {
    float: left;
    width: 200px;
    height: 400px;
    background: red;
    margin-left: -100%;
    position: relative;
    left: -220px;
  }
  .center {
    float: left;
    width: 100%;
    height: 500px;
    background: yellow;
  }
  .right {
    float: left;
    width: 200px;
    height: 400px;
    background: blue;
    margin-left: -200px;
    position: relative;
    right: -220px;
  }

```



#### 双飞翼布局

```html
    <article class="container">
        <div class="center">
            <div class="inner">双飞翼布局</div>
        </div>
        <div class="left"></div>
        <div class="right"></div>
    </article>
```

```css
    .container {
        min-width: 600px;
        /*确保中间内容可以显示出来，两倍left宽+right宽*/
    }
    .left {
        float: left;
        width: 200px;
        height: 400px;
        background: red;
        margin-left: -100%;
    }
    .center {
        float: left;
        width: 100%;
        height: 500px;
        background: yellow;
    }
    .center .inner {
        margin: 0 200px; //新增部分
    }
    .right {
        float: left;
        width: 200px;
        height: 400px;
        background: blue;
        margin-left: -200px;
    }

```

***

## zoom&translate: scale

|                      |             zoom             |             translate: scale             |
| :------------------: | :--------------------------: | :--------------------------------------: |
|        兼容性        |             所有             |                   IE9+                   |
|         取值         |          只能取正值          |                可以取负值                |
|       缩放方向       |     相对于页面左上角缩放     | 相对于页面居中缩放，可以控制一个方向缩放 |
| 是否改变元素所占空间 | 改变，缩放后的最小字号为12px |    不会改变元素所占空间，文字等比缩放    |

## 长度单位

- rem：相对于html根元素设置字体大小
- px：相对屏幕分辨率的长度单位
- em：当前元素的字体大小
- vw：视口宽度
- vh：视口高度

## 媒体查询

- CSS3新语法

```
@media mediatype and|not|only (media feature){
      css-code;
}
```

- 用@media开通 注意@符号
- 关键字 and not only
- media feature 媒体特性，必须有小括号包含

### mediatype 媒体类型

- all：所有设备
- print：打印机
- screen：电脑、平板、手机

***

## 清除浮动

为什么要清除浮动？

- 父盒子不给高度，子盒子浮动后，父盒子高度为0

清除浮动方法：

- 额外标签法：在浮动的盒子标签后加一个块级空白标签，style = "clear : both"
- 给父盒子添加overflow : hidden样式
- 给父盒子添加after伪元素
- 给父盒子添加双伪元素

## 伪类和伪元素

- 伪类：表示被选择元素的某种状态
- 伪元素：表示被选择元素的某个部分

### 伪元素

- ::after
- ::before
- ::first-letter
- ::first-line
- ::section
- ::placeholder

### 伪类

#### 状态类伪类

- :link
- :hover
- :visited
- :active
- :focus

#### 结构类伪类

- :not()
- :first-child
- :last-child
- :only-child
- :nth-child
- :nth-last-child
- :first-of-type   特定类型总的第一个
- :last-of-type
- :only-of-type
- :nth-of-type
- :nth-last-of-type
- :target   当前活动目标

#### 表单相关伪类

- :checked
- :disabled
- :enabled
- :empty
- :required
- :read-only
- :valid
- :invalid
- :optional
- :default
- :in-range
- :out-of-range
- :indeterminate    不确定状态的
- :scope

### 其他伪类

- :root  根元素
- :fullscreen 全屏显示的
- :dir() 匹配特定文字方向的元素
- :lang 匹配特定语言

## CSS网格

display: grid;

`grid-template-columns` 属性值的个数表示网格的列数，每个值表示相应的列宽度。

`grid-template-rows` 属性值的个数表示网格的行数，每个值表示相应的行宽度。

其中`fr`：设置列或行占剩余空间的比例，`auto`：设置列宽或行高自动等于它的内容的宽度或高度，`%`：将列或行调整为它的容器宽度或高度的百分比

grid-column-gap，grid-row-gap列和行之间的间距

grid-gap： grid-column-gap grid-row-gap；

justify-items：网格沿水平轴排列

align-items：网格沿竖直方向排列

grid-template-areas区域划分，指定自定义名称（3x3区域）

```css
grid-template-areas:
  "header header header"
  "advert content content"
  "advert footer footer";
```

grid-area将元素放到划分好的区域位置

```css
.item1 {
  grid-area: header;
}
```

```css
grid-area: horizontal line to start at / vertical line to start at / horizontal line to end at / vertical line to end at;
```

`repeat` 方法指定行或列的重复次数

```css
grid-template-rows: repeat(100, 50px);
```

auto-fill和minmax自动填充，左对齐

auto-fit和minmax自动填充，两端对齐

网格项属性（单元格）：

- `grid-column` 属性加上网格线条的编号来定义网格项开始和结束的位置
- `justify-self` 属性，设置其内容的位置在单元格内沿水平轴的对齐方式
- align-self属性，设置其内容的位置在单元格内沿竖直方向的对齐方式
