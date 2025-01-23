## app

- 控制应用程序的事件生命周期

```js

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```



## 预加载脚本

- 预加载脚本与浏览器共享一个全局window对象，并且可以访问node.js API，但不能修改window 对象
-  `contextBridge`模块可以用来安全地从独立运行、上下文隔离的预加载脚本中暴露 API 给正在运行的渲染进程

```js
// 在上下文隔离启用的情况下使用预加载
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  doAThing: () => {}
})
```



## 渲染进程

- 渲染进程运行在预加载脚本和主进程之外的独立上下文环境里

## 进程通信

### 渲染进程到主进程的单向通信

- `ipcRenderer.send`
- `ipcMain.on`

### 渲染进程到主进程的异步双向通信

- `ipcRenderer.invoke`：渲染进程通过预加载脚本提供的api调用
- `ipcMain.handle`：主进程进行处理并返回值
- 渲染进程接收到主进程的返回值进行后续处理

### 主进程到渲染进程

- 主进程send
- 渲染进程通过预加载脚本获取监听api      `ipcRenderer.on`
- 渲染进程send
- 主进程`ipcMain.on`

### 渲染进程到渲染进程

- 将主进程作为渲染器之间的消息代理。 这需要将消息从一个渲染器发送到主进程，然后主进程将消息转发到另一个渲染器。
- 从主进程将一个 **MessagePort**传递到两个渲染器。 这将允许在初始设置后渲染器之间直接进行通信。

## MessagePort

### 渲染进程中

- `MessagePort` 对象的创建依赖于 `MessageChannel` 类

```js
// 渲染进程中
// 实例化MessageChannel后产生两个MessagePort对象	
const { port1, port2 } = new MessageChannel()
// 允许在另一端还没有注册监听器的情况下就通过通道向其发送消息，消息将排队等待，直到一个监听器注册为止。
port1.postMessage()
```

- 渲染进程就可以通过 `port.onmessage` 和 `port.postMessage` 来通信

### 主进程中

- 主进程中没有`MessagePort` 或 `MessageChannel` 类，只有`MessagePortMain` 和 `MessageChannelMain`

```js
// main.js 
// 在主进程中，接收端口对象
ipcMain.on('port', (event) => {
  // 在主进程中接收到 MessagePort 对象, 即MessagePortMain.
  const port = event.ports[0]
  port.on('message', (event) => {
    const data = event.data
  })

  // MessagePortMain 阻塞消息直到 .start() 方法被调用
  port.start()
})
```

- 主进程创建MessagePortMain对象，并进行分发

```js
const { port1, port2 } = new MessageChannelMain()
```



### MessagePort传递

-  `ipcRenderer.postMessage` 用于传输MessagePort对象

```
ipcRenderer.postMessage(channle, message, [transfer])

channel String：事件名

message any：要传递的消息

transfer MessagePort[] (optional)：0个或多个 MessagePort 对象。

```

## nativeTheme

- `nativeTheme.themeSource`设置主题颜色
- css中设置媒体查询prefers-color-scheme

```css
@media (prefers-color-scheme: dark) {
  body { background: #333; color: white; }
}
```

- `nativeTheme.shouldUseDarkColors`判断是否处于深色模式