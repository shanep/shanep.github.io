| Rule | State | Src IP | Src Port | Dst IP | Dst Port | Proto | Action |
|---|---|---|---|---|---|---|---|
| #1 | NEW | 172.16.0.0/24 | * | * | 80, 443 | TCP | ACCEPT |
| #2 | NEW | * | * | 172.16.20.5 | 22 | TCP | ACCEPT |
| #3 | ESTABLISHED | * | * | * | * | TCP | ACCEPT |
| #4 | * | * | * | * | * | * | DROP |
