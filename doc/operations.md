## Instructions

Instruction are written in the format `operation arg1 arg2`, with each instruction on a separate line. Operations may be upper or lower case.

| Operation                | arg1              | arg2             | Explanation                                                                                                |
| ------------------------ | ----------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| acc                      | Storage / Number  | -                | Add Number (or Number in Storage) (may be negative) to accumulator.                                        |
| *Jumps*                  |                   |                  |                                                                                                            |
| jmp                      | Number/Label      | -                | Jump to Number/Label                                                                                       |
| jre                      | Number            | -                | Jump Number instructions (relative).                                                                       |
| jtr                      | Number/Label      | -                | Absolute jump to Number/Label only when status is true.                                                    |
| bra                      | Number/Label      | -                | Branch to subroutine at Number/Label. Instruction pointer is pushed to the stack.                          |
| brc                      | Number/Label      | -                | Branch to subroutine at Number/Label only when status is true. Instruction pointer is pushed to the stack. |
| ret                      | -                 | -                | Return from subroutine. Pop instruction pointer from stack.                                                |
| *Comparisons*            |                   |                  |                                                                                                            |
| grt                      | Storage           | Storage / Number | If value in Storage is greater than value of second argument, set status to true                           |
| geq                      | Storage           | Storage / Number | If value in Storage is greater or equal to value of second argument, set status to true                    |
| equ                      | Storage           | Storage / Number | If value in Storage is equal to value of second argument, set status to true                               |
| leq                      | Storage           | Storage / Number | If value in Storage is less or equal to value of second argument, set status to true                       |
| les                      | Storage           | Storage / Number | If value in Storage is less than value of second argument, set status to true                              |
| neq                      | Storage           | Storage / Number | If value in Storage is not equal to value of second argument, set status to true                           |
| *Working with registers* |                   |                  |                                                                                                            |
| add                      | Storage           | Storage / Number | Add value in Storage / Number to Number, write result into data register r0                                |
| sub                      | Storage           | Storage / Number | Subtract Storage / Number from value in Storage, write result into data register r0                        |
| mul                      | Storage           | Storage / Number | Multiply Storage / Number with value in Storage, write result into data register r0                        |
| neg                      | Storage / Number  | -                | Negate value in Storage or Number, write result into data register r0                                      |
| mod                      | Storage           | Storage / Number | Calculate modulus of value in Storage with value in Storage or Number, write result into data register r0  |
| mov                      | Storage1 / Number | Storage2         | Copy value from Storage1 or Number to Storage2                                                             |
| swp                      | Storage1          | Storage2         | Copy value from Storage1 to Storage2 and value from Storage2 to Storage1                                   |
| *I/O*                    |                   |                  |                                                                                                            |
| inp                      | Storage           |                  | Read one value from input and store it at storage. Will block execution until an input is ready.           |
| out                      | Storage / Number  | -                | Output value of Number or at Storage to out.                                                               |
| *Stack operations*       |                   |                  |                                                                                                            |
| pus                      | Storage / Number  | -                | Push Number or value in Storage to stack                                                                   |
| pop                      | Storage           | -                | Remove the top most value from stack and place it in Storage.                                              |
| top                      | Storage           | -                | Copy the top most value from stack and place it in Storage.                                                |
| *Control operations*     |                   |                  |                                                                                                            |
| nop                      | -                 | -                | Do nothing                                                                                                 |
| rnr                      | Number            | Number           | Set range of random number generator (rnd).                                                                |
| rst                      | -                 | -                | Reset accumulator and data register to 0, reset status to false                                            |
| end                      | Storage / Number  | -                | Stop machine gracefully with return value                                                                  |
