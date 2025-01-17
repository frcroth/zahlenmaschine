export default class Zahlenmaschine {
    constructor() {
        this.initRegisters();
        this.running = true;
        this.specification = "1";

        this.initIO();
        this.stack = [];

        this.randomRange = { lower: 0, upper: 100 }
    }

    initRegisters() {
        this.instructionPointer = 0;
        this.accumulator = 0;
        this.r0 = 0;
        this.r1 = 0;
        this.r2 = 0;
        this.status = false;
    }

    initIO() {
        this.outputProps = {
            mode: "queue"
        };
        this.inputProps = {
            mode: "queue"
        };

        this.inputQueue = [];
        this.outputQueue = [];
    }

    connectWithUI(object) {
        this.ui = object;
        /* A ui may implement the calls:
        *  refreshInputs() -> is called every time the inputs change
        *  refreshOutputs() -> is called every time the outputs change
        *  refreshStack() -> is called every time the stack changes
        *  markInstruction(instruction) -> is called when an instruction is executed
        */
    }

    parseCode(string_code) {
        let code = [];
        this.labels = [];
        let instructionIndex = 0;
        let pending_labels = []; // labels that have no code associated
        for (let i = 0; i < string_code.length; i++) {
            // find comment
            let comment = string_code[i].trim().split(';').length > 1 ? string_code[i].trim().split(';')[1] : undefined;

            // annotation ";zminst v1" may be used to select specification
            if (comment?.startsWith("zminst v")) {
                this.selectSpecVersion(comment);
            }

            let instruction = string_code[i].trim().split(';')[0].trim()
            instruction = instruction.toLowerCase()

            // find label
            if (instruction.endsWith(':')) {
                let labelName = instruction.split(':')[0]
                pending_labels.push(labelName);
                continue;
            }

            let tokens = instruction.split(' ');

            let operation = tokens[0];
            if (operation == "") {
                continue;
            }

            let arg1 = (tokens.length > 1) ? tokens[1] : undefined;
            let arg2 = (tokens.length > 2) ? tokens[2] : undefined;
            let codePosition = i;

            if (!Object.keys(this.operationDict).includes(operation)) {
                this.unknownOperation(operation);
            }

            // fix pending labels
            for (const labelName of pending_labels) {
                this.labels.push({ name: labelName, line: instructionIndex })
            }
            pending_labels = []

            code.push({
                operation, arg1, arg2, codePosition, instructionIndex
            })
            instructionIndex++;
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
        'acc': (arg1, arg2) => {
            this.accumulator += this.getValue(arg1);
        },
        'nop': (arg1, arg2) => {
            // console.log("Nothing happened...");
        },
        'jmp': (arg1, arg2) => {
            this.current_command_effects_ip = true;
            if (this.getLabel(arg1)) {
                this.instructionPointer = Number(this.getLabel(arg1).line)
            } else {
                this.instructionPointer = Number(arg1);
            }

        },
        'jre': (arg1, arg2) => { // Relative jump
            this.current_command_effects_ip = true;
            this.instructionPointer += Number(arg1);
        },
        'end': (arg1, arg2) => {
            this.endWith(this.getValue(arg1));
        },
        'rst': (arg1, arg2) => {
            this.accumulator = 0;
            this.r0 = 0;
            this.r1 = 0;
            this.r2 = 0;
            this.status = false;
        },
        'jtr': (arg1, arg2) => {
            if (this.status) {
                this.current_command_effects_ip = true;
                if (this.getLabel(arg1)) {
                    this.instructionPointer = Number(this.getLabel(arg1).line);
                } else {
                    this.instructionPointer = Number(arg1);
                }
            }
        },
        'grt': (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) > this.getValue(arg2);
        },
        'geq': (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) >= this.getValue(arg2);
        },
        'equ': (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) == this.getValue(arg2);
        },
        'leq': (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) <= this.getValue(arg2);
        },
        'les': (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) < this.getValue(arg2);
        },
        'neq': (arg1, arg2) => {
            this.status = this.getStorageValue(arg1) != this.getValue(arg2);
        },
        'add': (arg1, arg2) => {
            this.r0 = Number(this.getStorageValue(arg1)) + this.getValue(arg2);
        },
        'sub': (arg1, arg2) => {
            this.r0 = Number(this.getStorageValue(arg1)) - this.getValue(arg2);
        },
        'mul': (arg1, arg2) => {
            this.r0 = Number(this.getStorageValue(arg1)) * this.getValue(arg2);
        },
        'neg': (arg1, arg2) => {
            this.r0 = - Number(this.getValue(arg1));
        },
        'mod': (arg1, arg2) => {
            this.r0 = Number(this.getStorageValue(arg1)) % this.getValue(arg2);
        },
        'div': (arg1, arg2) => {
            let dividend = this.getValue(arg2);
            if (dividend == 0) {
                this.divideByZero();
            } else {
                this.r0 = Number(this.getStorageValue(arg1)) / dividend;
            }
        },
        'cei': (arg1, arg2) => {
            this.r0 = Math.ceil(Number(this.getValue(arg1)));
        },
        'flo': (arg1, arg2) => {
            this.r0 = Math.floor(Number(this.getValue(arg1)));
        },
        'mov': (arg1, arg2) => {
            this.setStorageValue(arg2, this.getValue(arg1));
        },
        'swp': (arg1, arg2) => {
            let arg1Value = this.getStorageValue(arg1);
            this.setStorageValue(arg1, this.getStorageValue(arg2));
            this.setStorageValue(arg2, this.getStorageValue(arg1));
        },
        'inp': async (arg1, arg2) => {
            await this.input(arg1);
        },
        'out': (arg1, arg2) => {
            this.output(arg1);
        },
        'rnr': (arg1, arg2) => {
            this.randomRange = { lower: Number(arg1), upper: Number(arg2) }
        },
        'top': (arg1, arg2) => {
            this.setStorageValue(arg1, this.top());
        },
        'pus': (arg1, arg2) => {
            this.push(this.getValue(arg1));
        },
        'pop': (arg1, arg2) => {
            this.setStorageValue(arg1, this.pop());
        },
        'bra': (arg1, arg2) => {
            this.current_command_effects_ip = true;
            if (this.getLabel(arg1)) {
                this.push(this.instructionPointer + 1);
                this.instructionPointer = Number(this.getLabel(arg1).line)
            } else {
                this.push(this.instructionPointer + 1);
                this.instructionPointer = Number(arg1);
            }

        },
        'brc': (arg1, arg2) => {
            if (this.status) {
                this.current_command_effects_ip = true;
                if (this.getLabel(arg1)) {
                    this.push(this.instructionPointer + 1);
                    this.instructionPointer = Number(this.getLabel(arg1).line)
                } else {
                    this.push(this.instructionPointer + 1);
                    this.instructionPointer = Number(arg1);
                }
            }
        },
        'ret': (arg1, arg2) => {
            this.current_command_effects_ip = true;
            this.instructionPointer = this.pop();
        },
    }

    getLabel(string) {
        return this.labels.find((label) => label.name == string);
    }

    setStorageValue(argument, value) {
        if (argument == "acc") {
            this.accumulator = value;
        }
        if (argument == "isp") {
            this.instructionPointer = value;
            this.current_command_effects_ip = true;
        }
        if (argument == "sta") {
            this.status = value;
        }
        if (argument == "r0") {
            this.r0 = value;
        }
        if (argument == "r1") {
            this.r1 = value;
        }
        if (argument == "r2") {
            this.r2 = value;
        }
        if (argument == "nul") {
            // Can't overwrite null!
        }
        if (argument == "rnd") {
            // Can't overwrite rnd!
        }
    }

    getValue(argument) {
        let storageValue = this.getStorageValue(argument);
        if (storageValue != undefined) {
            return Number(storageValue);
        }
        if (isNaN(Number(argument))) {
            this.notANumber(argument);
            return 0;
        }
        return Number(argument);
    }

    getStorageValue(argument) {
        if (argument == "acc") {
            return this.accumulator;
        }
        if (argument == "isp") {
            return this.instructionPointer;
        }
        if (argument == "sta") {
            return Number(this.status);
        }
        if (argument == "r0") {
            return Number(this.r0);
        }
        if (argument == "r1") {
            return Number(this.r1);
        }
        if (argument == "r2") {
            return Number(this.r2);
        }
        if (argument == "nul") {
            return 0;
        }
        if (argument == "rnd") {
            let min = Math.ceil(this.randomRange.lower);
            let max = Math.floor(this.randomRange.upper);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        if (argument == "stc") {
            return this.stack.length;
        }
    }

    async executeStep() {
        if (!this.running) {
            alert("The Zahlenmaschine is not running!");
            return;
        }

        // Check instruction pointer
        if (this.instructionPointer == this.code.length) {
            this.endWith();
            return;
        }
        if (this.instructionPointer < 0 || this.instructionPointer > this.code.length) {
            this.invalidInstructionPointer();
            return;
        }

        // fetch instruction
        let instruction = this.code[this.instructionPointer];
        this.markInstruction(instruction);

        // perform action according to operation
        this.current_command_effects_ip = false;
        //console.log(this.instructionPointer + ": EXECUTING " + instruction.operation + " with arguments " + instruction.arg1 + " " + instruction.arg2)
        await this.operationDict[instruction.operation](instruction.arg1, instruction.arg2);

        // increment instruction pointer
        if (!this.current_command_effects_ip) {
            this.instructionPointer++;
        }
    }

    async input(arg1) {
        let value
        if (this.inputProps.mode == 'interactive') {
            value = Number(prompt());
        }
        else if (this.inputProps.mode == 'queue') {
            while (!this.hasInput()) // wait for input, block execution
                await new Promise(resolve => setTimeout(resolve, 250));
            value = this.consumeInput();
        }
        else if (this.inputProps.mode == 'connection') {
            value = await this.inputProps.connection.consumeOutput();
        }
        this.setStorageValue(arg1, value);
    }

    output(arg1) {
        let value = this.getValue(arg1);
        if (this.outputProps.mode == 'interactive') {
            alert(value);
        }
        else if (this.outputProps.mode == 'queue') {
            this.addOutput(value)
        }
        else if (this.outputProps.mode == 'connection') {
            this.outputProps.connection.addInput(value);
        }
    }

    setInputModeInteractive() {
        this.inputProps = {
            mode: 'interactive'
        }
    }

    setOutputModeInteractive() {
        this.outputProps = {
            mode: 'interactive'
        }
    }

    setInputModeQueue() {
        this.inputProps = {
            mode: 'queue'
        }
    }

    setOutputModeQueue() {
        this.outputProps = {
            mode: 'queue'
        }
    }

    connectToOutputOf(zahlenmaschine) {
        this.inputProps = {
            mode: 'connection',
            connection: zahlenmaschine
        }
    }

    connectToInputOf(zahlenmaschine) {
        this.outputProps = {
            mode: 'connection',
            connection: zahlenmaschine
        }
    }

    endWith(arg) {
        if (!!arg) {
            alert("Zahlenmaschine terminated with " + arg);
        } else {
            alert("Zahlenmaschine terminated.");
        }

        this.running = false;
        this.ui.machineDone();
    }

    markInstruction(instruction) {
        this.ui.markInstruction(instruction);
    }

    addInput(input) {
        this.inputQueue.push(Number(input));
        this.ui.refreshInputs();
    }

    hasInput() {
        return this.inputQueue.length > 0;
    }

    hasOutput() {
        return this.outputQueue.length > 0;
    }

    consumeInput() {
        if (this.hasInput()) {
            let value = this.inputQueue.shift();
            this.ui.refreshInputs();
            return value;
        }
    }

    async consumeOutput() {
        while (!this.hasOutput()) // wait for input, block execution
            await new Promise(resolve => setTimeout(resolve, 250));
        let value = this.outputQueue.shift();
        this.ui.refreshOutputs();
        return value;
    }

    getInput() {
        return this.inputQueue;
    }

    getOutput() {
        return this.outputQueue;
    }

    addOutput(value) {
        this.outputQueue.push(value);
        this.ui.refreshOutputs();
    }

    getStack() {
        return this.stack.slice(); // Return copy
    }

    top() {
        return this.stack[this.stack.length - 1];
    }

    pop() {
        let element = this.stack.pop();
        this.ui.refreshStack();
        return element;
    }

    push(arg) {
        this.stack.push(arg);
        this.ui.refreshStack();
    }

    divideByZero() {
        this.ui.setWarning("Could not execute command at " + this.instructionPointer + ": Dividing by zero!");
    }

    invalidInstructionPointer() {
        this.endWith("Invalid instruction address!");
        this.ui.setWarning("Could not execute command at " + this.instructionPointer + ": Invalid instruction address!");
    }

    unknownOperation(operation) {
        this.ui.setWarning("Unknown operation '" + operation + "'. Loaded code may not execute.");
    }

    notANumber(argument) {
        this.ui.setWarning("Could not execute command at " + this.instructionPointer + ": Could not interpret '" + argument + "' as a number.")
    }
}
