# Libraries

<SlideView />

## Introduction

- A dynamic-link library (DLL or .so) is a module that contains
    functions and data
- Applications (processes) can use the functions and data in the code
- This is the most common way code is distributed.
- Up until this point you have only ever distributed code in an
    executable (exe)

## Dynamic Libraries

- During compile time the linker stubs out calls to the .dll or .so
- The actual implementation is not added into the image that is saved to disk
- The library is mapped into your application's address space at run time

## Load-time dynamic linking

Your code makes explicit calls to exported DLL functions as if they were
local functions.

## Run-time dynamic linking

Functions are loaded with library functions such as `LoadLibrary` or
`LoadLibraryEx` (Win32) or `dlopen`/`dlsym` (POSIX). These are not system
calls. They are library code that runs in user space and makes system calls
like `openat` and `mmap` to do the work.

```c
#include <dlfcn.h>
#include <stdio.h>

void *handle = dlopen("libm.so.6", RTLD_LAZY);
double (*cos_fn)(double) = dlsym(handle, "cos");
printf("%f\n", cos_fn(3.14));
dlclose(handle);
```

## Advantages of Dynamic Linking

- Multiple processes that load the same library share a single copy of its code in memory (on
  Windows, only when the DLL loads at the same base address)
- When you update a DLL, the applications that use it do not need to be recompiled
- Programs written in different programming languages can call the same DLL functions

## Disadvantages of Dynamic Linking

![dll error](images/dll-error.png)

## Loading

![dynamic loading](images/dynamic-loading.png)

## Static Libraries

- Similar to dynamic libraries
- Code is added into your application at compile time instead of
    runtime. The library becomes part of the image saved on disk
- Your application will not have any dependencies that need to be
    resolved at runtime

## Advantages of Static Linking

- All your code is contained in one file (your exe or lib)
- Easier to ship to a customer
- Could be more secure because you know exactly what you are loading
- Eliminates any issues with missing libraries on the host system

## Disadvantages of Static Linking

- Your program is bigger, and no other program can share its copy of the library code
- If there is a security flaw in your linked code you will still be using the old version
- If library code gets faster or adds support for new hardware, you are stuck on the old version

![static loading](images/static-loading.png)

## Dependency Types

## Implicit Dependency

Module A is implicitly linked with Module B at compile/link time

![implicit](images/implicit-dep.png)

## Explicit Dependency

Module A is not linked with Module B at compile/link time. At runtime,
Module A dynamically loads Module B via a LoadLibrary-type function (`dlopen` on Linux)

![explicit](images/explicit-dep.png)

## Forward Dependency

Module A is linked with a LIB file for Module B at compile/link time,
and Module A's source code actually calls one or more functions in
Module B. One of the functions called in Module B is actually a
forwarded function call to Module C

![forward](images/forward-dep.png)

## Practical Linux Tools

These tools help you inspect libraries and binaries on Linux.

### ldd - list dynamic dependencies

```bash
$ ldd /bin/ls
    linux-vdso.so.1 (0x00007ffd...)
    libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1
    libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6
```

`ldd` prints every shared library a binary depends on and where the
dynamic linker found it. If a dependency is missing you see "not found",
which is the root cause of most "works on my machine" failures.

### nm - list symbols in an object file

```bash
$ nm -D /lib/x86_64-linux-gnu/libm.so.6 | grep " cos@"
0000000000033e10 W cos@@GLIBC_2.2.5
```

`nm` shows the symbol table. `T` means the symbol is defined in the
text (code) section, `W` means it is a weak symbol (glibc exports `cos` as a
weak alias), and `U` means it is undefined (required from another library).
Use the real file `libm.so.6`, because `libm.so` on a modern glibc system is a
small linker script that points at it.

### objdump - disassemble and inspect binaries

```bash
$ objdump -d my_program | head -40   # disassemble
$ objdump -p my_program              # show dynamic section / needed libs
```

### LD_PRELOAD - inject a library at runtime

`LD_PRELOAD` lets you load a custom shared library *before* any other,
overriding symbols from the standard library. This is useful for
debugging and testing:

```bash
# Replace malloc/free with a custom implementation for one run
LD_PRELOAD=./mymalloc.so ./my_program
```

This is how many memory profilers and leak checkers intercept library calls
like `malloc` without recompiling the target program. `strace` works
differently: it uses the `ptrace` system call to stop the program every time it
makes a system call.

### ldconfig - rebuild the shared library cache

```bash
sudo ldconfig          # rebuild /etc/ld.so.cache
ldconfig -p | grep ssl # search the cache
```

When you install a new `.so` file into a directory such as `/usr/local/lib`,
the dynamic linker will not find it until you run `ldconfig`. It scans the
directories listed in `/etc/ld.so.conf`, creates the soname symlinks, and
rebuilds the cache that maps library names to file paths. For a library in
your own build directory, set `LD_LIBRARY_PATH` instead:
`LD_LIBRARY_PATH=. ./my_program`.
