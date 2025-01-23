## mupdf编译使用

首先下载muPDF，找到mupdf-1.8-source.，platform文件夹为不同平台上的工程配置，进入win32目录，打开mupdf工程(vs2008及以上会提示转换,转换后自动产生.sln工程)

编译生成x64版本的静态库文件

.pro文件中添加静态库

```bash
LIBS += -L$$PWD/./ -llibmupdf -llibthirdparty
INCLUDEPATH += $$PWD/include
DEPENDPATH += $$PWD/include
```

### 问题

引入头文件时，出现

```bash
mupdfwrapercore.obj:-1: error: LNK2019: 无法解析的外部符号 "void __cdecl fz_push_try(struct fz_context_s *)" (?fz_push_try@@YAXPEAUfz_context_s@@@Z)，该符号在函数 "public: void __cdecl MuPDFWraperCore::initContext(void)" (?initContext@MuPDFWraperCore@@QEAAXXZ) 中被引用
```

因为mupdf使用纯C代码，编译产生的lib具有浓厚的C色彩，作为lib导出的函数修饰符仅仅只有前缀_. 如fz_new_context函数的导出为_fz_new_context，而我们用c++代码加载时，修饰后找的函数却是?fz_push_try@@YAXPEAUfz_context_s@@@Z自然找不到.

解决方案

```c++
extern "C"
{
#include "mupdf/fitz.h"
}
```

还可能出现

```apl
LIBCMT.lib(dosmap.obj) : error LNK2005: __errno 已经在 MSVCRT.lib(MSVCR100.dll) 中定义
LIBCMT.lib(tidtable.obj) : error LNK2005: __encoded_null 已经在 MSVCRT.lib(MSVCR100.dll) 中定义
```

库冲突了mupdf的lib使用MT运行库,而QT和VS都默认使用MD运行库

解决方案

```bash
.pro文件中添加
QMAKE_CXXFLAGS_RELEASE = -O2 -MT -GL
QMAKE_CXXFLAGS_DEBUG = -Zi -MTd
```

### 运行库

Visual Studio C++中在属性 -> 配置属性 -> C/C++ -> 代码生成 -> 运行库显示

Qt Creator在F:\Qt\5.13.0\msvc2015_64\mkspecs\winrt-x64-msvc2015\qnake.conf查看在.pro文件中通过QMAKE_CXXFLAGS_RELEASE设置

CRT：C/C++ Runtime Library，用于操作系统的开发及运行，Windows API作为Windows的一部分，是在CRT的基础上开发的

| 库类型和相关编译器开关  | 基本 C 运行时库/标准 C++ 库 |
| :---------------------- | :-------------------------- |
| 单线程 (/ML)            | LIBC、LIB/LIBCP             |
| 调试单线程 (/MLd)       | LIBCD、LIB/LIBCPD           |
| 多线程 (/MT)静态库      | LIBCMT、LIB/LIBCPMT         |
| 调试多线程 (/MTd)       | LIBCMTD、LIB / LIBCPMTD     |
| 多线程 DLL (/MD)动态库  | MSVCRT、LIB/MSVCPRT         |
| 调试多线程 /DLL (`MDd`) | MSVCRTD、LIB/MSVCPRTD       |

MT：mutithread，多线程库，编译器会从运行时库里面选择多线程静态连接库来解释程序中的代码，即连接LIBCMT.lib库

MTd：mutithread+debug，多线程调试版，连接LIBMITD.lib库

MD：MT+DLL，多线程动态库，连接MSVCRT.lib库，这是个导入库，对应动态库为MSVCRT.dll

MDd： MT+DLL+debug，多线程动态调试库，连接MSVCRTD.lib库，对应动态库为MSVCRTD.dll

### 标准库

Glibc是Linux中使用最广泛的C标准库

GNU/linux上对应的C++标准库为**libstdc++**

Windows 标准C库ucrt.lib在ucrtbase.dll中，C++标准库(动态链接)msvcprt.lib位于msvcp.dll

MinGW 是GNU的一些开发工具，例如GCC、GNU 汇编、链接等程序在Windows上的移植

msvcrt.dll是MSVC4.2到6.0版本之间的标准C库

1. UCRT，标准C库，对应ucrtbase.dll；
2. vcruntime库，对应VCRUNTIME140D.DLL,VCRUNTIME140_1D.DLL;
3. STL，标准C++库，对应MSVCP140D.DLL