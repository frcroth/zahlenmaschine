// Contains functions to create a new zahlenmaschine

class ZahlenmaschineBox {
    // This class handles creating elements for a Zahlenmaschine

    constructor() {
        this.id = "THISISNOTID";
    }

    euclid = ";zminst v1\n" +
        "; Implementation of euclidean algorithm in zminst\n" +
        "inp acc ;Read first argument from prompt / queue\n" +
        "inp r0 ; Read second argument to r0\n" +
        "loop: ; a label\n" +
        "mov r0 r2\n" +
        "mod acc r0\n" +
        "mov r2 acc\n" +
        "neq r0 0 ; compare r0 != 0\n" +
        "jtr loop\n" +
        "out acc ; output gcd\n" +
        "end"


    getWhiteSpace() {
        let whitespace = document.createElement("span");
        whitespace.innerHTML = "\n      \n      ";
        return whitespace;
    }

    build() {
        let whitespace = document.createElement("span");
        whitespace.innerHTML = "\n      \n      ";

        this.container = document.createElement("div");
        this.container.id = this.id;
        this.container.classList.add("card");

        this.mainRow = document.createElement("div");
        this.mainRow.classList.add("row");
        this.container.appendChild(this.mainRow);

        // Code editor
        this.codeRow = document.createElement("div");
        this.codeRow.classList.add("col-sm");
        this.mainRow.appendChild(this.codeRow)

        this.editorContainer = document.createElement("div");
        this.editorContainer.id = "editor" + this.id;
        this.editorContainer.classList.add("editor");
        this.codeRow.appendChild(this.editorContainer);

        this.IORow = document.createElement("div");
        this.IORow.classList.add("row");
        this.codeRow.appendChild(this.IORow);

        this.inputColumn = document.createElement("div");
        this.inputColumn.classList.add("input");
        this.inputColumn.classList.add("col-s");
        this.inputColumn.innerHTML = "<p>Input Queue</p>";
        this.IORow.appendChild(this.inputColumn);

        this.inputForm = document.createElement("div");
        this.inputForm.classList.add("form-inline");
        this.inputColumn.appendChild(this.inputForm);

        this.inputFormInput = document.createElement("input");
        this.inputFormInput.type = "text";
        this.inputFormInput.classList.add("form-control");
        this.inputFormInput.classList.add("input-sm");
        this.inputFormInput.classList.add("input-text-field");
        this.inputFormInput.placeholder = "42";
        this.inputForm.appendChild(this.inputFormInput);

        this.inputFormButton = document.createElement("button");
        this.inputFormButton.onclick = () => this.addInputPress();
        this.inputFormButton.classList.add("btn");
        this.inputFormButton.classList.add("btn-secondary");
        this.inputFormButton.classList.add("btn-xs");
        this.inputFormButton.classList.add("input-button");
        this.inputFormButton.innerHTML = "Add input";
        this.inputForm.appendChild(this.inputFormButton);

        this.inputList = document.createElement("ul");
        this.inputList.classList.add("list-group");
        this.inputList.classList.add("input-list");
        this.inputColumn.appendChild(this.inputList);

        this.outputColumn = document.createElement("div");
        this.outputColumn.classList.add("col-s");
        this.outputColumn.classList.add("output");
        this.outputColumn.innerHTML = "<p>Output</p>"
        this.IORow.appendChild(this.outputColumn);

        this.outputList = document.createElement("ul");
        this.outputList.classList.add("list-group");
        this.outputList.classList.add("output-list");
        this.outputColumn.appendChild(this.outputList);

        this.controlColumn = document.createElement("div");
        this.controlColumn.classList.add("co-sm");
        this.controlColumn.classList.add("control");
        this.mainRow.appendChild(this.controlColumn);

        this.executeButton = document.createElement("button");
        this.executeButton.title = "Execute program";
        this.executeButton.classList.add("btn");
        this.executeButton.classList.add("btn-secondary");
        this.executeButton.innerHTML = '<i class="fa fa-play"></i>';
        this.executeButton.onclick = () => this.pressExecute()
        this.controlColumn.appendChild(this.executeButton);
        this.controlColumn.appendChild(this.getWhiteSpace());

        this.stepButton = document.createElement("button");
        this.stepButton.title = "Execute one step";
        this.stepButton.classList.add("btn");
        this.stepButton.classList.add("btn-secondary");
        this.stepButton.innerHTML = '<i class="fa fa-step-forward"></i>';
        this.stepButton.onclick = () => this.pressStep();
        this.controlColumn.appendChild(this.stepButton);
        this.controlColumn.appendChild(this.getWhiteSpace());

        this.restartButton = document.createElement("button");
        this.restartButton.title = "Reset";
        this.restartButton.classList.add("btn");
        this.restartButton.classList.add("btn-secondary");
        this.restartButton.innerHTML = '<i class="fa fa-power-off"></i>';
        this.restartButton.onclick = () => this.pressRestart();
        this.controlColumn.appendChild(this.restartButton);

        this.valueTable = document.createElement("table");
        this.controlColumn.appendChild(this.valueTable);

        this.accumulatorRow = document.createElement("tr");
        this.accumulatorRow.innerHTML = "<td>Accumulator</td><td>0</td>";
        this.valueTable.appendChild(this.accumulatorRow);

        this.ipRow = document.createElement("tr");
        this.ipRow.innerHTML = "<td>Instruction Pointer</td><td>0</td>";
        this.valueTable.appendChild(this.ipRow);

        this.statusRow = document.createElement("tr");
        this.statusRow.innerHTML = "<td>Status</td><td>false</td>";
        this.valueTable.appendChild(this.statusRow);

        this.r0row = document.createElement("tr");
        this.r0row.innerHTML = "<td>Register r0</td><td>0</td>";
        this.valueTable.appendChild(this.r0row);

        this.r1row = document.createElement("tr");
        this.r1row.innerHTML = "<td>Register r1</td><td>0</td>";
        this.valueTable.appendChild(this.r1row);

        this.r2row = document.createElement("tr");
        this.r2row.innerHTML = "<td>Register r2</td><td>0</td>";
        this.valueTable.appendChild(this.r2row);

        this.interactiveIOContainer = document.createElement("div");
        this.interactiveIOContainer.classList.add("form-check");

        this.interactiveRadioButton = document.createElement("input");
        this.interactiveRadioButton.onchange = () => this.changeIOMode();
        this.interactiveRadioButton.type = "radio";
        this.interactiveRadioButton.name = "ioMode";
        this.interactiveRadioButton.checked = true;
        this.interactiveRadioButton.classList.add("form-check-input");
        this.interactiveIOContainer.appendChild(this.interactiveRadioButton);
        this.interactiveLabel = document.createElement("label");
        this.interactiveLabel.innerHTML = "Interactive IO (prompt/alert)";
        this.interactiveIOContainer.appendChild(this.interactiveLabel)

        this.controlColumn.appendChild(this.interactiveIOContainer);

        this.nonInteractiveIOContainer = document.createElement("div");
        this.nonInteractiveIOContainer.classList.add("form-check");

        this.nonInteractiveRadioButton = document.createElement("input");
        this.nonInteractiveRadioButton.onchange = () => this.changeIOMode();
        this.nonInteractiveRadioButton.type = "radio";
        this.nonInteractiveRadioButton.name = "ioMode";
        this.nonInteractiveRadioButton.classList.add("form-check-input");
        this.nonInteractiveIOContainer.appendChild(this.nonInteractiveRadioButton);
        this.nonInteractiveLabel = document.createElement("label");
        this.nonInteractiveLabel.innerHTML = "Non interactive IO";
        this.nonInteractiveIOContainer.appendChild(this.nonInteractiveLabel);

        this.controlColumn.appendChild(this.nonInteractiveIOContainer);

        this.stackLabel = document.createElement("p");
        this.stackLabel.innerHTML = "Stack";
        this.controlColumn.appendChild(this.stackLabel);

        this.stackContainer = document.createElement("div");
        this.stackContainer.classList.add("stack");
        this.controlColumn.appendChild(this.stackContainer);

        this.stackList = document.createElement("div");
        this.stackList.classList.add("stack-list");
        this.stackContainer.appendChild(this.stackList);


        // INIT EDITOR
        this.codeMirror = CodeMirror(this.editorContainer, {
            value: this.euclid,
            lineNumbers: true,
            mode: 'zminst',
            theme: 'ayu-dark',
            firstLineNumber: 0
        });

        this.initZahlenmaschine();


        return this.container;
    }

    initZahlenmaschine() {
        this.zm = new Zahlenmaschine();
        this.zm.connectWithUI({
            markInstruction: (instruction) => this.markInstruction(instruction),
            refreshInputs: () => this.refreshInputQueue(),
            refreshOutputs: () => this.refreshOutputs(),
            refreshStack: () => this.refreshStack()
        })
        this.updateInfo();
        this.changeIOMode();
        this.refreshInputQueue();
        this.refreshOutputs();
        this.refreshStack();
        this.zm.enterCode(this.codeMirror.doc.getValue());
        return this.zm;
    }

    refreshInputQueue() {
        let inputs = this.zm.getInput();
        this.addInputsToList(inputs, this.inputList);
    }

    refreshOutputs() {
        let outputs = this.zm.getOutput();
        this.addInputsToList(outputs, this.outputList);
    }

    addInputsToList(items, node, additionalClass = undefined) {
        node.innerHTML = "";
        for (let item of items) {
            let listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.classList.add("py-0");
            if (additionalClass) {
                listItem.classList.add(additionalClass);
            }
            listItem.innerHTML = item;
            node.appendChild(listItem);
        }
    }

    refreshStack() {
        let stack = this.zm.getStack().reverse();
        this.addInputsToList(stack, this.stackList, "stack-list-item");
    }

    async pressExecute() {
        this.stopped = false;
        this.zm.enterCode(this.codeMirror.doc.getValue());
        this.executeButton.onclick = () => this.pressStop();
        this.executeButton.innerHTML = "<i class=\"fa fa-pause\"></i>";
        this.executeButton.title = "Stop execution";
        while (this.zm.running && !this.stopped) {
            this.zm.executeStep();
            this.updateInfo()
            await new Promise(resolve => setTimeout(resolve, 700));
        }
    }

    pressStop() {
        this.executeButton.onclick = () => this.pressExecute();
        this.executeButton.setAttribute("title", "Execute program");
        this.executeButton.innerHTML = "<i class=\"fa fa-play\"></i>";
        this.stopped = true;
    }

    pressStep() {
        this.zm.enterCode(this.codeMirror.doc.getValue());
        this.zm.executeStep();
        this.updateInfo();
    }

    pressRestart() {
        this.zm = new Zahlenmaschine();
        this.markedInstruction?.clear();
        this.initZahlenmaschine();
    }

    markInstruction(instruction) {
        this.markedInstruction?.clear();
        this.markedInstruction = this.codeMirror.doc.markText({ line: instruction.codePosition, ch: 0 },
            { line: instruction.codePosition, ch: 99 }, { className: "marked" })
    }

    changeIOMode() {
        let interactiveMode = this.interactiveRadioButton.checked;
        this.zm.interactiveIO = interactiveMode;
    }

    addInputPress() {
        let inputText = this.inputFormInput.value;
        this.zm.addInput(inputText);
        this.refreshInputQueue();
    }

    updateInfo() {
        this.accumulatorRow.innerHTML = "<td>Accumulator</td><td>" + this.zm.accumulator + "</td>";
        this.ipRow.innerHTML = "<td>Instruction Pointer</td><td>" + this.zm.instructionPointer + "</td>";
        this.statusRow.innerHTML = "<td>Status</td><td>" + this.zm.status + "</td>";
        this.r0row.innerHTML = "<td>Register r0</td><td>" + this.zm.r0 + "</td>";
        this.r1row.innerHTML = "<td>Register r1</td><td>" + this.zm.r1 + "</td>";
        this.r2row.innerHTML = "<td>Register r2</td><td>" + this.zm.r2 + "</td>";
    }
}