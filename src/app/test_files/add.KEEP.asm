// Supports comments
// And empty new lines

// push constant 2
@2
D=A
@SP
M=M+1
A=M-1
M=D
// push constant 3
@3
D=A
@SP
M=M+1
A=M-1
M=D
// add
@SP
AM=M-1
D=M
A=A-1
M=D+M
(END)
  @END
  0;JMP
