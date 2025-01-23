## 前言

diff算法通过比较旧的虚拟dom和新的虚拟dom的差异，更新真实dom，减少对真实dom的操作次数，提高更新效率。

首先，节点的数据变化会被监测到，变化会通过Dep.notify通知到订阅者数组中对应的watcher，watcher会调用update中的patch方法更新节点（这里的update在初始化时也会执行，但执行的是不同的patch函数）

[![vQLcng.png](https://s1.ax1x.com/2022/08/08/vQLcng.png)](https://imgtu.com/i/vQLcng)

## patch

- patch方法的参数为旧的虚拟节点和新的虚拟节点

```js
function patch (oldVnode, vnode) {
    // some code
    if (sameVnode(oldVnode, vnode)) {
    	patchVnode(oldVnode, vnode)
    } else {
    	const oEl = oldVnode.el // 当前oldVnode对应的真实元素节点
    	let parentEle = api.parentNode(oEl)  // 父元素
    	createEle(vnode)  // 根据Vnode生成新元素
    	if (parentEle !== null) {
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)) // 将新元素添加进父元素
            api.removeChild(parentEle, oldVnode.el)  // 移除以前的旧元素节点
            oldVnode = null
    	}
    }
    // some code 
    return vnode
}
```

## sameVnode

- 判断两个节点是否值得比较，如果是两个截然不同的节点就要用Vnode替换真实节点，否则调用patchVnode进行深入比较
- 比较的内容包括key值、标签名、是否为注释节点、是否定义了data、如果标签名为input，还要比较type

```js
function sameVnode (a, b) {
  return (
    a.key === b.key &&  // key值
    a.tag === b.tag &&  // 标签名
    a.isComment === b.isComment &&  // 是否为注释节点
    // 是否都定义了data，data包含一些具体信息，例如onclick , style
    isDef(a.data) === isDef(b.data) &&  
    sameInputType(a, b) // 当标签是<input>的时候，type必须相同
  )
}
```

## patchNode

- 首先获取到对应的真实dom，el
- 判断Vnode和oldVnode是否指向同一个对象，如果是，就直接返回
- 比较text属性，如果不相等，就将el的text设为Vnode的text
- 比较子节点：只有odlVnode有子节点，删除el的子节点；只有Vnode有子节点，给el添加子节点；都有子节点，但不相同则调用updateChildren函数比较子节点

```js
patchVnode (oldVnode, vnode) {
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
    	if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
    	}else if (ch){
            createEle(vnode) //create el's children dom
    	}else if (oldCh){
            api.removeChildren(el)
    	}
    }
}
```

## updateChildren

- oldCh和newCh分别为oldVnode和Vnode的子节点列表
- 头尾指针分别为oldStartIdx、oldEndIdx和newStartIdx、newEndIdx，通过对指针指向的四个节点两两进行判断是否值得比较，值得比较就对这两个节点执行patchNode，不值得比较的话先看有无key值

```js
updateChildren (parentElm, oldCh, newCh) {
    let oldStartIdx = 0, newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx
    let idxInOld
    let elmToMove
    let before
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {   // 对于vnode.key的比较，会把oldVnode = null
            oldStartVnode = oldCh[++oldStartIdx] 
        }else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx]
        }else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx]
        }else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx]
            // 如果两个头指针值得比较，两个头指针后移
        }else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
            // 如果两个尾指针值得比较，两个尾指针后移
        }else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
            // 如果旧头和新尾值得比较，真实节点放到尾部，旧头指针后移，新尾指针前移
        }else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode)
            api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
            // 如果旧尾和新头值得比较，真实节点放在头部，旧尾指针前移，新头指针后移
        }else if (sameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode)
            api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        }else {
           // 上述四种情况均不符合，使用key比较
            if (oldKeyToIdx === undefined) {
                // 根据oldCh的key生成一张hash表
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) 
            }
            
            idxInOld = oldKeyToIdx[newStartVnode.key]
            // 如果新节点的key不在生成的hash表中，生成新节点插入到真实dom
            if (!idxInOld) {
                api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                newStartVnode = newCh[++newStartIdx]
            }
            // 如果新节点的key在生成的hash表中，则比较新节点和对应的旧节点
            else {
                elmToMove = oldCh[idxInOld]
                if (elmToMove.sel !== newStartVnode.sel) {
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                }else {
                    patchVnode(elmToMove, newStartVnode)
                    oldCh[idxInOld] = null
                    api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                }
                newStartVnode = newCh[++newStartIdx]
            }
        }
    }
    // 只要有一个子节点列表遍历完就结束，旧子节点列表先遍历完就将剩余的新节点插入；新子节点列表先遍历完就将剩余的旧节点删除
    if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
    }else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}
```

