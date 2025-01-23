## 2022/6/2

- 元素是构成 React 应用的最小单位，它用于描述屏幕上输出的内容。
- script标签

<script type="text/babel">

- React 元素都是不可变的。当元素被创建之后，只能通过创建新的元素取代它
- 在添加属性时， class 属性需要写成 **className** ，for 属性需要写成 **htmlFor**
- browser.min.js库用于编译JSX代码
- 组件变量名首字母大写，只有一个根节点

## 函数定义组件

```react
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
          {/* prop为参数对象props的一个属性*/}
      <h2>现在是 {props.prop.toLocaleTimeString()}.</h2>
    </div>
  );
}
 
function tick() {
  ReactDOM.render(
    <Clock prop={new Date()} />,
    document.getElementById('example')
  );
}
 
setInterval(tick, 1000);
```

***

## 类组件

```react
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
            {/*向组件传递参数，可以使用 this.props 对象*/}
        <h2>现在是 {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
 
function tick() {
  ReactDOM.render(
      {/*组件使用*/}
    <Clock date={new Date()} />,
    document.getElementById('example')
  );
}
 
setInterval(tick, 1000);
```

## JSX--js语法扩展

## react状态

- super表示调用父类的构造函数，子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 super 方法，子类就得不到 this 对象。
- super 虽然代表了父类 A 的构造函数，但是返回的是子类 B 的实例，即 super 内部的 this 指的是 B 的实例，因此 super() 在这里相当于 A.prototype.constructor.call(this) 
- 通过更新组件state，在不操作实际DOM的情况下，根据新的state重新渲染

```react
class Clock extends React.Component {
  constructor(props) {
    {/*类组件应始终使用 props 调用基础构造函数*/}
    super(props);
    {/*初始化state*/}
    this.state = {date: new Date()};
  }
 
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>现在是 {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
 
ReactDOM.render(
  <Clock />,
  document.getElementById('example')
);
```

## props

- 组件类的 defaultProps 属性为 props 设置默认值
- 组件类的propTypes 验证参数类型

```react
var data = {
    foo: 1,
    bar: 2
};
  var component = <Component {...data} />;
// 等价于
  var component = <Component foo={1} bar={2} />;
```



## props&state

- state 和 props 主要的区别在于 **props** 是不可变的，而 state 可以根据与用户交互来改变。容器组件通过定义 state 来更新和修改数据。 子组件只能通过 props 来传递数据。

### 判断应用中的数据哪些是state

1. 是否是从父级通过 props 传入的？如果是，可能不是 state 。
2. 是否会随着时间改变？如果不是，可能不是 state 。
3. 能根据组件中其它 state 数据或者 props 计算出来吗？如果是，就不是 state 。

### 调用setState是异步的

- 给 `setState` 传递一个函数，而不是一个对象，就可以确保每次的调用都是使用最新版的 state

***

### 拥有state的组件

对于应用中的每一个 state 数据：

- 找出每一个基于那个 state 渲染界面的组件。
- 找出共同的祖先组件（某个单个的组件，在组件树中位于需要这个 state 的所有组件的上面）。
- 要么是共同的祖先组件，要么是另外一个在组件树中位于更高层级的组件应该拥有这个 state 。
- 如果找不出拥有这个 state 数据模型的合适的组件，创建一个新的组件来维护这个 state ，然后添加到组件树中，层级位于所有共同拥有者组件的上面。

## 事件处理

- React 事件绑定属性的命名采用**驼峰式写法**
- 采用 JSX 的语法需要传入**一个函数（而不是函数调用）**作为事件处理函数
- 不能使用返回 **false** 的方式阻止默认行为， 你必须明确使用 **preventDefault**
-  e 作为 React 事件对象将会被作为第二个参数进行传递
- 箭头函数的方式，事件对象必须显式的进行传递，但是通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递。

```react
class Toggle extends React.Component {
  constructor(props) {
    super(props)	
    this.state = {isToggleOn: true}
 
    {/* this指向实例*/}
    this.handleClick = this.handleClick.bind(this)
    this.style = {
        fontSize: 50,
        color: '#FF0000'
    }
  }
  {/*这里可以使用箭头函数保证this指向
  handleClick = (id, e)  => {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }
  */}
{/*类的方法默认是不会绑定 this 的，这里的函数作为父类的方法*/}
  handleClick(id, e) {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }
    

 
  render() {
    return (
      <button onClick={(e) => this.handleClick(this.props.id, e)} style={this.style}>	
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
 
ReactDOM.render(
  <Toggle id={1}/>,
  document.getElementById('example')
);
```

## 条件渲染

- if无else
- &&
- 三目

## 组件API

- setState
- replaceState
- setProps
- replaceProps
- forceUpdate：使组件调用自身的render()方法重新渲染组件，组件的子组件也会调用自己的render()，适用于this.props和this.state之外的组件重绘
- findDOMNode
- isMounted

## 生命周期

### Mounting(挂载)：已插入真实 DOM

- `constructor()`：组件挂载之前调用
- `getInitialState()` 在组件的生命周期中仅执行一次，用于设置组件的初始化 state (**废弃**)
- `getDerivedStateFromProps()`: 调用render之前调用
- `render()`：类组件唯一必须实现的方法
- `componentWillMount()`：在挂载发生之前立即被调用
- `componentDidMount`：组件挂载后立即调用

### Updating(更新)：正在被重新渲染

- 每当组件的state或props发生变化时触发更新
- `getDerivedStateFromProps()`: 调用render之前调用
- `componentWillReceiveProps(object nextProps)`当一个挂载的组件接收到新的props的时候被调用。该方法应该用于比较`this.props`和`nextProps`，然后使用`this.setState()`来改变state
- `shouldComponentUpdate(object nextProps, object nextState)`:当组件做出是否要更新DOM的决定的时候被调用。实现该函数，优化`this.props`和`nextProps`，以及`this.state`和`nextState`的比较，如果不需要React更新DOM，则返回false。
- `render()`
- `getSnapshotBeforeUpdate()`: 在最近一次渲染输出（提交到 DOM 节点）之前调用
- `componentWillUpdate(object nextProps, object nextState)`在更新发生之前被调用。你可以在这里调用`this.setState()`
- `componentDidUpdate()`: 在更新后会被立即调用

### Unmounting(卸载)：已移出真实 DOM

- `componentWillUnmount()`: 在组件卸载及销毁之前直接调用。

## react ajax

## 表单

- 每次状态的改变，都会触发render函数重新渲染

```react
class HelloMessage extends React.Component {
  constructor(props) {
      super(props);
      {/*设置初始状态*/}
      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  render() {
    var value = this.state.value;
    return <div>
            <input type="text" value={value} onChange={this.handleChange} /> 
            <h4>{value}</h4>
           </div>;
  }
}
ReactDOM.render(
  <HelloMessage />,
  document.getElementById('example')
);
```

- 父传子通过props，子传父可以直接将父组件中的函数作为props对象的属性传过去

## 评论组件

- **React 版本16以后，React.createClass()创建组件的方式失效**

```react
// 整个评论组件
var CommentBox = React.createClass({
    // getInitialState() 在组件的生命周期中仅执行一次，用于设置组件的初始化 state 
    getInitialState: function() {
        return {data: []};
      },
    loadCommentsFromServer: function() {
    $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: (data) => {
        this.setState({data: data});
        },
        error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
        }
    });
    },
    handleCommentSubmit(comment) {
        let commentArr = this.state.data
        commentArr = commentArr.concat([comment])
        this.setState({data: commentArr})
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: (data) => {},
            error: (xhr, status, err) => {
                console.log(this.props.url, status, err.toString())
            }
        })
    },
    componentDidMount: function() {
        // 挂载后向后端发送请求
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
      },
    render: function() {
      return (
        <div className="commentBox">
          <h1>Comments</h1>
        <CommentList data={this.state.data}/>
              <!-- 反向数据流，将回调函数（handleCommentSubmit）传递给子组件，子组件提交事件触发回调函数-->
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        </div>
      );
    }
  });

  // 单条评论
  var Comment = React.createClass({
    rawMarkup: function() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return { __html: rawMarkup };
      },
      render: function() {
        return (
          <div className="comment">
            <h2 className="commentAuthor">
              {this.props.author}
            </h2>
            <span dangerouslySetInnerHTML={this.rawMarkup()} />
          </div>
        );
      }
  });

//   评论列表
  var CommentList = React.createClass({
    render: function() {
      var commentNodes = this.props.data.map(data => {
          return (<Comment author={data.author}>{data.text}</Comment>)
      })
      return (
        <div className="commentList">
          {commentNodes}
        </div>
      );
    }
  });
  
  var CommentForm = React.createClass({

    handleSubmit(e) {
        e.preventDefault()
        let author = this.refs.author.value.trim()
        let text = this.refs.text.value.trim()
        if (!text || !author) {
            return
        }

        // 执行父组件传过来的回调函数
        this.props.onCommentSubmit({author, text})
        // 给后端发送表单数据，并将输入框清空
        this.refs.author.value = ''
        this.refs.text.value = ''
        return
    },
    render: function() {
      return (
        <div className="commentForm">
          <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author"/>
                <input type="text" placeholder="Say something..." ref="text"/>
                <input type="submit" value="Post" />
          </form>
        </div>
      );
    }
  });

  
  ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval={2000}/>,
    document.getElementById('content')
  );
```

## JSX与模板引擎

模板引擎：模板（template）与数据（data）分离，通利用数据对模板进行渲染

JSX：通过js直接生成模板

## 注释

```react
var content = (
  <Nav>
    {/* 一般注释, 用 {} 包围 */}
    <Person
      /* 多
         行
         注释 */
      name={window.isLoggedIn ? window.name : ''} // 行尾注释
    />
  </Nav>
);
```

***

## 直接使用底层DOM API

- React.findDOMNode(component)：获取组件的DOM结点

## 双向绑定ReactLink

## 状态提升

- 将公共状态提升到最近共同的父组件中
