# webpack

- 静态模块打包工具
- 很久以前，一个文件只一个模块，需要顺序引入防止依赖变量丢失问题；后来，node.js的出现赋予我们操作文件的能力，使得webpack可以打包js和json文件，
- 但那还远远不够，loader让我们可以对css、scss、png、ts等文件进行打包
- plugin可以在webpack运行到某一阶段注入扩展逻辑来改变构建结果
- webpack构建中入口是chunks（多个代码块），出口是chuank（打包成一个）

## webpack默认配置

- 入口为src文件夹下的index.js，出口为dist文件夹下的main.js

```js
const path = require('path')  
module.exports = {  
  extry: './src/index.js',  
  output: {  
    filename: 'main.js',  
    path: path.resolve(__dirname, './dist')   
  }  
} 
```

- 对同一种类型文件使用多个 loader的时候，use属性接收一个数组，并且从右向左执行
- 当loader需要写配置的时候，我们可以把loader写成一个对象，loader属性就是要使用的loader名称