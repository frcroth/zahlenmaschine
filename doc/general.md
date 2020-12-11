# User guide

### Zahlenmaschine

The Zahlenmaschine is programmed with *Zahlenmaschine Instructions* or *zminst* in short. It is a platform specific assembly dialect. Only one instruction may be performed at any time.

### Storage

Storage describes places in the machine's memory. There is no memory layout but there are some registers.

*   `acc` - Accumulator, may be used as a general purpose register
*   `sta` - Status register, stores results of comparisons
*   `isp` - Instruction pointer, determines the next instruction
*   `r0` - Data register 0, stores results of data operations
*   `r1` - Data register 1, may be used to store data
*   `r2` - Data register 2, may be used to store data

**Read only Storage**

*   `nul` - Null, always 0
*   `rnd` - Random, reading from this register will yield a random number. Ranges may be set with the rnr instruction
*   `stc` - Stack count

### Stack

There is a stack that can be accessed with the operations `psh`, `pop` and `top` (described below). Note that it may only be used as a stack, elements that are not on top may not be accessed. The stack can be used by the aforementioned method. Branching into subroutines uses the stack as well, to save and restore the instruction pointer. So make sure that the stack is in a correct state when you return with `ret`.

### Other language concepts

Comments may be added with the `;` character. All content in the line behind this character will be ignored.
Labels can be added by writing a string and ending it with the `:` character. Labels may be used to jump to them.

#### Data type

There is only one data type that is supported: integer numbers.
