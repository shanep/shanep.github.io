#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "lab.h"

static inline node_t *node_new()
{
    node_t *rval = (node_t *)malloc(sizeof(node_t));
    memset(rval, 0, sizeof(node_t));
    rval->next = rval->prev = rval;
    return rval;
}

list_t *list_init(void (*destroy_data)(void *),
                             int (*compare_to)(const void *, const void *))
{
    list_t *lst = (list_t *)malloc(sizeof(list_t));
    lst->destroy_data = destroy_data;
    lst->compare_to = compare_to;
    lst->head = node_new();
    lst->size = 0;
    return lst;
}

void list_destroy(list_t **list)
{
    list_t *lst = *list;
    node_t *curr = lst->head->next;
    node_t *tmp = NULL;
    while (curr != lst->head)
    {
        tmp = curr;
        curr = curr->next;
        lst->destroy_data(tmp->data);
        free(tmp);
    }
    free(lst->head);
    free(lst);
    *list = NULL;
}

list_t *list_add(list_t *list, void *data)
{
    node_t *node = node_new();
    node->data = data;
    //Setup the links for the new node
    node->next = list->head->next;
    node->prev = list->head;

    list->head->next->prev = node;
    list->head->next = node;
    list->size++;
    return list;
}

int list_indexof(list_t *list, void *data)
{
    int idx = -1;
    node_t *curr = list->head->next;
    for (int i =0; curr != list->head; i++, curr = curr->next)
    {
        if (list->compare_to(curr->data, data) == 0)
        {
             idx = i;
             break;
        }
    }
    return idx;
}

void *list_remove_index(list_t *list, size_t index)
{
    if (index >= list->size)
        return NULL;

    node_t *curr = list->head->next;
    for (size_t i = 0; i < index; i++)
    {
        curr = curr->next;
    }
    void *rval = curr->data;
    list->size--;
    curr->prev->next = curr->next;
    curr->next->prev = curr->prev;
    free(curr);
    return rval;
}
