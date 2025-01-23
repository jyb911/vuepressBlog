## canvas

- 脚本绘制

```js
// 找到canvas元素
var c=document.getElementById("myCanvas");
// 创建context对象
var ctx = c.getContext('2d')
```

### 画线

- moveTo(*x,y*) 定义线条开始坐标
- lineTo(*x,y*) 定义线条结束坐标
- stroke()绘制

### 画圆

- beginPath()
- arc(x, y, r, start, stop)：x， y为圆心坐标，r为半径，start，stop为开始和结束的角度
- stroke()绘制

### 文本

- font定义字体
- fillText(text, x, y)实心文本
- stroke(text, x, y)空心文本

### 渐变

- createLinearGradient(x,y,x1,y1) - 创建线条渐变
- createRadialGradient(x,y,r,x1,y1,r1) - 创建一个径向/圆渐变
- addColorStop()方法指定颜色停止

```js
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
var grd=ctx.createLinearGradient(0,0,200,0);
grd.addColorStop(0,"red");
grd.addColorStop(1,"white");
// 填充渐变
ctx.fillStyle=grd;
ctx.fillRect(10,10,150,80);
```

### 图像

- drawImage(image,x,y)

## svg

- 可缩放矢量图形
- 使用XML格式定义图形

## canvas和svg对比

|                | canvas                   | svg        |
| -------------- | ------------------------ | ---------- |
| 依赖分辨率     | 是                       | 否         |
| 绘制方法       | js                       | XML        |
| 支持事件处理器 | 否                       | 是         |
| 文本渲染能力   | 弱                       | 强         |
| 图像保存格式   | png、jpg                 | svg        |
| 渲染速度       | 快                       | 慢         |
| 失真           | 放大失真                 | 放大不失真 |
| 应用           | 图像密集型游戏，频繁重绘 | 地图       |

