class Zahlenmaschine {
    constructor() {
        this.instructionPointer = 0;
        this.accumulator = 0;
        this.r1 = 0;
        this.r2 = 0;
        this.status = false;
        this.running = true;
        this.specification = "1"
    }

    parseCode(string_code){
        let code = [];
        for(let i = 0; i < string_code.length; i++){
            // find comment
            let comment = string_code[i].trim().split(';').length > 1 ? string_code[i].trim().split(';')[1] : undefined;
            
            // annotation ";zminst v1" may be used to select specification
            if (comment?.startsWith("zminst v")){
                this.selectSpecVersion(comment)
            }
            
            let instruction = string_code[i].trim().split(';')[0]

            let tokens = instruction.split(' ')
        
            let operation = tokens[0]
            if(operation == ""){
                continue;
            }
            
            let arg1 = (tokens.length > 1) ? tokens[1] : undefined;
            let arg2 = (tokens.length > 2) ? tokens[2] : undefined;
            let codePosition = i;
            code.push({
                operation, arg1, arg2, codePosition
            })
        }
        return code;
    }

    enterCode(code) {
        this.code = this.parseCode(code.split("\n"))
    }

    selectSpecVersion(comment) {
        this.specification = comment.split("zminst v")[1]
    }

    operationDict = {
        'acc' : (arg1, arg2) => {
            this.accumulator += Number(arg1);
        },
        'nop' : (arg1, arg2) => {
            console.log("Nothing happened...");
        },
        'jmp' : (arg1, arg2) => {
            this.instructionPointer += Number(arg1);
        },
        'jab' : (arg1, arg2) => { // Absolute jump
            this.instructionPointer = Number(arg1);
        },
        'end' : (arg1, arg2) => {
            this.endWith(arg1);
        },
        'rst' : (arg1, arg2) => {
            this.accumulator = 0;
            this.r1 = 0;
            this.r2 = 0;
            this.status = false;
        },
        'jtr' : (arg1, arg2) => {
            if(this.status){
                this.instructionPointer = Number(arg1); 
            }
        },
        'grt' : (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) > Number(arg2)
        },
        'geq' : (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) >= Number(arg2)
        },
        'equ' : (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) == Number(arg2)
        },
        'leq' : (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) <= Number(arg2)
        },
        'les' : (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) < Number(arg2)
        },
        'add' : (arg1, arg2) => {
            this.r1 = Number(this.getStorageValue(arg1)) + Number(arg2)
        },
        'adr' : (arg1, arg2) => {
            this.r1 = Number(this.getStorageValue(arg1)) + Number(this.getStorageValue(arg2))
        },
        'sub' : (arg1, arg2) => {
            this.r1 = Number(this.getStorageValue(arg1)) - Number(arg2)
        },
        'mul' : (arg1, arg2) => {
            this.r1 = Number(this.getStorageValue(arg1)) * Number(arg2)
        },
        'neg' : (arg1, arg2) => {
            this.r1 = - Number(this.getStorageValue(arg1))
        },
        'mov' : (arg1, arg2) => {
            this.setStorageValue(arg2, this.getStorageValue(arg1))
        }
    }

    setStorageValue(argument, value) {
        if(argument == "acc"){
           this.accumulator = value;
        }
        if(argument == "isp"){
            this.instructionPointer = value;
        }
        if(argument == "sta"){
            this.status = value;
        }
        if(argument == "r1"){
            this.r1 = value;
        }
        if(argument == "r2"){
            this.r2 = value;
        }
        if(argument == "nul"){
            // Can't overwrite null!
        }
    }
    
    getStorageValue(argument){
        if(argument == "acc"){
            return this.accumulator;
        }
        if(argument == "isp"){
            return this.instructionPointer;
        }
        if(argument == "sta"){
            return Number(this.status);
        }
        if(argument == "r1"){
            return Number(this.r1);
        }
        if(argument == "r2"){
            return Number(this.r2);
        }
        if(argument == "nul"){
            return 0;
        }
    }

    executeStep() {
        if(!this.running){
            alert("The Zahlenmaschine is not running!");
            return;
        }

        // fetch instruction
        let instruction = this.code[this.instructionPointer];
        this.markInstruction(instruction)

        // perform action according to operation
        let prevIP = this.instructionPointer;
        this.operationDict[instruction.operation](instruction.arg1, instruction.arg2);

        // increment instruction pointer
        if (prevIP == this.instructionPointer){
            this.instructionPointer++;
        }
    }

    endWith(arg){
        alert("Zahlenmaschine shutdown with " + arg);
        this.running = false;
    }

    markInstruction(instruction){
        // Move this somewhere else -> callback in index.js?
        this.markedInstruction?.clear()
        this.markedInstruction = codeMirror.doc.markText({line: instruction.codePosition,ch: 0}, {line:instruction.codePosition, ch: 99}, {className: "marked"})
    }
}