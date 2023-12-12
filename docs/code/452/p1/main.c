#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <readline/readline.h>
#include "../src/lab.h"

int main(void)
{
  char *line = (char *)NULL;
  char *version = getVersion();
  line = readline("What is your name?");
  printf("Hello %s! This is the starter template version: %s\n", line, version);
  return 0;
}
