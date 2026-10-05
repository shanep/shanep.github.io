#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "lab.h"

// The test build compiles this file too, so rename main to keep it from
// clashing with the main function in tests/lab-test.c
#ifdef TEST
#define main main_exclude
#endif

int main(void)
{
  char *line = NULL;
  size_t len = 0;
  char *version = getVersion();
  printf("What is your name? ");
  if (getline(&line, &len, stdin) == -1)
    {
      fprintf(stderr, "No name entered\n");
      free(line);
      free(version);
      return 1;
    }
  line[strcspn(line, "\n")] = '\0';
  printf("Hello %s! This is the starter template version: %s\n", line, version);
  return 0;
}
