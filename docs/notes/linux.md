# Linux

## Language Servers

- rust language server

```bash
make rust-analyzer
```

- clangd language server

```bash
./scripts/clang-tools/gen_compile_commands.py
```

## Rust Docs

```bash
make LLVM=1 rustdoc
```

To read the docs locally in your web browser, run e.g.:

```bash
xdg-open Documentation/output/rust/rustdoc/kernel/index.html
```
