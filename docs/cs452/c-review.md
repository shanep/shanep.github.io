# C Review

This is a quick start guide for C programming geared for students who have been exposed to C but
have done the majority of their coursework in Java. In the CS curriculum at Boise State University
you are exposed to C in CS253 and ECE230/330 which are both pre-requisites to this class, the
majority of the other required classes use Java as the preferred language. With this fact in mind
students may not have had as many opportunities to hone their C skills to the same sharpness as
their Java skills. The following sections highlight some important differences between C and Java,
and give rough analogies to help bridge the gap between the two.

When working with C it is very important to distinguish between the _declaration_ of an construct
(such as a variable, struct, function, etc.) and its _definition_. A declaration announces the
properties of a variable (primarily its type); a definition also causes storage to be set aside. We
will visit the topic of _declaration_ and _definition_ throughout this document.

This document is by no means an exhaustive reference for the C language, its purpose is to help
refresh your previous experience with C and point out common pitfalls that plague students. Several
very thorough treatises of the C language are listed in the References section below
for those who want to dig deeper.

## Types, Operators, and Expressions

The C language provides only a few basic type specifiers: char, int, float and double. In addition
to the basic types there are type modifies: signed, unsigned, short, and long. You use the basic
types and modifiers together like `unsigned int foo = 0;` which declares a new variable foo of
type int that is unsigned.

Types such as int, float, double, etc. are hardware dependent. This is in stark contrast to Java
where sizes are always the same regardless of what hardware you are running on.

In C automatic type conversions can be surprising when coming from the warm embrace of Java. When an
operator, like addition(+) encounters operands of different types, they are converted to a common
type according to a small number of rules. In general, the only automatic conversions are those that
convert a _narrower_ operand into a _wider_ one without loss of precision. An example would be
converting an integer to floating point. Unfortunately, expressions that might lose information,
like assigning a longer integer type to a shorter, or a floating-point type to an integer, are not
illegal and the compiler in question may only issue a warning instead of an error.

## Control flow

Control flow in C is similar to java with some of the same gotchas (like switch statements falling
through without an explicit break). You have If-Else, Else-If, Switch, loops (while, for, do/while),
break, continue and the infinitely-abusable _goto_ statement.

While the _goto_ statement may have gotten a bad rap it is actually quite handy when used with
discipline. To quote the linux kernel docs the
[rationale](https://www.kernel.org/doc/html/v4.10/process/coding-style.html#centralized-exiting-of-functions)
for using the goto statement is:

* unconditional statements are easier to understand and follow
* nesting is reduced
* errors by not updating individual exit points when making modifications are prevented
* saves the compiler work to optimize redundant code away ;)

## Functions and Program Structure

Java is an OOP language and uses
[methods](https://en.wikipedia.org/wiki/Method_%28computer_programming%29) while C is a procedural
language and uses functions. The purpose of both is to break large computing tasks into smaller
ones. While pre-ANSI C (known as K&R C) had very strange function declarations, functions in ANSI C
(C89 and greater) have a similar look and feel to Java.

One of the biggest differences between functions in C and methods in Java (besides the OOP
differences) is C has function prototypes. Function prototypes allow you to [forward declare](https://en.wikipedia.org/wiki/Forward_declaration) a functions signature so you can call a
function before it is defined.

The classic example is where two functions each call each other. Without prototypes the compiler
would not have seen the function `bar` when called in `foo` and would not know if the function
is being called correctly. Moving the function `bar` to be defined before `foo` would not solve
the issue because `bar` is calling `foo`! Thus, the solution in C is to forward declare both
functions before either is used as illustrated below.

```c
/* declares functions foo and bar*/
void foo(void);
void bar(void);

/*defines the function foo*/
void foo(void)
{
    if (expr){
      bar();
    }
}

/*defines the function bar*/
void bar(void)
{
  if (expr){
    foo();
  }
}
```

### Header Files

Java has no notion of a "header file" in the same way as the C language does. However, we can make
_rough_ comparisons between a C header file (ending in a .h) and a [Java interface](https://docs.oracle.com/javase/tutorial/java/concepts/interface.html). If the header file
contains declarations and definitions it is similar to a [Java Abstract class](https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html). Keep in mind that these
examples are very **rough** and if you squint too hard the analogy will fall apart. In C, your
implementation should be in a .c file which can be roughly compared to a Java concrete class.

In Java if you want to use a class that is defined in another package (file) you need to use the
`import` directive. In C the equivalent statement would be `#include <file>`. However be
aware that `#include` is actually part of the C pre-processor.

### Static Variables

The **static** keyword in Java indicates that the member in question belongs to the **class** and
not the object itself. In C the **static** declaration, applied to an external variable or function,
limits the scope of that object to the rest of the source file being compiled. So in C using the
**static** keyword on a function is akin to using the **private** keyword in Java.

In C you can also use the **static** declaration on internal variables (variables declared inside a
function). Internal static variables are local to a particular function just as automatic variables
are, but unlike automatics, they remain in existence across function calls. This means that using
the **static** keyword on internal variables provide private, permanent storage within a single
function. Be aware however that internal static variables are *NOT* thread safe and should be
treated with the same care as global variables in a multi-threaded environment.

```c
/* foo is private to this source file */
static int foo;

/* bar is private to this source file */
static void bar(void){ ... }

static void foobar(void)
{
  /* var is private to foobar and will retain its value across func calls */
  static int var;
}
```

### Initialization

In the absence of explicit initialization, **external and static variables** are guaranteed to be
initialized to zero; automatic and register variables have undefined (i.e. garbage) initial values.

### Preprocessor

In C the preprocessor is the first step in the compilation process. The preprocessor is a simple
text substitution mechanism.

The C preprocessor includes such items as:

* #include "foo.h" - copy's the contents of "foo.h" into the including file (foo.c)
* #define **name** _replacement text_ - subsequent occurrences of the token **name** will be replaced by the _replacement text_
* #if, #elseif, and #endif - similar to an if expressing in C
* #ifndef _symbol_ - evaluates to true if _symbol_ is not defined

## Input and Output

Input and output facilities are not part of the C language itself. The C standard library contains a
set of functions that provides input and output. The C standard library in turn relies on the
underlying operating system to do all the heavy lifting.

## Pointers and Arrays

Pointers are generally the hardest thing to grasp in the C language. To quote K&R "A pointer is a
variable that contains the address of a variable. While the definition seems recursive you can think
of a pointer as actually two things, an address and a value. Pointers are similar to Java reference
variables. Pointers and arrays are closely related with many similar rules and properties.

Given a pointer you can get the value it points to with the unary operator * which is called the
_indirection_ or _dereferencing_ operator.

Here is an example from the K&R book regarding pointers:

```c
int x=1, y=2, z[10]
int *ip; /* ip is a pointer to int */

ip = &x; /* ip now pointers to x */
y = *ip /* y is now 1 */
*ip = 0 /* x is now 0 */
ip = &z[0] /* ip now points to z[0]*/
```

For the most part pointers and arrays have a strong relationship. Any operation that can be achieved
by array subscripting can also be done with pointers. If we define `int a[10];` and `int
*pa` we can make the following statements:

* A pointer is a variable, so pa=a and pa{pp} are legal. But an array name is not a variable;
constructions like a=pa and a{pp} are illegal.
* When an array name is passed to a function, what is passed is the location of the initial
element. What this means is arrays decay to pointers when passed as a function argument.

### Address Arithmetic

Given the fact that a pointer is just a variable you can preform operations on it just like other
types. However, the results may not be what you are expecting. When adding 1 to a pointer `int
*pa` with the increment operator `pass:c[++]` we are moving the pointer `sizeof(int)` bytes. The
effect is the pointer now points to the next `int` in memory. For example if we are on a machine
where an `int` is 4 bytes (32 bits) adding 1 to a pointer of the type (int *) would add 4 bytes
to the address. This property is very useful when implementing the memory subsystem of an OS.

### Strings

There is no explicit string type in C like there is in Java. In C a string is just an array of
*chars* that are terminated with a null character ('\0'). Strings are typically represented by a
pointer (typed to `char *`) that points to the first character in the string. In C the
`char` type represents a character from the [ASCII table](http://www.asciitable.com/). A very
common mistake for beginner C programmers is to forget about the null character when dealing with
strings. When allocating memory you must always add 1 to the size of a string to account for the
null terminator. For example the string **_foo_** requires storage of size 4 bytes, 3 for the
letters f,o,and o and 1 for the '\0'.

## Structures

```c
/* Define a new struct type called foo */
struct foo{
    int a;
    int b;
};
/* Declare a new variable named bar of type struct foo */
struct foo bar;
```

In C an object is represented by a struct. You can think of a struct as a Java object with
everything declared public! You access a structures members using the dot operator (.) just like in
Java. However, if you are dealing with a pointer to a struct you need to use the arrow operator
(\->).

```c
struct point {
  int x;
  int y;
};

struct point foo;
struct point *fooptr = &foo;

/* Access x and y with struct var */
foo.x;
foo.y;

/* Access x and y with struct pointer */
fooptr->x;
fooptr->y;
```

## Compilation process

In C the compilation process is slightly more complex than Java and has multiple
stages. It is important to understand the stages that your code goes through
during the process so you can differentiate between compilation problems and
linking problems.  When compiling your code you should **always** enable as many
warnings as possible and should treat warnings as errors.

![Compiling C Code](images/c_compile.svg)

### Building code

If your program consists of one .c file and one .h file then it is possible to
build everything by hand. However, things get very complex once you start to add
more files into the process thus another tool must be used to drive everything.
There are hundreds of options available to build a C code base. For this class
we will use [cmake](https://cmake.org) . While cmake is not a perfect system it is
generally available everywhere and is good enough for our purposes.

### Cross-compiler

Compiling an OS requires us to use a cross-compiler. Your system compiler is
setup to create binaries that will run on the host OS. If we don't have a
cross-compiler then we will likely generate binaries that will not run on bare
metal because we will either be missing some of the required components (libc,
headers, runtime, etc), the generated code will be for the wrong architecture
(arm, x86_64, i386, etc.), or a multitude of other subtle issues that can trip
us up.

If we were using the [GCC compiler collection](https://gcc.gnu.org/) and we wanted
to cross compile we would need to install the appropriate cross compiler using
the systems package manger or build our own. On the other hand if we use the
LLVM compiler infrastructure project we get a
[cross-compiler](https://clang.llvm.org/docs/CrossCompilation.html) out of the
box. Either way we will need to know what our
[target triple](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)
is so we can make sure the compiler produces the correct object code which we
can then pass to the linker to create our final kernel image.

The format of a target triple is `<arch><sub>-<vendor>-<sys>-<abi>`. For our OS
this will be i386-pc-none-elf. Which breaks down as follows:

* `arch` = `i386` - We will target the i386 CPU
* `sub` = not necessary for i386
* `vendor`= `pc` - we will use the generic pc vendor
* `sys` = `none` - we are building our own so set to none.
* `abi` = `elf` - Use the elf abi

We can browse all the different options that LLVM supports by reading the
[docs](https://llvm.org/doxygen/Triple_8h_source.html).

In addition to having a cross-compiler we will need to have a linker that is
capable of generating a raw binary image that can be loaded into a specific
offset into memory. When we boot up a machine the kernel needs to know where in
memory it will be loaded so all memory addresses are correct so instructions
like `jmp` will jump to the correct spot! The LLVM project has a linker called
[lld](https://lld.llvm.org/) that is a drop in replacement for system linkers and
can generate the correct raw binary image.

Now that we know what we need we can get installing!

```bash
$ sudo apt update
$ sudo apt install build-essential clang lld
$ clang --version
clang version 10.0.0-4ubuntu1
Target: x86_64-pc-linux-gnu
Thread model: posix
InstalledDir: /usr/bin

$ ld.lld --version
LLD 10.0.0 (compatible with GNU linkers)
```

## The C (un)standard

In the brilliant paper _A Few Billion Lines of Code Later: Using Static Analysis to Find Bugs in
 the Real World_ the authors write about the challenges of parsing programming languages against a
 standard. While the C language has been standardized by
 [ISO](https://www.iso.org/standard/74528.html) compiler vendors often diverge from the standard,
 either on purpose ([gnu89](https://gcc.gnu.org/onlinedocs/gcc/C-Dialect-Options.html)), because the
 standard is vague or undefined, or because of bugs in the compiler itself.

____
The C language does not exist; neither does Java, C{pp}, and C#. While a language may exist as an
abstract idea, and even have a pile of paper (a standard) purporting to define it, a standard is
not a compiler. What language do people write code in? The character strings accepted by their
compiler. Further, they equate compilation with certification. A file their compiler does not
reject has been certified as "C code" no matter how blatantly illegal its contents may be to a
language scholar.
____

The [linux kernel](https://www.kernel.org/doc/html/latest/process/programming-language.html)
is written in
[gnu89](https://www.kernel.org/doc/html/latest/process/programming-language.html)
which looks like C but leverages gcc specific features. This dialect contains
many extensions to the language gnu-extensions, and many of them are used within
the kernel as a matter of course.

## References

* [The C programming language 2nd edition](https://www.oreilly.com/library/view/the-c-programming/9780133086249/)
  * Brian W. Kernighan and Dennis M. Ritchie. ISBN: 0-13-110362-8
* [Using the GNU Compiler Collection](https://gcc.gnu.org/onlinedocs/gcc-9.2.0/gcc.pdf)
* [clang documentation](https://clang.llvm.org/docs/)
* [A Few Billion Lines of Code Later: Using Static Analysis to Find Bugs in the Real World](https://cacm.acm.org/magazines/2010/2/69354-a-few-billion-lines-of-code-later/fulltext)
  * Al Bessey, et. al, Communications of the ACM, February 2010, Vol. 53 No. 2, Pages 66-75
* [OSTEP ch 14](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-api.pdf)
* [Intel® 64 and IA-32 Architectures Software Developer's Manual](https://software.intel.com/content/www/us/en/develop/download/intel-64-and-ia-32-architectures-sdm-combined-volumes-1-2a-2b-2c-2d-3a-3b-3c-3d-and-4.html)
* [NASM Manual](https://www.nasm.us/xdoc/2.15.05/html/)
* [GNU make](https://www.gnu.org/software/make/manual/html_node/index.html)
* [Clang command line documentation](https://clang.llvm.org/docs/ClangCommandLineReference.html)