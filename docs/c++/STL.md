# STL组件

## 容器

- 序列容器：动态数组（vector）、双向链表（list）、双端队列（deque）

- 关联容器（元素经过排序）：关联数组（map）、多重映射multimap（允许出现重复key）、、集合（set）、多重集合multiset（允许出现重复元素）
- 容器适配器：queue、stack、priority_queue

- 可复制：所有容器操作返回其元素副本
- 可赋值：可以用assign()给元素设定新值
- 可释放：从容器中删除元素时，容器释放元素所占内存，所以析构函数不能为private

### 容器的数据结构

- string：typedef basic_string  string 
- bitset
- valarray

### vector

- push_back()
- insert()
- pop_back()
- reserve()：预先设置容器大小
- size()
- capacity()
- resize()
- empty()
- erase()
- clear()
- at()：返回元素引用
- front()：第一个元素
- back()：最后一个元素
- swap()：元素类型相同，交换会瞬间完成；元素类型不同，需要执行复杂操作

#### vector迭代器对象

1. vector<>::iterator

   - begin()

   - end()：最后元素的下一个位置

2. vector<>::reverse_iterator

   - rbegin()

   - rend()：反向迭代最后一个元素下一个位置

#### vector<bool>

- 只占用一个bit存储单个元素

### list

- 不支持随机存取，不提供下标操作符和at()函数
- 快速的插入和删除
- 运算符函数比较两个list大小

#### 构造函数

```c++
list<A> listName;
list<A> listName(size);
list<A> listName(size, value);
list<A> listName(initList);
list<A> listName(first, last);
```

- void push_front()

- void push_back()

- void pop_front()

- void pop_back()

- size()

- max_size()

- void resize()

- front()：返回第一个元素引用

- back()：返回最后一个元素引用

- empty()

- assign()：重置元素值

- swap()

- erase()

- clear()

- merge()：合并后元素自动升序排列

- void remove(const Type& _Val)：删除所有对应元素

- remove_if()

  ```c++
  template <class Pred> void remove_if(Pred pr)
  typedef bind2nd<not_equal_to<_Ty>> Pred
  list.remove_if(bind2nd(not_equal_to<int>(), 1))
  ```

- splice()

  ```c++
  void splice(iterator it, list& x);
  void splice(iterator it, list& x, iterator first);
  void splice(iterator it, list& x, iterator first, iterator last); 
  ```

  - 将x的部分或全部元素插入到it后
  - 合并完成后，参数x中会减少相应数目的元素

- unique()：假定元素是已排序的，相同元素是相邻的，将相邻的重复元素保留一个

  ```c++
  //两种原型
  void unique();
  template<class BinaryPredicate>void unique(BinaryPredicate);
  ```

  - 第二种形式只保留和第一个元素相等的元素

- reverse()

#### list迭代器对象

1. list<>::iterator

   - begin()

   - end()：最后元素的下一个位置
2. list<>::reverse_iterator

   - rbegin()
- rend()：反向迭代最后一个元素下一个位置

### deque

- 对序列的随机访问
- 序列**两端**的快速插入和删除
- 运算符函数比较两个list大小

#### 构造函数

```c++
deque<typename T> name;
deque<typename T> name(size);
deque<typename T> name(size, value);
deque<typename T> name(initDeque);
deque<typename T> name(initDeque.first(), initDeque.end());
```

- size()
- max_size()
- void resize()
- void push_front()
- void push_back()
- void pop_front()
- void pop_back()
- 运算符[]和at()
- front()：返回第一个元素引用
- back()：返回最后一个元素引用
- empty()
- assign()
- swap()
- insert()
- erase()
- clear()

#### deque迭代器对象

1. deque<>::iterator

   - begin()

   - end()：最后元素的下一个位置
2. deque<>::reverse_iterator

   - rbegin()
   - rend()：反向迭代最后一个元素下一个位置

## 迭代器

## 算法

- for_each()：

  ```C++
  template <class InputIterator, class Function>
  Function for_each(InputIterator first, InputIterator last, Function fn)
  ```

  - first：输入迭代器，指向容器的第一个元素
  - last：输入迭代器，指向容器的最后一个元素的下一个位置
  - fn：可调用对象

- find()

  ```c++
  template<class InputIterator, class T>inline InputIterator find(InputIterator first, InputIterator last, const T& value)
  ```

  - 返回迭代器

- find_if()

  ```c++
  template<class InputIterator, class T, class Predicate> inline InputIterator find_if(InputIterator first, InputIterator last, Predicate predicate)
  ```

  - 如果没找到，返回end()                  

- count()                

- count_if()：对指定区域中符合指定条件计数的一个函数（返回所有满足条件为true的数字累计）

  ```c++
  template <class InputIterator, class Function>
  Function count_if(InputIterator first, InputIterator last, Function fn)
  ```

  - first：输入迭代器，指向容器的第一个元素
  - last：输入迭代器，指向容器的最后一个元素的下一个位置
  - fn：可调用对象，返回值为bool

- replace

- replace_if

- copy

- unique_copy

- sort

  ```c++
  void sort(RandomAccessIterator first, RandomAccessIterator last)
  void sort(RandomAccessIterator first, RandomAccessIterator last, Compare comp)
  ```

  - 不稳定，默认升序
  - 默认: 两个参数first,last，将[first, last)区间内元素升序排列。【注意区间为左闭右开】
  - comp比较函数，greater<>()降序排列

- equal_range

- merge

通用算法如查找、排序

## 函数对象

## 适配器

- 将现有接口转换成符合新需求的接口

### 容器适配器

- stack
- queue
- priority_queue

### 迭代器适配器

- reverse_iterator

## 类模板

- 类模板的成员函数

  ```c++
  template <class T> void ClassA<T>::fun(){}
  ```

- 类模板的静态数据成员

  ```c++
  template <class T> int ClassA<T>::m_count = 0;
  ```

### 成员模板 

- 模板可以作为结构、类、模板类的成员
- 成员模板不能为虚
- 析构器不能是模板类型
- 成员函数模板不能重载基类的虚函数

### 友元模板

### 函数模板

### 仿函数

- 重载了函数调用运算符的类或结构体

模板类greater<>()