#include <stdio.h>
#include <stdlib.h>
#include <readline/readline.h>
#include <readline/history.h>
#include "lab.h"

// The test build compiles this file too, so rename main to keep it from
// clashing with the main function in tests/lab-test.c
#ifdef TEST
#define main main_exclude
#endif

int main(int argc, char *argv[])
{
  parse_args(argc, argv);
  struct shell sh;
  sh_init(&sh);

  char *line;
  using_history();
  while ((line = readline(sh.prompt)))
    {
      // TODO: Replace this echo with the work from Tasks 6 through 10
      printf("%s\n", line);
      add_history(line);
      free(line);
    }
  sh_destroy(&sh);
  return 0;
}
