## const&static

## const

### const指针

- const int *：指针指向的对象是常量
- int * const：指针变量是常量

- const对象不能调用非const方法，const方法中可以改变mutable成员值

### 函数声明中的const

- 修饰函数参数：参数在函数内为常量不可变
- 修饰函数返回值：返回值不可作为左值使用
- 放在参数表之后为const方法，this指向的休想不可变

## static

- +局部变量：生存期为程序终止
- +类成员：静态类成员。所有类对象共享
- +全局变量：文件作用域
- +类成员函数：只能访问静态类成员