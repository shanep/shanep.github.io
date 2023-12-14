#ifndef LAB_H
#define LAB_H

#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>


#ifdef __cplusplus
extern "C"
{
#endif
  /**
   * The default amount of memory that this memory manger will manage unless
   * explicitly set with buddy_init. The number of bytes is calculated as 2^DEFAULT_K
   */
#define DEFAULT_K 30

  /**
   * The minimum size of the buddy memory pool.
   */
#define MIN_K 20

  /**
   * The maximum size of the buddy memory pool. This is 1 larger than needed
   * to allow indexes 1-N instead of 0-N. Internally the maximum amount of
   * memory is MAX_K-1
   */
#define MAX_K 48

  /**
   * The smallest memory block size that can be returned by buddy_malloc value must
   * be large enough to account for the avail header.
   */
#define SMALLEST_K 6

#define BLOCK_AVAIL    1  /*Block is available to allocate*/
#define BLOCK_RESERVED 0  /*Block has been handed to user*/
#define BLOCK_UNUSED   3  /*Block is not used at all*/

  /**
   * Struct to represent the table of all available blocks do not reorder members
   * of this struct because internal calculations depend on the ordering.
   */
  struct avail
  {
    unsigned short int tag;     /*Tag for block status BLOCK_AVAIL, BLOCK_RESERVED*/
    unsigned short int kval;    /*The kval of this block*/
    struct avail *next;         /*next memory block*/
    struct avail *prev;         /*prev memory block*/
  };

  /**
   * The buddy memory pool.
   */
  struct buddy_pool
  {
    size_t kval_m;              /*The max kval of this pool*/
    size_t numbytes;            /*The number of bytes this pool is managing*/
    void *base;                 /*Base address used to scale memory for buddy calculations*/
    struct avail avail[MAX_K];  /*The array of available memory blocks*/
  };

  /**
   * Converts bytes to its equivalent K value defined as bytes <= 2^K
   * @param bytes The bytes needed
   * @return K The number of bytes expressed as 2^K
   */
  size_t btok(size_t bytes);


  /**
   * Find the buddy of a given pointer and kval relative to the base address we got from mmap
   * @param pool The memory pool to work on (needed for the base addresses)
   * @param buddy The memory block that we want to find the buddy for
   * @return A pointer to the buddy
   */
  struct avail *buddy_calc(struct buddy_pool *pool, struct avail *buddy);

  /**
   * Allocates a block of size bytes of memory, returning a pointer to
   * the beginning of the block. The content of the newly allocated block
   * of memory is not initialized, remaining with indeterminate values.
   *
   * If size is zero, the return value will be NULL
   * If pool is NULL, the return value will be NULL
   *
   * @param pool The memory pool to alloc from
   * @param size The size of the user requested memory block in bytes
   * @return A pointer to the memory block
   */
  void *buddy_malloc(struct buddy_pool *pool, size_t size);

  /**
   * A block of memory previously allocated by a call to malloc,
   * calloc or realloc is deallocated, making it available again
   * for further allocations.
   *
   * If ptr does not point to a block of memory allocated with
   * the above functions, it causes undefined behavior.
   *
   * If ptr is a null pointer, the function does nothing.
   * Notice that this function does not change the value of ptr itself,
   * hence it still points to the same (now invalid) location.
   *
   * @param pool The memory pool
   * @param ptr Pointer to the memory block to free
   */
  void buddy_free(struct buddy_pool *pool, void *ptr);

  /**
   * Changes the size of the memory block pointed to by ptr.
   * The function may move the memory block to a new location
   * (whose address is returned by the function).
   * The content of the memory block is preserved up to the
   * lesser of the new and old sizes, even if the block is
   * moved to a new location. If the new size is larger,
   * the value of the newly allocated portion is indeterminate.
   *
   * In case that ptr is a null pointer, the function behaves
   * like malloc, assigning a new block of size bytes and
   * returning a pointer to its beginning.
   *
   * if size is equal to zero, and ptr is not NULL, then the  call
   * is equivalent to free(ptr)
   *
   * @param pool The memory pool
   * @param ptr Pointer to a memory block
   * @param size The new size of the memory block
   * @return Pointer to the new memory block
   */
  void *buddy_realloc(struct buddy_pool *pool, void *ptr, size_t size);

  /**
   * Initialize a new memory pool using the buddy algorithm. Internally,
   * this function uses mmap to get a block of memory to manage so should be
   * portable to any system that implements mmap. This function will round
   * up to the nearest power of two. So if the user requests 503MiB
   * it will be rounded up to 512MiB.
   *
   * Note that if a 0 is passed as an argument then it initializes
   * the memory pool to be of the default size of DEFAULT_K. If the caller
   * specifies an unreasonably small size, then the buddy system may
   * not be able to satisfy any requests.
   *
   * NOTE: Memory pools returned by this function can not be intermingled.
   * Calling buddy_malloc with pool A and then calling buddy_free with
   * pool B will result in undefined behavior.
   *
   * @param size The size of the pool in bytes.
   * @param pool A pointer to the pool to initialize
   */
  void buddy_init(struct buddy_pool *pool, size_t size);

  /**
   * Inverse of buddy_init.
   *
   * Notice that this function does not change the value of pool itself,
   * hence it still points to the same (now invalid) location.
   *
   * @param pool The memory pool to destroy
   */
  void buddy_destroy(struct buddy_pool *pool);

  /**
   * @brief Entry to a main function for testing purposes
   *
   * @param argc system argc
   * @param argv system argv
   * @return exit status
   */
  int myMain(int argc, char** argv);

#ifdef __cplusplus
} //extern "C"
#endif

#endif
