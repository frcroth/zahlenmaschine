let codeEditorNode = document.getElementById("editor")

const euclid = ";zminst v1\n; Implementation of euclidean algorithm in zminst\ninp acc ;Read first argument from prompt / queue\ninp r0 ; Read second argument to r0\nloop: ; a label\nmov r0 r2\nmod acc r0\nmov r2 acc\nneq r0 0 ; compare r0 != 0\njtr loop\nout acc ; output gcd\nend"

var codeMirror = CodeMirror(codeEditorNode, {
    value: euclid,
    lineNumbers: true,
    mode: 'zminst',
    theme: 'ayu-dark',
    firstLineNumber: 0
});

let stopped = false;

async function execute() {
    stopped = false;
    document.zm.enterCode(codeMirror.doc.getValue());
    let executeButton = document.getElementById("execute-button")
    executeButton.setAttribute("onclick", "stop()");
    executeButton.innerHTML = "<i class=\"fa fa-pause\"></i>";
    executeButton.setAttribute("title", "Stop execution");
    while (document.zm.running && !stopped) {
        document.zm.executeStep();
        updateInfo()
        await new Promise(resolve => setTimeout(resolve, 700));
    }
}

function stop() {
    let executeButton = document.getElementById("execute-button")
    executeButton.setAttribute("onclick", "execute()");
    executeButton.setAttribute("title", "Execute program");
    executeButton.innerHTML = "<i class=\"fa fa-play\"></i>";
    stopped = true;
}

function initZM() {
    document.zm.connectWithUI({
        markInstruction: markInstruction,
        refreshInputs: refreshInputQueue,
        refreshOutputs: refreshOutputs,
        refreshStack : refreshStack
    })
    updateInfo();
    changeIOMode();
    refreshInputQueue();
    refreshOutputs();
    refreshStack();
    return document.zm;
}

function restart() {
    document.zm = new Zahlenmaschine();
    initZM();
}

function executeStep() {
    document.zm.enterCode(codeMirror.doc.getValue());
    document.zm.executeStep();
    updateInfo();
}

function updateInfo() {
    document.getElementById("accumulator-value").innerHTML = document.zm.accumulator;
    document.getElementById("instruction-pointer-value").innerHTML = document.zm.instructionPointer;
    document.getElementById("status-value").innerHTML = document.zm.status;
    document.getElementById("r0-value").innerHTML = document.zm.r0;
    document.getElementById("r1-value").innerHTML = document.zm.r1;
    document.getElementById("r2-value").innerHTML = document.zm.r2;
}

function loadFile() {
    const selectedFile = document.getElementById('uploadInput').files[0];
    selectedFile.text().then((text) => codeMirror.swapDoc(CodeMirror.Doc(text, 'zminst')));
}

function addInput() {
    inputText = document.getElementsByClassName("input-text-field")[0].value;
    document.zm.addInput(inputText);
    refreshInputQueue();
}

function refreshInputQueue() {
    let inputs = document.zm.getInput();
    let inputList = document.getElementsByClassName("input-list")[0];
    inputList.innerHTML = "";
    for (input of inputs) {
        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.classList.add("py-0");
        listItem.innerHTML = input;
        inputList.appendChild(listItem);
    }
}

function refreshOutputs() {
    let outputs = document.zm.getOutput();
    let outputList = document.getElementsByClassName("output-list")[0];
    outputList.innerHTML = "";
    for (output of outputs) {
        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.classList.add("py-0");
        listItem.innerHTML = output;
        outputList.appendChild(listItem);
    }
}

function refreshStack() {
    let stack = document.zm.getStack().reverse();
    let stackList = document.getElementsByClassName("stack-list")[0];
    stackList.innerHTML = "";
    for (item of stack) {
        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.classList.add("py-0");
        listItem.classList.add("stack-list-item");
        listItem.innerHTML = item;
        stackList.appendChild(listItem);
    }
}

let markedInstruction;

function markInstruction(instruction) {
    markedInstruction?.clear();
    markedInstruction = codeMirror.doc.markText({ line: instruction.codePosition, ch: 0 }, { line: instruction.codePosition, ch: 99 }, { className: "marked" })
}

function changeIOMode() {
    let interactiveMode = document.getElementById("interactiveRadio").checked;
    document.zm.interactiveIO = interactiveMode;
}

initZM();
