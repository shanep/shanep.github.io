| Aspect | Machine Emulator | Type 2 Hypervisor | Type 1 Hypervisor | Bare-metal machine |
| --- | --- | --- | --- | --- |
| **Architecture** | Code-based architecture emulation | Runs in host OS, provides virtualisation service for hardware | Runs directly on system hardware | No virtualisation |
| **Advantages** | Easy to use, Fine-grained introspection, Powerful control over the system state | Easy to use, Fine-grained introspection, Powerful control over the system state | Medium transparency, Fine-grained introspection, Low overhead for hardware interaction | High transparency, No virtual environment artifacts |
| **Disadvantages** | Low transparency, Unreliability support of architecture semantics | Low transparency, Artifacts from para-virtualisation | Less control over the system state | Lack of fine-grained introspection, Scalability and cost issues, Slower to restore to clean state |
| **Examples** | Unicorn [611], QEMU [612], Bochs [613] | VirtualBox [614], KVM [615], VMware [616] | VMwareESX [617], Hyper-V [618], Xen [619] | NVMTrace [620], BareCloud [596] |
