import Zahlenmaschine from "./zahlenmaschine.js";

// Contains functions to create a new zahlenmaschine
export default class ZahlenmaschineBox {
    // This class handles creating elements for a Zahlenmaschine

    constructor(boxNumber) {
        this.boxNumber = boxNumber;
    }

    examples = ["babylonian-sqrt.zminst",
        "factorial.zminst",
        "leibniz-pi.zminst",
        "exponentiation.zminst",
        "euclid.zminst",
        "fibonacci-rec.zminst"]

    async getExample() {
        let exampleURL = "examples/" + this.examples[Math.floor(Math.random() * this.examples.length)];
        let example = new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(this.responseText);
            };
            xhr.onerror = reject;
            xhr.open('GET', exampleURL);
            xhr.send();
        });
        return example;
    }


    getWhiteSpace() {
        let whitespace = document.createElement("span");
        whitespace.innerHTML = "\n      \n      ";
        return whitespace;
    }

    async build() {
        let whitespace = document.createElement("span");
        whitespace.innerHTML = "\n      \n      ";

        this.container = document.createElement("div");
        this.container.id = this.boxNumber;
        this.container.classList.add("card");

        this.mainRow = document.createElement("div");
        this.mainRow.classList.add("row");
        this.container.appendChild(this.mainRow);

        // Code editor
        this.codeRow = document.createElement("div");
        this.codeRow.classList.add("col-sm");
        this.mainRow.appendChild(this.codeRow)

        this.editorContainer = document.createElement("div");
        this.editorContainer.id = "editor-" + this.boxNumber;
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
        this.inputList.classList.add("io-list");
        this.inputList.classList.add("input-list");
        this.inputColumn.appendChild(this.inputList);

        this.inputConnectButton = document.createElement("button");
        this.inputConnectButton.innerText = "Connect to output";
        this.inputConnectButton.title = "Connect input of this machine to another machine's output";
        this.inputConnectButton.classList.add("btn");
        this.inputConnectButton.classList.add("btn-secondary");
        this.inputConnectButton.onclick = () => this.connectInput();
        this.inputColumn.appendChild(this.inputConnectButton);

        this.outputColumn = document.createElement("div");
        this.outputColumn.classList.add("col-s");
        this.outputColumn.classList.add("output");
        this.outputColumn.innerHTML = "<p>Output</p>"
        this.IORow.appendChild(this.outputColumn);

        this.outputList = document.createElement("ul");
        this.outputList.classList.add("list-group");
        this.outputList.classList.add("io-list");
        this.outputList.classList.add("output-list");
        this.outputColumn.appendChild(this.outputList);

        this.outputConnectButton = document.createElement("button");
        this.outputConnectButton.innerText = "Connect to input";
        this.outputConnectButton.title = "Connect output of this machine to another machine's input";
        this.outputConnectButton.classList.add("btn");
        this.outputConnectButton.classList.add("btn-secondary");
        this.outputConnectButton.onclick = () => this.connectOutput();
        this.outputColumn.appendChild(this.outputConnectButton);

        this.controlColumn = document.createElement("div");
        this.controlColumn.classList.add("co-sm");
        this.controlColumn.classList.add("control");
        this.mainRow.appendChild(this.controlColumn);

        this.numberLabel = document.createElement("p");
        this.numberLabel.classList.add("number-label");
        this.numberLabel.innerText = "BOX " + this.boxNumber;
        this.controlColumn.appendChild(this.numberLabel);

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

        this.queueIOContainer = document.createElement("div");
        this.queueIOContainer.classList.add("form-check");

        this.queueRadioButton = document.createElement("input");
        this.queueRadioButton.onchange = () => this.changeIOMode();
        this.queueRadioButton.type = "radio";
        this.queueRadioButton.name = "ioMode" + this.boxNumber;
        this.queueRadioButton.checked = true;
        this.queueRadioButton.classList.add("form-check-input");
        this.queueIOContainer.appendChild(this.queueRadioButton);
        this.queueLabel = document.createElement("label");
        this.queueLabel.innerHTML = "Queue-based IO";
        this.queueLabel.title = "Add inputs via the button, execution will pause until a value is supplied.";
        this.queueIOContainer.appendChild(this.queueLabel);

        this.controlColumn.appendChild(this.queueIOContainer);

        this.popupIOContainer = document.createElement("div");
        this.popupIOContainer.classList.add("form-check");

        this.popupRadioButton = document.createElement("input");
        this.popupRadioButton.onchange = () => this.changeIOMode();
        this.popupRadioButton.type = "radio";
        this.popupRadioButton.name = "ioMode" + this.boxNumber;
        this.popupRadioButton.classList.add("form-check-input");
        this.popupIOContainer.appendChild(this.popupRadioButton);
        this.popupLabel = document.createElement("label");
        this.popupLabel.innerHTML = "Pop-up IO";
        this.popupLabel.title = "Add inputs via prompt, get outputs via alert"
        this.popupIOContainer.appendChild(this.popupLabel)

        this.controlColumn.appendChild(this.popupIOContainer);

        this.clockSpeedLabel = document.createElement("p");
        this.clockSpeedLabel.innerHTML = "Clock speed: 2 Hz";
        this.controlColumn.appendChild(this.clockSpeedLabel);

        this.clockSpeedSlider = document.createElement("input");
        this.clockSpeedSlider.type = "range";
        this.clockSpeedSlider.classList.add("clock-speed-slider");
        this.clockSpeedSlider.min = 50;
        this.clockSpeedSlider.max = 1000;
        this.clockSpeedSlider.value = 500;
        this.clockSpeedSlider.onchange = () => this.changeClockSpeed();
        this.controlColumn.appendChild(this.clockSpeedSlider);

        this.stackLabel = document.createElement("p");
        this.stackLabel.innerHTML = "Stack";
        this.controlColumn.appendChild(this.stackLabel);

        this.stackContainer = document.createElement("div");
        this.stackContainer.classList.add("stack");
        this.controlColumn.appendChild(this.stackContainer);

        this.stackList = document.createElement("div");
        this.stackList.classList.add("stack-list");
        this.stackContainer.appendChild(this.stackList);

        let example = await this.getExample();
        // INIT EDITOR
        this.codeMirror = CodeMirror(this.editorContainer, {
            value: example,
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
            refreshStack: () => this.refreshStack(),
            machineDone: () => this.machineDone(),
            setWarning: (message) => this.setWarning(message)
        })
        this.updateInfo();
        this.stopped = true;
        this.updateExecuteButton();
        this.changeIOMode();
        this.refreshInputQueue();
        this.refreshOutputs();
        this.refreshStack();
        this.changeClockSpeed();
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

    machineDone() {
        // Do something
    }

    changeClockSpeed() {
        this.clockPause = this.clockSpeedSlider.value;
        let frequency = Math.round(1000 / this.clockPause);
        this.clockSpeedLabel.innerHTML = "Clock speed: " + frequency + " Hz";
    }

    refreshStack() {
        let stack = this.zm.getStack().reverse();
        this.addInputsToList(stack, this.stackList, "stack-list-item");
    }

    async pressExecute() {
        this.stopped = false;
        this.zm.enterCode(this.codeMirror.doc.getValue());
        this.updateExecuteButton();
        while (this.zm.running && !this.stopped) {
            await this.zm.executeStep();
            this.updateInfo()
            await new Promise(resolve => setTimeout(resolve, this.clockPause));
        }
    }

    updateExecuteButton() {
        if (this.stopped) {
            this.executeButton.onclick = () => this.pressExecute();
            this.executeButton.setAttribute("title", "Execute program");
            this.executeButton.innerHTML = "<i class=\"fa fa-play\"></i>";
        } else {
            this.executeButton.onclick = () => this.pressStop();
            this.executeButton.innerHTML = "<i class=\"fa fa-pause\"></i>";
            this.executeButton.title = "Stop execution";
        }
    }

    pressStop() {
        this.stopped = true;
        this.updateExecuteButton();
    }

    async pressStep() {
        this.zm.enterCode(this.codeMirror.doc.getValue());
        await this.zm.executeStep();
        this.updateInfo();
    }

    pressRestart() {
        this.zm = new Zahlenmaschine();
        this.markedInstruction?.clear();
        this.initZahlenmaschine();
    }

    setWarning(message) {
        this.removeWarning();

        this.warningBox = document.createElement("div");
        this.warningBox.classList.add("warning");
        this.warningBox.classList.add("row");

        this.warning = document.createElement("p");
        this.warning.innerHTML = message;
        this.warningBox.appendChild(this.warning);

        this.warningCloseBox = document.createElement("div");
        this.warningCloseBox.classList.add("col-sm");
        this.warningCloseBox.classList.add("warning-close-box");
        this.warningCloseBox.onclick = () => this.removeWarning();

        this.warningClose = document.createElement("span");
        this.warningClose.innerHTML = "<b>X</b>";
        this.warningCloseBox.appendChild(this.warningClose);
        this.warningBox.appendChild(this.warningCloseBox);

        this.container.appendChild(this.warningBox);

    }

    removeWarning() {
        this.warningBox?.remove()
    }

    markInstruction(instruction) {
        this.markedInstruction?.clear();
        this.markedInstruction = this.codeMirror.doc.markText({ line: instruction.codePosition, ch: 0 },
            { line: instruction.codePosition, ch: 99 }, { className: "marked" })
    }

    changeIOMode() {
        let interactiveMode = this.popupRadioButton.checked;
        this.inputFormButton.disabled = interactiveMode;
        this.inputFormInput.disabled = interactiveMode;
        if (interactiveMode) {
            this.zm.setInputModeInteractive();
            this.zm.setOutputModeInteractive();
            this.inputFormButton.title = "Only accepts inputs in Queue-Based input mode"
        } else {
            this.zm.setInputModeQueue();
            this.zm.setOutputModeQueue();
            this.inputFormButton.title = "Add an input value. It can be read with the inp operation."
        }
    }

    addInputPress() {
        let inputText = this.inputFormInput.value;
        this.zm.addInput(inputText);
        this.refreshInputQueue();
    }

    static getBoxes() {
        return document.boxes;
    }

    static getMachine(boxNumber) {
        return document["box " + boxNumber];
    }

    async selectBoxPopup(titleString) {
        const { value: machine } = await Swal.fire({
            title: titleString,
            input: 'select',
            inputOptions: ZahlenmaschineBox.getBoxes().map((box) => "BOX " + box.boxNumber),
            inputPlaceholder: 'Some machine',
            showCancelButton: true,
        });
        return machine
    }

    async connectInput() {
        let machine = await this.selectBoxPopup('Select which machine\'s output will be used for this machine\'s input')
        if (machine) {
            let otherBox = ZahlenmaschineBox.getMachine(machine);
            this.zm.connectToOutputOf(otherBox.zm);
        }
    }

    async connectOutput() {
        let machine = await this.selectBoxPopup('Select which machine\'s input will come from this machine\'s output')
        if (machine) {
            let otherBox = ZahlenmaschineBox.getMachine(machine);
            this.zm.connectToInputOf(otherBox.zm);
        }
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
