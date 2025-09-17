# Effective C++

1. 尽量以const、enum、inline代替#define

2. 尽可能使用const

   - 如果const出现在星号左边，表示被指物是常量；如果出现在星号右边，表示指针自身是常量

   - 迭代器的作用像一个T*指针，声明迭代器为const即声明指针为const；使用const_iterator保证迭代器所指的东西不可变

     ```c++
     const std::vector<int> ::iterator
     std::vector<int>::const_iterator
     ```

   - 返回值设为const避免对返回值进行误操作
   
   - const成员函数：成员函数更改了指针所指对象，但如果只有指针隶属于对象，则称此函数为bitwise const，不会引发编译器异议
   
   - mutable释放掉non-static成员变量的bitwise constness 约束
   
   - non-const函数必须由non-const对象调用
   
3. 确定对象被使用前先初始化

   - 非内置类型对象的成员变量的初始化动作发生在进入构造函数之前，即成员对象的default构造函数被调用的时候
   - 构造函数中的赋值操作是先调用default构造函数后再立刻赋予新值；初始化列表将构造函数的实参作为成员对象copy构造函数的实参
   - class的成员变量总是按照声明顺序被初始化
   - 函数内的static对象称为local-static对象，其他static对象（global对象、定义在namespace、class、file作用域内被声明为static的对象）称为non-static对象
   - 由于C++对定义于不同编译单元内的non-static对象的初始化次序并无明确定义，将non-static对象转化为local static对象，放在一个专属函数中并返回对象的引用

4. 了解C++默默编写并调用了哪些函数

   - 编译器会为空类声明一个default构造函数、copy构造函数、copy赋值函数、析构函数（所有函数都是public且inline）
   - 编译器生成的是non-virtual析构函数，除非基类有virtual析构函数
   - 成员变量有reference和const的，赋值操作必须定义copy赋值操作符函数
   
5. 若不想使用编译器自动生成的copy构造函数和copy赋值操作符，可以使用private声明，并不予定义；此时成员函数和友元函数还是可以调用，会在链接阶段报错，如果想将链接阶段的错误移至编译期，可以设置一个基类，在基类中使用private声明，并不予定义，这样在尝试拷贝子对象时，编译器尝试生成copy构造和copy赋值，这些函数会调用基类的copy构造和copy赋值，此时编译器就会报错，因为基类的这两个函数是private

6. 为多态基类声明virtual析构函数

   - 当派生类对象经由一个基类指针被删除，而基类只有non-virtual析构函数，则对象的派生类成分通常不会被销毁
   - 具有多态性质的基类应该声明virtual析构。如果基类带有任何virtual函数，应该拥有一个virtual析构函数

7. 别让异常逃离析构函数

   - 如果一个被析构函数调用的函数可能抛出异常，析构函数应该捕捉，然后吞下异常或结束程序

8. 绝不在构造和析构函数中调用virtual函数

   - 在基类构造期间，virtual函数不是virtual函数
   - 在派生类对象的基类构造期间，派生类对象的类型是基类而不是派生类，因为此时派生类的成员变量还未从初始化
   
9. 令operator=返回一个*this引用

10. 在oprator=中处理自我赋值

   - 证同测试，比较赋值对象和目标对象是否是同一个
   - 异常处理

11. 复制对象时不要忘记每一个成分

    - 当编写复制构造函数和赋值运算符时，赋值所有的local成员变量；调用所有基类的适当的复制构造函数和赋值运算符
    - 复制构造函数和赋值运算符不能互相调用

12. 以对象管理资源

    - 利用对象的析构函数自动释放资源
    - auto-ptr类指针对象，智能指针，其析构函数自动对所指对象调用delete；通过复制构造函数和复制操作符复制auto-ptr，复制所得对象将取得资源的唯一拥有权
    - shared-ptr引用计数
    - RAII（Resource Acquisition Is Initialization）资源取得的时机是初始化

13. 在资源管理中小心copying行为

    - 禁止复制
    - 引用计数
    - 深度拷贝
    - 转移底部资源拥有权

14. 在资源管理类中提供对原始资源的访问

    - 资源管理类如auto-ptr、shared-ptr
    - 通过显式转换和隐式转换将RAII类对象转化为其所内含的原始资源

15. 成对使用new和delete时要采取相同的形式

    - 单一对象的内存布局和不同于数组的内存布局
    - delete针对内存调用一个析构函数，delete []调用多个

16. 以独立语句将new对象置于智能指针

    ```c++
    processWidget(std::tr1::shared_ptr<Widget>(new Widget), priority());
    ```

    1. 需要执行“new Widget”
    2. 调用priority
    3. 调用tr1::shared_ptr构造函数

    编译器执行次序是不固定的，但如果调用priority异常，则可能引发资源泄露，这就是资源被创建和资源被转换为资源管理对象两个时间点之间可能发生干扰

    解决方法是使用分离语句

    ```c++
    std::tr1::shared_ptr<Widget> pw(new Widget);
    processWidget(pw, priority());
    ```

17. 接口容易被正确使用，不宜被误用

    - 接口的参数不是单纯的数据，而是内部是数据的类型对象

      ```c++
      class Month
      {
      public:
          static Month Jan() { return Month(1);}
          static Month Feb() { return Month(2);}
          ...
          static Month Dec() { return Month(12);}
      private:
          explicit Month(int m); //不能自己生成新月份
      }
      class Date
      {
      public:
          Date(const Month& m, const Day& d, const Year& y);
      }
      Date d(Month::Mar(), Day(30), Year(1995));
      ```

    - 显式的const约束

    - cross-DLL problem：对象在动态链接库中被new创建，却在另一个DLL内被delete

18. 设计class

    -  新的对象应该如何被创建和销毁
    - 对象的初始化和对象赋值
    - 新的对象怎样被按值传递，copy构造函数用来定义按值传递的实现
    - 继承关系
    - 类型转换，类型转换函数operator classB
    - private驳回调用标准函数
    - 成员类型：public、protected、private
    - 是否应该定义一个新的类，或应该定义一个新的template
    
18. 函数调用参数const 引用代替值传递

    - 引用传递不需要调用构造和析构函数
    - const保证参数对象不会被改变
    - 引用传递避免对象切割问题。当一个派生类对象通过值传递，会被视为一个基类对象，调用基类的copy构造函数，派生类对象的特化性质被切割
    - 除了内置类型、STL迭代器和函数对象，其他情况下一般使用const引用传递参数
    
18. 返回对象还是引用

    - local static带来多线程安全性问题
    - 单例模式，在单线程中合理返回reference指向一个local static对象
    
18. 将成员变量声明为private

    - getter函数声明为const，防止改变成员变量
    
18. 宁以non-member、non-friend替换member函数，member函数A可以访问private成员变量，在member函数B中调用member函数A则会增加对private成员变量访问的函数的数量，所以member函数B用non-member函数代替

23. 如果所有参数都需要类型转换，采用non-member函数

    ```c++
    class Rational{
    public:
        const Rational operator* (const Rational& rhs) const;
    }
    Rational a;
    auto b = a * 2;//2会隐式转换为Rational
    //auto b = 2 * a; 这里2并没有operator*成员函数，同时也无法进行隐式转换，编译器会尝试寻找non-member operator*
    
    解决方法：在Rational类外定义一个non-member函数
    const Rational operator* (const Rational& lhs, const Rational& rhs)
    {
        return Rational(lhs * rhs);
    }
    ```

    - member函数的反面是non-member函数，而不是friend函数

24. 考虑写一个不抛异常的swap函数

    - std::swap置换两对象值

    - 特化是对模板参数完全具体化的实现，而偏特化是对模板参数部分具体化或对特定情况的实现

      ```c++
      class Widget
      {
      public:
          void swap(Widget& other)
          {
              using namespace std;
              swap(this.PImp, other.pImp)
          }
      }
      
      namespace std{
          template<> //表示是std::swap的一个T为Widget的全特化版本，为标准的template制造特化版本是被允许的
          void swap<Widget>(Widget& a, Widget& b)
          {
              a.swap(b);
          }
      }
      ```

    - C++只允许对class template偏特化，不能在function template偏特化，可以添加重载版本，可以全特化std内的template，但不可以添加新的template

      ```c++
      namespace WidgetStuff{ //这里不可以添加到std
          template<typename T>
          class Widget{};
          
          template<typename T> 
          void swap(Widget<T>& a, Widget<T>& b) //std::swap的重载版本
          {
              a.swap(b);
          }
      }
      ```

      

18. 尽可能延后变量定义

18. 尽量少强制类型转换

    - C风格转型
    
      ```c++
      (T)expression
      ```
    
    - 函数风格转型
    
      ```
      T(expression)
      ```
    
    - dynamic_cast：向下转型，许多实现版本执行速度很慢
    
    - 避免将基类指针动态转化为派生类指针
    
      1. 使用容器并在其中存储直接指向派生类对象的指针
      2. 使用virtual函数
    
    - reinterpret_cast：实际结果可能取决于编译器，所以不可移植
    
18. 避免返回引用、指针、迭代器指向对象内部

18. 异常安全性函数：

    - 不泄露任何资源
    - 不允许数据损坏
    
    异常被抛出时，资源可能还未被释放，变量可能还未被合理赋值
    
18. inline函数

    - inline函数背后的整体观念，将对此函数的每一个调用都以函数本体代替
    - 空的构造函数并不可以声明为inline函数，因为包含了基类的构造
    - inline函数无法调试
    
18. 将文件间的编译依存关系降至最低

    类中的定义
    
    - 将接口从实现中分离
    - 使用 类引用和指针代替类
    - 使用class声明代替定义，函数声明中亦可
    - Handle class指针指向实现的类
    - 抽象基类
    
18. 重载、重写、覆盖

    - 在派生类作用域中使用using声明基类中被覆盖的函数
    
18. 区分接口继承和实现继承

    - 纯虚函数必须被重新声明，声明纯虚函数的目的是为了让派生类只继承函数接口
    - 可以为纯虚函数提供定义，调用时使用className::f
    - 声明非纯虚函数是为了让派生类继承函数接口和缺省实现
    - 声明非虚函数是为了让派生类继承函数的接口和强制性实现
    
33. 绝不重新定义继承来的非虚函数

    - 非虚函数是静态绑定

18. 绝不重新定义继承来的缺省参数值

    - virtual函数是动态绑定，缺省参数值是静态绑定，可能存在调用派生类中的virtual函数，使用的是基类指定的缺省冲参数值
    
35. 明确审慎地使用多重继承

    - 解析重载函数调用规则：在看到是否有个函数可以被取用之前，C++首先确认最佳匹配函数，然后才检验其可取用性
    - 虚继承会增加大小、速度、初始化（及赋值）复杂度等成本

36. 隐式接口和编译器多态

    - 隐式接口：模板类必须满足的表达式便是模板类型必须支持的隐式接口
    - 编译器多态：涉及到的函数调用可能造成模板具象化，使得调用成功，以不同的template参数具象化function templates会导致调用不同的函数

18. 了解typename 的双重意义

    - 从属名称：template中出现的名称依赖于某个template参数
    
    - 嵌套从属名称：从属名称在class内呈嵌套状
    
    - 嵌套从属名称C::const_iterator无法判断是否是一个类型，C++解析器会默认这个名称不是一个类型，除非显式声明typename
    
    - typename不可以出现在base class list内的嵌套从属名称前，也不可以在成员初始化中作为base class修饰符
    
      ```c++
      template<typename T>
      class Derived : public Base<T>::Nested 
      {
      public:
          explicit Derived(int x)
              :Base<T>::Nested(x)
              {
                  typename Base<T>::Nested temp;
              }
      }
      ```
    
      
    
18. 学习处理模板化基类内的名称 

    - 模板化基类中的函数在派生类中调用要在之前加上"this->"
    - 使用using声明函数位于模板化基类中
    
18. 将与参数无关的代码抽离templates

    - 
    
18. 

18. 

18. 

    
    
    