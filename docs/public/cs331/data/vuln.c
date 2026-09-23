/* vuln.c -- the program you analyse in CS 331, Lab 8.
 *
 * This is a door-badge reader.  It takes a badge ID, checks it against a
 * list, and returns whether the holder may open the door.
 *
 * You will NOT run this program and you will NOT attack it.  Lab 8 asks you
 * to read it, work out the layout it produces on the stack, and say what a
 * long badge ID would do to that layout.  Everything you need is visible in
 * the source and in the assembly that Compiler Explorer shows you.
 *
 * Compile in Compiler Explorer (https://godbolt.org/) with:
 *     compiler: x86-64 gcc (any recent version)
 *     flags:    -O0 -fno-stack-protector
 *
 * CS 331 -- Computer Security and Information Assurance
 */

#include <stdio.h>
#include <string.h>

#define BADGE_BUFFER_SIZE 32

/* The one badge ID that opens the server-room door. */
static const char *ADMIN_BADGE = "ADMIN-0001";

/*
 * Check a badge and report whether it opens the door.
 *
 * Returns 1 if the badge is the administrator's badge, 0 otherwise.
 */
int check_badge(const char *badge_id)
{
    char buffer[BADGE_BUFFER_SIZE];
    int authorized = 0;

    /* Copy the caller's badge ID into our local buffer so we can work on it.
     *
     * strcpy copies until it finds a zero byte.  It is never told how big
     * `buffer` is, and it never checks.  Everything in Lab 8 follows from
     * that one fact.
     */
    strcpy(buffer, badge_id);

    if (strcmp(buffer, ADMIN_BADGE) == 0) {
        authorized = 1;
    }

    return authorized;
}

/*
 * A second copy of the same routine, with the bug fixed, for comparison in
 * the last part of Lab 8.  Note that this version needs to be told the size
 * of the destination -- that is the whole difference.
 */
int check_badge_fixed(const char *badge_id)
{
    char buffer[BADGE_BUFFER_SIZE];
    int authorized = 0;

    if (strlen(badge_id) >= sizeof buffer) {
        return 0;                       /* fail safe: reject, do not truncate */
    }

    memcpy(buffer, badge_id, strlen(badge_id) + 1);

    if (strcmp(buffer, ADMIN_BADGE) == 0) {
        authorized = 1;
    }

    return authorized;
}

int main(int argc, char **argv)
{
    if (argc != 2) {
        fprintf(stderr, "usage: %s <badge-id>\n", argv[0]);
        return 2;
    }

    if (check_badge(argv[1])) {
        printf("door opens\n");
        return 0;
    }

    printf("access denied\n");
    return 1;
}
