// push constant 2
@2
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 3
@3
D=A
@SP
A=M
M=D
@SP
M=M+1
// add
// pop off stack
@SP
// pop off stack (SP--)
M=M-1
A=M
D=M
@R13 // Store this temporarily
M=D
// Pop another off the stack
@SP
M=M-1
A=M
D=M
// do add operation
@R13
D=D+M
// push it back onto the stack
@SP
A=M
M=D
@SP
M=M+1
(END)
  @END
  0;JMP
